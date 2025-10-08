// @ts-check
/**
 * Computes the app base path for SPA routing.
 * - In GitHub Pages user/organization sites the base is '/'
 * - In project pages it's '/<repo-name>/'
 * - In local dev it remains '/'
 * Always returns a leading and trailing slash when not root.
 * @returns {string}
 */
export function getBasePath() {
    try {
        const { hostname, pathname } = window.location;
        // If running on localhost or 127.0.0.1, use root
        if (hostname === 'localhost' || hostname === '127.0.0.1') return '/';

        // GitHub Pages project pages are like: https://user.github.io/repo-name/...
        // pathname starts with '/repo-name/'. Extract first segment as base.
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
            const repo = parts[0];
            return `/${repo}/`;
        }
    } catch (_) { /* ignore */ }
    return '/';
}

/**
 * Prefixes a route path with the computed base path when needed.
 * Ensures single slashes and keeps query/hash intact.
 * @param {string} path - Path like '/', '/add', 'edit/1'
 * @returns {string}
 */
export function withBase(path) {
    const base = getBasePath();
    // Normalize
    const [p, queryHash] = path.split(/([?#].*)/);
    const clean = p.startsWith('/') ? p.slice(1) : p;
    if (base === '/') return `/${clean}${queryHash || ''}`;
    return `${base}${clean}${queryHash || ''}`;
}

/**
 * Removes the base path from a given full pathname for matching routes.
 * @param {string} pathname
 * @returns {string}
 */
export function stripBase(pathname) {
    const base = getBasePath();
    if (base !== '/' && pathname.startsWith(base)) {
        return pathname.slice(base.length - 1); // keep leading '/'
    }
    return pathname;
}


