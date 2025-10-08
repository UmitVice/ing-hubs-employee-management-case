// @ts-check

/**
 * Formats a string of digits into a phone number with parentheses for the country code.
 * Heuristic: country code is the first 1-3 digits.
 * e.g., "1234567" -> "+(123) 4567"
 * e.g., "12" -> "+(12" (no closing parenthesis yet)
 * @param {string | undefined | null} digits
 * @param {number} [countryCodeLength=0] - If provided, specifies the length of the country code to lock in.
 * @returns {string}
 */
export function formatPhoneNumber(digits, countryCodeLength = 0) {
    const d = (digits || '').replace(/\D/g, '');
    if (!d) return '';

    const ccLen = countryCodeLength > 0 ? countryCodeLength : Math.min(3, d.length);
    const cc = d.slice(0, ccLen);
    const number = d.slice(ccLen);

    if (number || countryCodeLength > 0) {
        return `+(${cc}) ${number}`;
    }
    return `+(${cc}`;
}
