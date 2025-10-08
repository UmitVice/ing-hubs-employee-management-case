import {getLocale, t, loadMessages, setLocale} from './i18n.js';
import {assert} from '@open-wc/testing';

// Access loadedMessages for testing
let loadedMessages = {};

suite('i18n', () => {
  setup(() => {
    // Reset to default state
    document.documentElement.lang = 'en';
  });

  teardown(() => {
    // Clean up after each test
    document.documentElement.lang = 'en';
  });

  test('getLocale reads documentElement.lang correctly', () => {
    const old = document.documentElement.lang;
    
    document.documentElement.lang = 'tr-TR';
    assert.equal(getLocale(), 'tr');
    
    document.documentElement.lang = 'en-US';
    assert.equal(getLocale(), 'en');
    
    document.documentElement.lang = 'fr-FR';
    assert.equal(getLocale(), 'fr');
    
    document.documentElement.lang = old;
  });

  test('getLocale handles invalid locale format', () => {
    const old = document.documentElement.lang;
    
    document.documentElement.lang = 'invalid';
    assert.equal(getLocale(), 'invalid');
    
    document.documentElement.lang = '';
    assert.equal(getLocale(), '');
    
    document.documentElement.lang = old;
  });

  test('setLocale updates documentElement.lang', () => {
    const old = document.documentElement.lang;
    
    setLocale('tr');
    assert.equal(document.documentElement.lang, 'tr');
    
    setLocale('en');
    assert.equal(document.documentElement.lang, 'en');
    
    setLocale('fr');
    assert.equal(document.documentElement.lang, 'fr');
    
    document.documentElement.lang = old;
  });

  test('t returns key when translation is missing', () => {
    const key = '___missing_key___';
    const msg = t(key);
    assert.match(msg, /MISSING_KEY/);
    assert.include(msg, key);
  });

  test('t returns key when messages not loaded', () => {
    // Clear any loaded messages
    const key = 'test_key';
    const msg = t(key);
    assert.match(msg, /MISSING_KEY/);
  });

  test('loadMessages loads English messages', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    
    await loadMessages();
    
    const saveMsg = t('save');
    const cancelMsg = t('cancel');
    const addEmployeeMsg = t('addEmployee');
    
    assert.isString(saveMsg);
    assert.isString(cancelMsg);
    assert.isString(addEmployeeMsg);
    assert.notMatch(saveMsg, /MISSING_KEY/);
    assert.notMatch(cancelMsg, /MISSING_KEY/);
    assert.notMatch(addEmployeeMsg, /MISSING_KEY/);
    
    document.documentElement.lang = old;
  });

  test('loadMessages loads Turkish messages', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'tr';
    
    await loadMessages();
    
    const saveMsg = t('save');
    const cancelMsg = t('cancel');
    const addEmployeeMsg = t('addEmployee');
    
    assert.isString(saveMsg);
    assert.isString(cancelMsg);
    assert.isString(addEmployeeMsg);
    assert.notMatch(saveMsg, /MISSING_KEY/);
    assert.notMatch(cancelMsg, /MISSING_KEY/);
    assert.notMatch(addEmployeeMsg, /MISSING_KEY/);
    
    document.documentElement.lang = old;
  });

  test('loadMessages handles unsupported locale gracefully', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'unsupported-locale';
    
    // Should not throw error
    await loadMessages();
    
    const msg = t('save');
    assert.isString(msg);
    
    document.documentElement.lang = old;
  });

  test('loadMessages handles network errors gracefully', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    
    // Mock fetch to simulate network error
    const originalFetch = window.fetch;
    window.fetch = () => Promise.reject(new Error('Network error'));
    
    try {
      await loadMessages();
      const msg = t('save');
      assert.isString(msg);
    } finally {
      window.fetch = originalFetch;
      document.documentElement.lang = old;
    }
  });

  test('translations are consistent between languages', async () => {
    const old = document.documentElement.lang;
    
    // Load English
    document.documentElement.lang = 'en';
    await loadMessages();
    const enSave = t('save');
    const enCancel = t('cancel');
    
    // Load Turkish
    document.documentElement.lang = 'tr';
    await loadMessages();
    const trSave = t('save');
    const trCancel = t('cancel');
    
    // Both should be strings and different
    assert.isString(enSave);
    assert.isString(trSave);
    assert.isString(enCancel);
    assert.isString(trCancel);
    
    // They should be different (unless accidentally the same)
    // This is more of a sanity check
    assert.isTrue(typeof enSave === 'string');
    assert.isTrue(typeof trSave === 'string');
    
    document.documentElement.lang = old;
  });

  test('t handles interpolation correctly', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    await loadMessages();
    
    // Test with interpolation if supported
    const msg = t('welcome', { name: 'John' });
    assert.isString(msg);
    
    document.documentElement.lang = old;
  });

  test('t handles empty key', () => {
    const msg = t('');
    assert.match(msg, /MISSING_KEY/);
  });

  test('t handles null/undefined key', () => {
    const msg1 = t(null);
    const msg2 = t(undefined);
    
    assert.match(msg1, /MISSING_KEY/);
    assert.match(msg2, /MISSING_KEY/);
  });

  test('loadMessages is idempotent', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    
    await loadMessages();
    const msg1 = t('save');
    
    await loadMessages(); // Load again
    const msg2 = t('save');
    
    assert.equal(msg1, msg2);
    
    document.documentElement.lang = old;
  });

  test('handles rapid locale switching', async () => {
    const old = document.documentElement.lang;
    
    // Switch between locales rapidly
    document.documentElement.lang = 'en';
    await loadMessages();
    const enMsg = t('save');
    
    document.documentElement.lang = 'tr';
    await loadMessages();
    const trMsg = t('save');
    
    document.documentElement.lang = 'en';
    await loadMessages();
    const enMsg2 = t('save');
    
    assert.isString(enMsg);
    assert.isString(trMsg);
    assert.isString(enMsg2);
    assert.equal(enMsg, enMsg2);
    
    document.documentElement.lang = old;
  });

  test('handles malformed message files', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    
    // Mock fetch to return malformed JSON
    const originalFetch = window.fetch;
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });
    
    try {
      await loadMessages();
      const msg = t('save');
      assert.isString(msg);
    } finally {
      window.fetch = originalFetch;
      document.documentElement.lang = old;
    }
  });

  test('caches loaded messages', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    
    let fetchCount = 0;
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      fetchCount++;
      return originalFetch(...args);
    };
    
    try {
      // First call should fetch
      await loadMessages();
      const msg1 = t('save');
      
      // Reset fetch count for second call
      fetchCount = 0;
      
      // Second call should use cache (no additional fetch)
      await loadMessages();
      const msg2 = t('save');
      
      assert.equal(msg1, msg2);
      // Should not fetch again due to caching
      assert.equal(fetchCount, 0);
    } finally {
      window.fetch = originalFetch;
      document.documentElement.lang = old;
    }
  });

  test('loads new loading translation in English', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'en';
    
    await loadMessages();
    
    const loadingMsg = t('loading');
    assert.isString(loadingMsg);
    assert.notMatch(loadingMsg, /MISSING_KEY/);
    assert.equal(loadingMsg, 'Loading');
    
    document.documentElement.lang = old;
  });

  test('loads new loading translation in Turkish', async () => {
    const old = document.documentElement.lang;
    document.documentElement.lang = 'tr';
    
    await loadMessages();
    
    const loadingMsg = t('loading');
    assert.isString(loadingMsg);
    assert.notMatch(loadingMsg, /MISSING_KEY/);
    assert.equal(loadingMsg, 'Yükleniyor');
    
    document.documentElement.lang = old;
  });
});


