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
    return 'en'; // Default locale
}

/**
 * Dynamically loads the required translation file based on the detected locale.
 * This function should be called once when the application starts.
 */
export async function loadMessages() {
    const locale = getLocale();
    try {
        // Use dynamic import for code splitting and only load the necessary file.
        const module = await import(`./${locale}.json`);
        loadedMessages[locale] = module.default || module;
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        
        // If the specific locale failed, try to load the default 'en' messages.
        if (locale !== 'en' && !loadedMessages['en']) {
             const defaultModule = await import(`./en.json`);
             loadedMessages['en'] = defaultModule.default || defaultModule;
        }
    }
}

/**
 * Returns a translated message for the given key, using the current or default locale.
 * @param {string} key - The translation key (e.g., 'save').
 * @param {string[]} [params=[]] - Parameters for placeholder replacement (e.g., {0}, {1}).
 * @returns {string} The translated and formatted text.
 */s
export function t(key, params = []) {
    const locale = getLocale();
    
    let message = loadedMessages[locale]?.[key] 
        || loadedMessages['en']?.[key] 
        || `MISSING_KEY: ${key}`;

    params.forEach((param, index) => {
        message = message.replace(`{${index}}`, param);
    });
    
    return message;
}