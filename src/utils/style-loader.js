const urlToSheetCache = new Map();
const urlToTextCache = new Map();

async function loadStylesheet(url) {
    let href = url;
    // In dev, append a cache-busting query to ensure CSS changes are re-fetched on refresh
    if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
        const sep = href.includes('?') ? '&' : '?';
        href = `${href}${sep}v=${Date.now()}`;
    }
    // Check cache AFTER resolving final href (so cache keys include cache-busting if present)
    if (urlToSheetCache.has(href) && urlToTextCache.has(href)) {
        return { sheet: urlToSheetCache.get(href), cssText: urlToTextCache.get(href) };
    }

    try {
        const response = await fetch(href, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const cssText = await response.text();
        const sheet = new CSSStyleSheet();
        await sheet.replace(cssText);
        urlToSheetCache.set(href, sheet);
        urlToTextCache.set(href, cssText);
        return { sheet, cssText };
    } catch (error) {
        console.error(`Failed to load stylesheet: ${href}`, error);
        // Don't cache failed loads, return null to indicate failure
        return null;
    }
}

export async function adoptStylesheets(renderRoot, urls) {
    // Handle null/undefined renderRoot
    if (!renderRoot) {
        return;
    }

    // Handle invalid urls parameter
    if (!urls || !Array.isArray(urls)) {
        return;
    }

    const hrefs = urls.map(u => (u instanceof URL ? u.href : String(u)));
    // Keep href associated with its load result to avoid index drift
    const results = await Promise.all(hrefs.map(async (href) => ({ href, entry: await loadStylesheet(href) })));

    // Filter out null entries (failed loads)
    const validEntries = results.filter(r => r.entry !== null);

    // If no valid entries, don't add anything
    if (validEntries.length === 0) {
        return;
    }

    const supportsConstructable = !!(renderRoot && 'adoptedStyleSheets' in renderRoot && typeof CSSStyleSheet !== 'undefined' && 'replace' in CSSStyleSheet.prototype);

    if (supportsConstructable) {
        const sheets = validEntries.map(r => r.entry.sheet);
        renderRoot.adoptedStyleSheets = [...renderRoot.adoptedStyleSheets, ...sheets];
    }

    // Always ensure styles are visible (also covers browsers/environments where constructable
    // stylesheets are present but ineffective). Inject <style> once per href.
    validEntries.forEach(({ href, entry }) => {
        const cssText = entry.cssText;
        const marker = `style[data-style-loader-href="${href}"]`;
        if (!renderRoot.querySelector(marker)) {
            const styleEl = document.createElement('style');
            styleEl.setAttribute('data-style-loader-href', href);
            styleEl.textContent = cssText;
            renderRoot.appendChild(styleEl);
        }
    });
}


