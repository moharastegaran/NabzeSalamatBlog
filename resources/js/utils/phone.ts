/** Iranian mobile/phone — exactly 11 digits starting with 0 (e.g. 09123456789) */
export function validateIranPhone(phone: string): boolean {
    return /^0\d{10}$/.test(phone);
}

/** Iranian postal code — exactly 10 digits */
export function validatePostalCode(postal: string): boolean {
    return /^\d{10}$/.test(postal);
}
