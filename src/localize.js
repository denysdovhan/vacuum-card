// Borrowed from:
// https://github.com/custom-cards/boilerplate-card/blob/master/src/localize/localize.ts

import * as en from './translations/en.json';
import * as uk from './translations/uk.json';
import * as nl from './translations/nl.json';
import * as de from './translations/de.json';
import * as fr from './translations/fr.json';
import * as pl from './translations/pl.json';
import * as ru from './translations/ru.json';

var languages = {
  en,
  uk,
  nl,
  de,
  fr,
  pl,
  ru
};

const DEFAULT_LANG = 'en';

export default function localize(string, search, replace) {
  const [section, key] = string.split('.');

  const lang = (localStorage.getItem('selectedLanguage') || DEFAULT_LANG)
    .replace(/['"]+/g, '')
    .replace('-', '_');

  let tranlated;

  try {
    tranlated = languages[lang][section][key];
  } catch (e) {
    tranlated = languages[DEFAULT_LANG][section][key];
  }

  if (tranlated === undefined) {
    tranlated = languages[DEFAULT_LANG][section][key];
  }

  if (tranlated === undefined) {
    return;
  }

  if (search !== '' && replace !== '') {
    tranlated = tranlated.replace(search, replace);
  }

  return tranlated;
}
