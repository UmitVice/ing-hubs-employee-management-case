import {getLocale, t} from './i18n.js';
import {assert} from '@open-wc/testing';

suite('i18n', () => {
  test('getLocale reads documentElement.lang', () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'tr-TR';
    assert.equal(getLocale(), 'tr');
    document.documentElement.lang = 'en-US';
    assert.equal(getLocale(), 'en');
    document.documentElement.lang = old;
  });

  test('t returns key when missing', () => {
    const key = '___missing___';
    const msg = t(key);
    assert.match(msg, /MISSING_KEY/);
  });
});


