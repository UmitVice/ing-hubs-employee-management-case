// @ts-check

/**
 * Formats an ISO date string (YYYY-MM-DD) to DD/MM/YYYY format.
 * Returns '-' if invalid or empty.
 * @param {string | undefined | null} isoDate
 */
export function formatDateToDDMMYYYY(isoDate) {
    if (!isoDate) return '-';
    try {
        const [year, month, day] = String(isoDate).split('-');
        if (!year || !month || !day) return '-';
        return `${day}/${month}/${year}`;
    } catch (_) {
        return '-';
    }
}

/**
 * Parses a DD/MM/YYYY date string into ISO YYYY-MM-DD. Returns '' if invalid.
 * @param {string} ddmmyyyy
 */
export function parseDDMMYYYYToISO(ddmmyyyy) {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split(/[\/.\-]/g); // accept '/', '.', '-'
    if (parts.length !== 3) return '';
    const [dd, mm, yyyy] = parts;
    if (!/^\d{2}$/.test(dd) || !/^\d{2}$/.test(mm) || !/^\d{4}$/.test(yyyy)) return '';
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);
    if (month < 1 || month > 12 || day < 1 || day > 31) return '';
    // Basic month-day validation (not accounting for leap years in-depth)
    const daysInMonth = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month - 1]) return '';
    const mmStr = String(month).padStart(2, '0');
    const ddStr = String(day).padStart(2, '0');
    return `${year}-${mmStr}-${ddStr}`;
}

/**
 * Helper: formats raw digits to dd/mm/yyyy progressively for input UX.
 * @param {string} raw
 */
export function formatDigitsToDDMMYYYY(raw) {
    const digits = String(raw || '').replace(/\D/g, '').slice(0, 8);
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    let out = dd;
    if (mm) out += `/${mm}`;
    if (yyyy) out += `/${yyyy}`;
    return out;
}
