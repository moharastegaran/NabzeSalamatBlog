/**
 * Validates an Iranian national ID (کد ملی) using the standard check-digit algorithm.
 */
export function validateMelliCode(melli: string): boolean {
    if (!/^\d{10}$/.test(melli)) return false;
    if (/^(\d)\1{9}$/.test(melli)) return false; // all same digits

    const cDigitLast  = parseInt(melli[melli.length - 1]);
    const fMeli       = String(parseInt(melli));

    if (fMeli[0] === '0' && !(fMeli.length >= 8 && fMeli.length < 10)) return false;

    const nineLeftDigits = melli.slice(0, melli.length - 1);

    let positionNumber = 10;
    let result = 0;

    for (const chr of nineLeftDigits) {
        result += parseInt(chr) * positionNumber;
        positionNumber--;
    }

    const remain           = result % 11;
    const controllerNumber = remain >= 2 ? 11 - remain : remain;

    return cDigitLast === controllerNumber;
}
