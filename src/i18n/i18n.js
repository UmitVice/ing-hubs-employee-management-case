// @ts-check
/** @type {Record<string, Record<string, string>>} */
let loadedMessages = {}; 

/**
 * Reads the current language setting from the root HTML's 'lang' attribute.
 * This adheres to the case study requirement.
 * @returns {string} The locale string, 'en' or 'tr'.
 */
export function getLocale() {
    const lang = document.documentElement.lang.toLowerCase();
    if (lang.startsWith('tr')) {
        return 'tr';
    }
    if (lang.startsWith('en')) {
        return 'en';
    }
    if (lang.startsWith('fr')) {
        return 'fr';
    }
    // For empty locales, return empty string
    if (!lang) {
        return '';
    }
    // For invalid locales, return the actual value
    return lang;
}

/**
 * Sets the current language by updating the document's lang attribute.
 * @param {string} locale - The locale string ('en' or 'tr').
 */
export function setLocale(locale) {
    document.documentElement.lang = locale;
}


export async function loadMessages() {
    const locale = getLocale();
    
    // Check if messages are already loaded for this locale
    if (loadedMessages[locale]) {
        document.dispatchEvent(new CustomEvent('language-changed', { detail: { locale } }));
        return;
    }
    
    try {
        const response = await fetch(new URL(`./${locale}.json`, import.meta.url).href, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        loadedMessages[locale] = await response.json();
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Only try to load English if we don't have any messages at all
        if (!loadedMessages['en'] && locale !== 'en') {
            try {
                const respEn = await fetch(new URL('./en.json', import.meta.url).href, { headers: { 'Accept': 'application/json' } });
                if (respEn.ok) loadedMessages['en'] = await respEn.json();
            } catch (_) { /* ignore */ }
        }
    }
    document.dispatchEvent(new CustomEvent('language-changed', { detail: { locale } }));
}

/**
 * Returns a translated message for the given key, using the current or default locale.
 * @param {string} key - The translation key (e.g., 'save').
 * @param {string[]} [params=[]] - Parameters for placeholder replacement (e.g., {0}, {1}).
 * @returns {string} The translated and formatted text.
 */
/**
 * @param {string} key
 * @param {string[]} [params=[]]
 */
export function t(key, params = []) {
    const locale = getLocale();
    
    // Handle null/undefined keys
    if (key == null) {
        return `MISSING_KEY: ${key}`;
    }
    
    let message = loadedMessages[locale]?.[key] 
        || loadedMessages['en']?.[key] 
        || `MISSING_KEY: ${key}`;

    // Handle both array and object parameters
    if (Array.isArray(params)) {
        params.forEach((param, index) => {
            message = message.replace(`{${index}}`, param);
        });
    } else if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            message = message.replace(`{${key}}`, params[key]);
        });
    }
    
    return message;
}