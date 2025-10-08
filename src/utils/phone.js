// @ts-check

/**
 * Extracts only local phone digits (Turkey) from an arbitrary input string.
 * Removes non-digits and a leading '90' country code if present.
 * Limits to 10 digits.
 * @param {string} input
 * @returns {string}
 */
export function extractLocalDigits(input) {
    const d = (input || '').replace(/\D/g, '');
    const local = d.startsWith('90') ? d.slice(2) : d;
    return local.slice(0, 10);
}

/**
 * @param {string} localDigits - 0-10 digits (no country code)
 * @returns {string}
 */
export function formatPhoneTR(localDigits) {
    const d = extractLocalDigits(localDigits);
    const groups = [3, 3, 2, 2];
    const parts = [];
    let idx = 0;
    for (const size of groups) {
        if (idx >= d.length) break;
        parts.push(d.slice(idx, idx + size));
        idx += size;
    }
    const tail = parts.join(' ').trim();
    return `+(90)${tail ? ' ' + tail : ' '}`;
}
