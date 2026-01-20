import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const translationsDir = path.join(__dirname, '..', 'src', 'translations');
const sourceLocale = 'en.json';

const flattenKeys = (value, prefix = '') => {
  let keys = [];
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      keys = keys.concat(flattenKeys(child, nextPrefix));
    }
  } else if (prefix) {
    keys.push(prefix);
  }
  return keys;
};

const readJson = async (filePath) => {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
};

const listJsonFiles = async () => {
  const files = await readdir(translationsDir);
  return files.filter((file) => file.endsWith('.json')).sort();
};

const main = async () => {
  const files = await listJsonFiles();

  if (!files.includes(sourceLocale)) {
    console.error(`Missing source locale: ${sourceLocale}`);
    process.exit(1);
  }

  const sourcePath = path.join(translationsDir, sourceLocale);
  const sourceData = await readJson(sourcePath);
  const sourceKeys = new Set(flattenKeys(sourceData));

  let hasErrors = false;

  for (const file of files) {
    if (file === sourceLocale) continue;

    const localePath = path.join(translationsDir, file);
    const localeData = await readJson(localePath);
    const localeKeys = flattenKeys(localeData);
    const extraKeys = localeKeys.filter((key) => !sourceKeys.has(key));

    if (extraKeys.length > 0) {
      hasErrors = true;
      console.error(
        `Extra keys found in ${file} (missing in ${sourceLocale}):`,
      );
      for (const key of extraKeys.sort()) {
        console.error(`  - ${key}`);
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log('Translation keys are consistent with en.json.');
};

main().catch((error) => {
  console.error('Failed to validate translations:', error);
  process.exit(1);
});
