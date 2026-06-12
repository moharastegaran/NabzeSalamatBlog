import { useEffect, useRef, useState } from 'react';
import momentJalaali from 'moment-jalaali';

const MONTH_NAMES = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const DAY_NAMES = ['ش','ی','د','س','چ','پ','ج']; // Sat Sun Mon Tue Wed Thu Fri

function jDaysInMonth(year: number, month0: number): number {
    if (month0 < 6) return 31;
    if (month0 < 11) return 30;
    const leapPattern = [1, 5, 9, 13, 17, 22, 26, 30];
    return leapPattern.includes(year % 33) ? 30 : 29;
}

function jFirstDayOfWeek(year: number, month0: number): number {
    const m = momentJalaali(`${year}/${month0 + 1}/1`, 'jYYYY/jM/jD');
    return (m.day() + 1) % 7; // Sat=0 Sun=1 ... Fri=6
}

interface Props {
    value: string;       // Gregorian YYYY-MM-DD or ''
    onChange: (gregorian: string) => void;
    className?: string;
    placeholder?: string;
}

export default function PersianDatePicker({ value, onChange, className, placeholder = 'انتخاب تاریخ...' }: Props) {
    const parsedSelected = (() => {
        if (!value) return null;
        const m = momentJalaali(value, 'YYYY-MM-DD');
        return m.isValid() ? { y: m.jYear(), mo: m.jMonth(), d: m.jDate() } : null;
    })();

    const todayM = momentJalaali();
    const todayJ = { y: todayM.jYear(), mo: todayM.jMonth(), d: todayM.jDate() };

    const initView = parsedSelected ?? { y: todayJ.y, mo: todayJ.mo, d: 1 };

    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(initView.y);
    const [viewMonth, setViewMonth] = useState(initView.mo);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync view when value changes externally
    useEffect(() => {
        if (parsedSelected) {
            setViewYear(parsedSelected.y);
            setViewMonth(parsedSelected.mo);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const displayValue = parsedSelected
        ? `${parsedSelected.y}/${String(parsedSelected.mo + 1).padStart(2, '0')}/${String(parsedSelected.d).padStart(2, '0')}`
        : '';

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const selectDay = (d: number) => {
        const m = momentJalaali(`${viewYear}/${viewMonth + 1}/${d}`, 'jYYYY/jM/jD');
        const greg = `${m.year()}-${String(m.month() + 1).padStart(2, '0')}-${String(m.date()).padStart(2, '0')}`;
        onChange(greg);
        setOpen(false);
    };

    const clearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const firstDow = jFirstDayOfWeek(viewYear, viewMonth);
    const daysCount = jDaysInMonth(viewYear, viewMonth);

    const cells: (number | null)[] = [
        ...Array(firstDow).fill(null),
        ...Array.from({ length: daysCount }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div ref={containerRef} className="relative">
            {/* Input trigger */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen(o => !o)}
                onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
                className={`flex cursor-pointer items-center gap-2 ${className ?? ''}`}
            >
                <span className={`flex-1 text-sm ${displayValue ? 'text-gray-800' : 'text-gray-400'}`}>
                    {displayValue || placeholder}
                </span>
                {value && (
                    <button
                        type="button"
                        onClick={clearDate}
                        className="shrink-0 text-gray-400 hover:text-gray-600"
                        title="پاک کردن تاریخ"
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

            {/* Calendar dropdown */}
            {open && (
                <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg">
                    {/* Month/year navigation */}
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

                    {/* Day labels */}
                    <div className="grid grid-cols-7 px-2 pt-2">
                        {DAY_NAMES.map(d => (
                            <div key={d} className="py-1 text-center text-xs font-medium text-gray-400">{d}</div>
                        ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-y-0.5 px-2 pb-3">
                        {cells.map((day, i) => {
                            if (!day) return <div key={i} />;
                            const isSelected = parsedSelected &&
                                parsedSelected.y === viewYear &&
                                parsedSelected.mo === viewMonth &&
                                parsedSelected.d === day;
                            const isToday = todayJ.y === viewYear && todayJ.mo === viewMonth && todayJ.d === day;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => selectDay(day)}
                                    className={`rounded py-1 text-center text-sm transition-colors ${
                                        isSelected
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
                </div>
            )}
        </div>
    );
}