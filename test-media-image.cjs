// Run against the compiled helper with Node 22 or newer.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { MediaImage, MEDIA_REFRESH_MS, validateMediaUrl } = require(process.argv[2]);
const flush = () => new Promise((resolve) => setImmediate(resolve));
const signed = 'https://ha.example/media/local/test.png?authSig=example';
const connection = {};
const source = 'media-source://media_source/local/test.png';

test('accept signed media and reject unsafe or unsigned paths', () => {
  assert.equal(validateMediaUrl('/media/local/test.png?authSig=example', 'https://ha.example'), signed);
  assert.throws(() => validateMediaUrl('/media/local/test.png', 'https://ha.example'));
  assert.throws(() => validateMediaUrl('https://ha.example/media/local/test.png?authSig=', 'https://ha.example'));
  assert.throws(() => validateMediaUrl('javascript:alert(1)', 'https://ha.example'));
  assert.throws(() => validateMediaUrl('', 'https://ha.example'));
  assert.equal(validateMediaUrl('https://example.org/test.png', 'https://ha.example'), 'https://example.org/test.png');
});

test('resolve once, cache through repeated state updates, and clear on detach', async () => {
  let calls = 0;
  const media = new MediaImage(() => {});
  const resolver = async () => { calls++; return signed; };
  try {
    media.sync(source, connection, resolver);
    assert.equal(media.current, undefined);
    media.sync(source, connection, resolver);
    await flush();
    assert.equal(media.current, signed);
    for (let i = 0; i < 100; i++) media.sync(source, connection, resolver);
    await flush();
    assert.equal(calls, 1);
  } finally { media.clear(); }
  assert.equal(media.current, undefined);
});

test('late response cannot replace a new configured image', async () => {
  let finish;
  const media = new MediaImage(() => {});
  try {
    media.sync(source, connection, () => new Promise(r => { finish = r; }));
    await flush();
    media.sync(source + '2', connection, async () => signed + '2');
    await flush();
    finish(signed);
    await flush();
    assert.equal(media.current, signed + '2');
  } finally { media.clear(); }
});

test('failed resolution is not retried automatically', async () => {
  let calls = 0;
  const media = new MediaImage(() => {});
  const resolver = async () => { calls++; throw new Error('403'); };
  try {
    media.sync(source, connection, resolver);
    await flush();
    for (let i = 0; i < 100; i++) { media.sync(source, connection, resolver); media.refreshIfDue(); }
    await flush();
    assert.equal(calls, 1);
    assert.equal(media.current, undefined);
  } finally { media.clear(); }
});

test('failed image load falls back without retry; unrelated errors are ignored', async () => {
  let calls = 0;
  const media = new MediaImage(() => {});
  const resolver = async () => { calls++; return signed; };
  try {
    media.sync(source, connection, resolver);
    await flush();
    media.imageFailed('https://example.org/default.svg');
    assert.equal(media.current, signed);
    media.imageFailed(signed);
    for (let i = 0; i < 100; i++) media.sync(source, connection, resolver);
    await flush();
    assert.equal(media.current, undefined);
    assert.equal(calls, 1);
  } finally { media.clear(); }
});

test('renew before signature expiry, including after a sleeping browser', async () => {
  let now = 1000;
  const originalNow = Date.now;
  Date.now = () => now;
  let calls = 0;
  const media = new MediaImage(() => {});
  const resolver = async () => signed + (++calls);
  try {
    media.sync(source, connection, resolver);
    await flush();
    now += MEDIA_REFRESH_MS - 1;
    assert.equal(media.current, signed + '1');
    media.refreshIfDue();
    now += 60 * 60 * 1000 + 1;
    assert.equal(media.current, undefined);
    media.refreshIfDue();
    await flush();
    assert.equal(media.current, signed + '2');
    assert.equal(calls, 2);
  } finally { media.clear(); Date.now = originalNow; }
});

test('switch connection or detach while pending invalidates old response', async () => {
  let finish;
  const media = new MediaImage(() => {});
  try {
    media.sync(source, connection, () => new Promise(r => { finish = r; }));
    await flush();
    media.clear();
    finish(signed);
    await flush();
    assert.equal(media.current, undefined);
    media.sync(source, {}, async () => signed + 'new');
    await flush();
    assert.equal(media.current, signed + 'new');
  } finally { media.clear(); }
});
