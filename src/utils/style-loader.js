const urlToSheetCache = new Map();
const urlToTextCache = new Map();

async function loadStylesheet(url) {
    if (urlToSheetCache.has(url) && urlToTextCache.has(url)) {
        return { sheet: urlToSheetCache.get(url), cssText: urlToTextCache.get(url) };
    }
    let href = url;
    // In dev, append a cache-busting query to ensure CSS changes are re-fetched on refresh
    if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
        const sep = href.includes('?') ? '&' : '?';
        href = `${href}${sep}v=${Date.now()}`;
    }
    const response = await fetch(href, { cache: 'no-store' });
    const cssText = await response.text();
    const sheet = new CSSStyleSheet();
    await sheet.replace(cssText);
    urlToSheetCache.set(url, sheet);
    urlToTextCache.set(url, cssText);
    return { sheet, cssText };
}

export async function adoptStylesheets(renderRoot, urls) {
    const hrefs = urls.map(u => (u instanceof URL ? u.href : String(u)));
    const entries = await Promise.all(hrefs.map(loadStylesheet));

    const supportsConstructable = !!(renderRoot && 'adoptedStyleSheets' in renderRoot && typeof CSSStyleSheet !== 'undefined' && 'replace' in CSSStyleSheet.prototype);

    if (supportsConstructable) {
        const sheets = entries.map(e => e.sheet);
        renderRoot.adoptedStyleSheets = [...renderRoot.adoptedStyleSheets, ...sheets];
    }

    // Always ensure styles are visible (also covers browsers/environments where constructable
    // stylesheets are present but ineffective). Inject <style> once per href.
    entries.forEach(({ cssText }, index) => {
        const href = hrefs[index];
        const marker = `style[data-style-loader-href="${href}"]`;
        if (!renderRoot.querySelector(marker)) {
            const styleEl = document.createElement('style');
            styleEl.setAttribute('data-style-loader-href', href);
            styleEl.textContent = cssText;
            renderRoot.appendChild(styleEl);
        }
    });
}


