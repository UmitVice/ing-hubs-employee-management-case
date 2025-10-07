const urlToSheetCache = new Map();

async function loadStylesheet(url) {
    if (urlToSheetCache.has(url)) {
        return urlToSheetCache.get(url);
    }
    const response = await fetch(url);
    const cssText = await response.text();
    const sheet = new CSSStyleSheet();
    await sheet.replace(cssText);
    urlToSheetCache.set(url, sheet);
    return sheet;
}

export async function adoptStylesheets(renderRoot, urls) {
    const hrefs = urls.map(u => (u instanceof URL ? u.href : String(u)));
    const sheets = await Promise.all(hrefs.map(loadStylesheet));
    renderRoot.adoptedStyleSheets = [...renderRoot.adoptedStyleSheets, ...sheets];
}


