/**
 * Returns an absolute URL for an asset under the project-level `assets/` folder.
 * Works in GitHub Pages subpaths and local dev, without relying on the current page URL.
 * @param {string} assetRelativePath - Path inside the `assets/` folder, e.g. 'icons/right_arrow.svg'
 * @returns {string}
 */
export function assetUrl(assetRelativePath) {
    return new URL(`../../assets/${assetRelativePath}`, import.meta.url).href;
}


