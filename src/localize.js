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
import * as pt_BR from './translations/pt-BR.json';

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
  pt_BR
};

const DEFAULT_LANG = 'en';

export default function localize(string, search, replace) {
  const [section, key] = string.split('.');

  let langStored;
  
  try {
    langStored = JSON.parse(localStorage.getItem('selectedLanguage'));
  } catch (e) {
    langStored = localStorage.getItem('selectedLanguage');
  };
  
  const lang = (langStored || navigator.language || DEFAULT_LANG)
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
