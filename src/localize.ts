// Borrowed from:
// https://github.com/custom-cards/boilerplate-card/blob/master/src/localize/localize.ts

// Sorted alphabetically
import * as ca from './translations/ca.json';
import * as cn from './translations/cn.json';
import * as cs from './translations/cs.json';
import * as da from './translations/da.json';
import * as de from './translations/de.json';
import * as en from './translations/en.json';
import * as es from './translations/es.json';
import * as fi from './translations/fi.json';
import * as fr from './translations/fr.json';
import * as he from './translations/he.json';
import * as hu from './translations/hu.json';
import * as it from './translations/it.json';
import * as ja from './translations/ja.json';
import * as ko from './translations/ko.json';
import * as lt from './translations/lt.json';
import * as nb from './translations/nb.json';
import * as nl from './translations/nl.json';
import * as nn from './translations/nn.json';
import * as pl from './translations/pl.json';
import * as pt from './translations/pt.json';
import * as pt_br from './translations/pt-BR.json';
import * as ro from './translations/ro.json';
import * as ru from './translations/ru.json';
import * as sv from './translations/sv.json';
import * as tw from './translations/tw.json';
import * as uk from './translations/uk.json';
import * as vi from './translations/vi.json';
import * as zh from './translations/cn.json';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const languages: Record<string, Translations> = {
  ca,
  cn,
  cs,
  da,
  de,
  en,
  es,
  fi,
  fr,
  he,
  hu,
  it,
  ja,
  ko,
  lt,
  nb,
  nl,
  nn,
  pl,
  pt,
  pt_br,
  ro,
  ru,
  sv,
  tw,
  uk,
  vi,
  zh,
};

const DEFAULT_LANG = 'en';

export default function localize(
  str: string,
  search?: string,
  replace?: string,
): string | undefined {
  const [section, key] = str.toLowerCase().split('.');

  let langStored: string | null = null;

  try {
    langStored = JSON.parse(localStorage.getItem('selectedLanguage') ?? '');
  } catch (e) {
    langStored = localStorage.getItem('selectedLanguage');
  }

  const lang = (langStored || navigator.language.split('-')[0] || DEFAULT_LANG)
    .replace(/['"]+/g, '')
    .replace('-', '_');

  let translated: string | undefined;

  try {
    translated = languages[lang][section][key];
  } catch (e) {
    translated = languages[DEFAULT_LANG][section][key];
  }

  if (translated === undefined) {
    translated = languages[DEFAULT_LANG][section][key];
  }

  if (translated === undefined) {
    return;
  }

  if (search && replace) {
    translated = translated?.replace(search, replace);
  }

  return translated;
}
