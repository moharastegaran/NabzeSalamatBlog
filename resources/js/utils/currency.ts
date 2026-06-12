export const CURRENCY_LABEL = 'ریال';

export function formatPrice(amount: number | string): string {
    return `${Number(amount).toLocaleString()} ${CURRENCY_LABEL}`;
}