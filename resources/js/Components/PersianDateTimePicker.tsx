import { useEffect, useRef, useState } from 'react';
import momentJalaali from 'moment-jalaali';

const MONTH_NAMES = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const DAY_NAMES = ['ش','ی','د','س','چ','پ','ج'];

function jDaysInMonth(year: number, month0: number): number {
    if (month0 < 6) return 31;
    if (month0 < 11) return 30;
    return [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33) ? 30 : 29;
}

function jToGreg(jy: number, jm0: number, jd: number): string {
    const g = (momentJalaali as any).jConvert.toGregorian(jy, jm0, jd);
    if (isNaN(g.gy)) return '';
    return `${g.gy}-${String(g.gm + 1).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`;
}

function jFirstDayOfWeek(year: number, month0: number): number {
    const g = (momentJalaali as any).jConvert.toGregorian(year, month0, 1);
    if (isNaN(g.gy)) return 0;
    return (new Date(g.gy, g.gm, g.gd).getDay() + 1) % 7;
}

interface Props {
    value: string;           // 'YYYY-MM-DD HH:mm' or ''
    onChange: (v: string) => void;
    minDateTime?: string;    // 'YYYY-MM-DD HH:mm' — disable/reject dates before this
    placeholder?: string;
    error?: string;
    className?: string;
    nullable?: boolean;      // show clear button even when minDateTime is set
}

export default function PersianDateTimePicker({
    value,
    onChange,
    minDateTime,
    placeholder = 'انتخاب تاریخ و ساعت...',
    error,
    className,
}: Props) {
    const parseValue = (v: string) => {
        if (!v) return null;
        const datePart = v.slice(0, 10);
        const timePart = v.length >= 16 ? v.slice(11, 16) : '00:00';
        const m = momentJalaali(datePart, 'YYYY-MM-DD');
        if (!m.isValid()) return null;
        // jYear()/format('jYYYY') both go through the same broken path in v0.10.x
        // when the moment was parsed with a Gregorian format string.
        // jConvert.toJalaali(gy, gm0, gd) is the internal conversion function that
        // accepts 0-indexed gm (like m.month()) and returns 0-indexed jm.
        const j = (momentJalaali as any).jConvert.toJalaali(m.year(), m.month(), m.date());
        if (isNaN(j.jy)) return null;
        return { y: j.jy, mo: j.jm, d: j.jd, greg: datePart, time: timePart };
    };

    const parsed = parseValue(value);
    const todayM = momentJalaali();
    const todayGreg = todayM.format('YYYY-MM-DD');
    const _todayJ = (momentJalaali as any).jConvert.toJalaali(todayM.year(), todayM.month(), todayM.date());
    const todayJ = { y: _todayJ.jy, mo: _todayJ.jm };

    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, right: 0 });
    const [viewYear, setViewYear] = useState(parsed?.y ?? todayJ.y);
    const [viewMonth, setViewMonth] = useState(parsed?.mo ?? todayJ.mo);
    const [pendingGreg, setPendingGreg] = useState(parsed?.greg ?? '');
    const [pendingTime, setPendingTime] = useState(parsed?.time ?? '00:00');
    const [timeError, setTimeError] = useState('');

    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const p = parseValue(value);
        if (p) {
            setViewYear(p.y);
            setViewMonth(p.mo);
            setPendingGreg(p.greg);
            setPendingTime(p.time);
        } else if (!value) {
            setPendingGreg('');
            setPendingTime('00:00');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (!open) return;
        const onOutside = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!triggerRef.current?.contains(t) && !dropdownRef.current?.contains(t)) {
                setOpen(false);
            }
        };
        const onScroll = () => setOpen(false);
        document.addEventListener('mousedown', onOutside);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('mousedown', onOutside);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, [open]);

    const openPicker = () => {
        if (triggerRef.current) {
            const r = triggerRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
        }
        setTimeError('');
        setOpen(true);
    };

    const displayValue = (() => {
        if (!value) return '';
        const p = parseValue(value);
        if (!p) return '';
        return `${p.y}/${String(p.mo + 1).padStart(2, '0')}/${String(p.d).padStart(2, '0')} ${p.time}`;
    })();

    const minDate = minDateTime ? minDateTime.slice(0, 10) : '';
    const minTime = minDateTime ? minDateTime.slice(11, 16) : '';

    const isDisabled = (greg: string) => !!minDate && greg < minDate;

    const selectDay = (day: number) => {
        const greg = jToGreg(viewYear, viewMonth, day);
        if (!greg) return;
        if (isDisabled(greg)) return;
        setPendingGreg(greg);
        setTimeError('');
    };

    const confirm = () => {
        if (!pendingGreg) return;
        const time = pendingTime || '00:00';
        const combined = `${pendingGreg} ${time}`;
        if (minDateTime && combined < minDateTime.slice(0, 16)) {
            if (pendingGreg === minDate && time < minTime) {
                setTimeError(`ساعت باید حداقل ${minTime} باشد`);
            } else {
                setTimeError('زمان انتخابی باید بزرگ‌تر از حداقل مجاز باشد');
            }
            return;
        }
        setTimeError('');
        onChange(combined);
        setOpen(false);
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setPendingGreg('');
        setPendingTime('00:00');
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const firstDow = jFirstDayOfWeek(viewYear, viewMonth);
    const daysCount = jDaysInMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [
        ...Array(firstDow).fill(null),
        ...Array.from({ length: daysCount }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <>
            <div ref={triggerRef} className={`relative ${className ?? ''}`}>
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openPicker}
                    onKeyDown={e => e.key === 'Enter' && openPicker()}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none ${
                        error
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-indigo-400'
                    }`}
                >
                    <span className={`flex-1 truncate ${displayValue ? 'text-gray-800' : 'text-gray-400'}`}>
                        {displayValue || placeholder}
                    </span>
                    {value && (
                        <button
                            type="button"
                            onClick={clear}
                            className="shrink-0 text-gray-400 hover:text-gray-600"
                            title="پاک کردن"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {open && (
                <div
                    ref={dropdownRef}
                    style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
                    className="w-72 rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                    {/* Month navigation */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
                        <button type="button" onClick={nextMonth} className="rounded p-1 text-gray-500 hover:bg-gray-100">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-gray-800">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button type="button" onClick={prevMonth} className="rounded p-1 text-gray-500 hover:bg-gray-100">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 px-2 pt-2">
                        {DAY_NAMES.map(d => (
                            <div key={d} className="py-1 text-center text-xs font-medium text-gray-400">{d}</div>
                        ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-y-0.5 px-2 pb-2">
                        {cells.map((day, i) => {
                            if (!day) return <div key={i} />;
                            const greg = jToGreg(viewYear, viewMonth, day);
                            const disabled = !greg || isDisabled(greg);
                            const selected = !!greg && pendingGreg === greg;
                            const isToday = !!greg && greg === todayGreg;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => selectDay(day)}
                                    className={`rounded py-1 text-center text-sm transition-colors ${
                                        disabled
                                            ? 'cursor-not-allowed text-gray-200'
                                            : selected
                                            ? 'bg-indigo-600 font-semibold text-white'
                                            : isToday
                                            ? 'font-bold text-indigo-600 hover:bg-indigo-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Time picker */}
                    <div className="border-t border-gray-100 px-3 py-3">
                        <label className="mb-1.5 block text-xs font-medium text-gray-500">ساعت</label>
                        <input
                            type="time"
                            value={pendingTime}
                            onChange={e => { setPendingTime(e.target.value); setTimeError(''); }}
                            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {timeError && <p className="mt-1 text-xs text-red-600">{timeError}</p>}
                    </div>

                    {/* Confirm */}
                    <div className="px-3 pb-3">
                        <button
                            type="button"
                            disabled={!pendingGreg}
                            onClick={confirm}
                            className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            تأیید انتخاب
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
