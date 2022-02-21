// Borrowed from:
// https://github.com/custom-cards/boilerplate-card/blob/master/src/localize/localize.ts

import * as en from './translations/en.json';
import * as uk from './translations/uk.json';
import * as nl from './translations/nl.json';
import * as de from './translations/de.json';
import * as fr from './translations/fr.json';
import * as pl from './translations/pl.json';
import * as it from './translations/it.json';
import * as ru from './translations/ru.json';
import * as es from './translations/es.json';
import * as cs from './translations/cs.json';
import * as hu from './translations/hu.json';
import * as he from './translations/he.json';
import * as sv from './translations/sv.json';
import * as nb from './translations/nb.json';
import * as nn from './translations/nn.json';
import * as da from './translations/da.json';
import * as ko from './translations/ko.json';
import * as fi from './translations/fi.json';
import * as ca from './translations/ca.json';
import * as tw from './translations/tw.json';
import * as vi from './translations/vi.json';
import * as lt from './translations/lt.json';
import * as ro from './translations/ro.json';
import * as pt from './translations/pt.json';
import * as cn from './translations/cn.json';

var languages = {
  en,
  uk,
  nl,
  de,
  fr,
  pl,
  it,
  ru,
  es,
  cs,
  hu,
  he,
  sv,
  nb,
  nn,
  da,
  ko,
  fi,
  ca,
  tw,
  vi,
  lt,
  ro,
  pt,
  cn,
};

const DEFAULT_LANG = 'en';

export default function localize(string, search, replace) {
  const [section, key] = string.toLowerCase().split('.');

  let langStored;

  try {
    langStored = JSON.parse(localStorage.getItem('selectedLanguage'));
  } catch (e) {
    langStored = localStorage.getItem('selectedLanguage');
  }

  const lang = (langStored || navigator.language.split('-')[0] || DEFAULT_LANG)
    .replace(/['"]+/g, '')
    .replace('-', '_');

  let translated;

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

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }

  return translated;
}
