// @ts-check

/**
 * Formats an ISO date string (YYYY-MM-DD) to DD/MM/YYYY format.
 * If the input is invalid or empty, it returns an empty string.
 * @param {string | undefined | null} isoDate - The date string in YYYY-MM-DD format.
 * @returns {string} The formatted date string or '-' if invalid.
 */
export function formatDateToDDMMYYYY(isoDate) {
    if (!isoDate) return '-';
    try {
        const [year, month, day] = isoDate.split('-');
        if (!year || !month || !day) return '-';
        return `${day}.${month}.${year}`;
    } catch (e) {
        return '-';
    }
}
