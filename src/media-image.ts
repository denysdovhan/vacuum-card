/** Resolve protected media without ever requesting its unsigned HTTP path. */
export const MEDIA_REFRESH_MS = 23 * 60 * 60 * 1000;

/** Validate resolver output before assigning it to an image element. */
export function validateMediaUrl(url: string, base: string): string {
  if (!url) throw new Error('Empty media URL');
  const parsed = new URL(url, base);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Unsupported media URL protocol');
  }
  if (
    parsed.pathname.startsWith('/media/') &&
    !parsed.searchParams.get('authSig')
  ) {
    throw new Error('Unsigned local media URL');
  }
  return parsed.href;
}

type Resolve = (source: string) => Promise<string>;

export class MediaImage {
  private source?: string;
  private connection?: object;
  private resolve?: Resolve;
  private url?: string;
  private expires = 0;
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private pending = false;
  private failed = false;

  constructor(private readonly changed: () => void) {}

  public sync(
    source: string | undefined,
    connection: object | undefined,
    resolve: Resolve,
  ): void {
    if (source === this.source && connection === this.connection) {
      this.refreshIfDue();
      return;
    }
    this.clear();
    this.source = source;
    this.connection = connection;
    this.resolve = resolve;
    if (source && connection) {
      this.load();
    }
  }

  public get current(): string | undefined {
    return Date.now() < this.expires ? this.url : undefined;
  }

  public get hasFailed(): boolean {
    return this.failed;
  }

  public refreshIfDue(): void {
    if (
      this.source &&
      this.connection &&
      !this.pending &&
      !this.failed &&
      !this.current
    ) {
      this.load();
    }
  }

  /** A failed HTTP load is terminal for this source/connection; no retry loop. */
  public imageFailed(url: string): void {
    if (!this.url || this.url !== url) return;
    ++this.generation;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.url = undefined;
    this.expires = 0;
    this.pending = false;
    this.failed = true;
    this.changed();
  }

  public clear(): void {
    ++this.generation;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.source = undefined;
    this.connection = undefined;
    this.resolve = undefined;
    this.url = undefined;
    this.expires = 0;
    this.pending = false;
    this.failed = false;
  }

  private load(): void {
    const source = this.source;
    const resolve = this.resolve;
    if (!source || !resolve || this.pending || this.failed) return;
    clearTimeout(this.timer);
    this.timer = undefined;
    const generation = ++this.generation;
    const started = Date.now();
    this.pending = true;
    this.url = undefined;
    this.expires = 0;
    this.changed();
    void Promise.resolve()
      .then(() => {
        if (generation !== this.generation) return undefined;
        return resolve(source);
      })
      .then((url) => {
        if (generation !== this.generation) return;
        if (!url || started + MEDIA_REFRESH_MS <= Date.now()) {
          throw new Error('Invalid or stale media resolution');
        }
        this.pending = false;
        this.url = url;
        this.expires = started + MEDIA_REFRESH_MS;
        this.timer = setTimeout(
          () => this.refreshIfDue(),
          Math.max(0, this.expires - Date.now()),
        );
        this.changed();
      })
      .catch(() => {
        if (generation !== this.generation) return;
        this.pending = false;
        this.failed = true;
        this.url = undefined;
        this.expires = 0;
        this.changed();
      });
  }
}
