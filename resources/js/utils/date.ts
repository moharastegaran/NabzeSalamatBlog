import momentJalaali from 'moment-jalaali';

momentJalaali.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

export function toJalali(date: string | Date, includeTime = false): string {
    const format = includeTime ? 'jYYYY/jMM/jDD HH:mm' : 'jYYYY/jMM/jDD';
    return momentJalaali(date).format(format);
}

export function toRelative(date: string | Date): string {
    return momentJalaali(date).fromNow();
}

const PD = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Convert an ISO date label (YYYY-MM-DD) from the chart backend into a Jalali string. */
export function toJalaliLabel(isoDate: string, range: string): string {
    const m = momentJalaali(isoDate, 'YYYY-MM-DD');
    if (!m.isValid()) return isoDate;

    if (range === 'annual') return m.format('jYYYY');

    const jMonth = m.jMonth() + 1; // 1–12

    if (range === 'quarterly') {
        return `فصل ${PD[Math.ceil(jMonth / 3)]} ${m.format('jYYYY')}`;
    }

    if (range === 'half_year') {
        return `نیمه ${PD[jMonth <= 6 ? 1 : 2]} ${m.format('jYYYY')}`;
    }

    // monthly (default)
    return m.format('jMMMM jYYYY');
}