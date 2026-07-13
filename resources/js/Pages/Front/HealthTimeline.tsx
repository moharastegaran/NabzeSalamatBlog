import { useCallback, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import momentJalaali from 'moment-jalaali';
import BlogLayout from '@/Layouts/BlogLayout';

import farvardinPdf  from '../../../images/healthsteps/گاه شمار سلامت- فروردین.pdf?url';
import ordibeheshtPdf from '../../../images/healthsteps/گاه شمار سلامت- اردیبهشت.pdf?url';
import khordadPdf    from '../../../images/healthsteps/گاه شمار سلامت- خرداد.pdf?url';
import tirPdf        from '../../../images/healthsteps/گاه شمار سلامت- تیر.pdf?url';
import mordadPdf     from '../../../images/healthsteps/گاه شمار سلامت- مرداد.pdf?url';
import shahrivarPdf  from '../../../images/healthsteps/گاه شمار سلامت- شهریور.pdf?url';
import mehrPdf       from '../../../images/healthsteps/گاه شمار سلامت- مهر.pdf?url';
import abanPdf       from '../../../images/healthsteps/گاه شمار سلامت- آبان.pdf?url';
import azarPdf       from '../../../images/healthsteps/گاه شمار سلامت- آذر.pdf?url';
import deyPdf        from '../../../images/healthsteps/گاه شمار سلامت- دی.pdf?url';
import bahmanPdf     from '../../../images/healthsteps/گاه شمار سلامت- بهمن.pdf?url';
import esfandPdf     from '../../../images/healthsteps/گاه شمار سلامت- اسفند.pdf?url';

interface MonthEntry {
    index: number;
    name: string;
    short: string;
    pdf: string;
    season: string;
    accent: string;
}

const MONTHS: MonthEntry[] = [
    { index: 0,  name: 'فروردین',  short: 'فرو', pdf: farvardinPdf,  season: 'بهار', accent: '#22c55e' },
    { index: 1,  name: 'اردیبهشت', short: 'ارد', pdf: ordibeheshtPdf, season: 'بهار', accent: '#16a34a' },
    { index: 2,  name: 'خرداد',    short: 'خرد', pdf: khordadPdf,    season: 'بهار', accent: '#15803d' },
    { index: 3,  name: 'تیر',      short: 'تیر', pdf: tirPdf,        season: 'تابستان', accent: '#f59e0b' },
    { index: 4,  name: 'مرداد',    short: 'مرد', pdf: mordadPdf,     season: 'تابستان', accent: '#d97706' },
    { index: 5,  name: 'شهریور',   short: 'شهر', pdf: shahrivarPdf,  season: 'تابستان', accent: '#b45309' },
    { index: 6,  name: 'مهر',      short: 'مهر', pdf: mehrPdf,       season: 'پاییز', accent: '#f97316' },
    { index: 7,  name: 'آبان',     short: 'آبا', pdf: abanPdf,       season: 'پاییز', accent: '#ea580c' },
    { index: 8,  name: 'آذر',      short: 'آذر', pdf: azarPdf,       season: 'پاییز', accent: '#c2410c' },
    { index: 9,  name: 'دی',       short: 'دی',  pdf: deyPdf,        season: 'زمستان', accent: '#3b82f6' },
    { index: 10, name: 'بهمن',     short: 'بهم', pdf: bahmanPdf,     season: 'زمستان', accent: '#2563eb' },
    { index: 11, name: 'اسفند',    short: 'اسف', pdf: esfandPdf,     season: 'زمستان', accent: '#1d4ed8' },
];

function currentMonthIndex(): number {
    return momentJalaali().jMonth();
}

export default function HealthTimeline() {
    const [active, setActive] = useState(currentMonthIndex);
    const [fullscreen, setFullscreen] = useState(false);
    const monthRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const selected = MONTHS[active];

    const goTo = useCallback((index: number) => {
        setActive(index);
        monthRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, []);

    const goPrev = useCallback(() => goTo((active + 11) % 12), [active, goTo]);
    const goNext = useCallback(() => goTo((active + 1) % 12), [active, goTo]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goPrev();
            if (e.key === 'ArrowLeft')  goNext();
            if (e.key === 'Escape')     setFullscreen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goPrev, goNext]);

    useEffect(() => {
        if (!fullscreen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [fullscreen]);

    return (
        <BlogLayout>
            <Head title="گاه‌شمار سلامت | نبض سلامت" />

            {/* Hero */}
            <div className="relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-1.5 bg-[#F24F00]" />
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#F24F00]" />
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#075F26]/20 blur-3xl pointer-events-none" />
                <div className="absolute -right-10 bottom-0 w-56 h-56 rounded-full bg-[#F24F00]/10 blur-2xl pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
                    <span className="inline-block bg-[#F24F00] px-3 py-1 text-xs font-black tracking-widest text-white mb-4">
                        تقویم سلامت
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
                        گاه‌شمار سلامت
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base leading-7 max-w-2xl">
                        مناسبت‌ها و رویدادهای سلامت در هر ماه سال — تقویم اختصاصی نبض سلامت برای آگاهی از ایام مهم حوزه بهداشت و درمان.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">

                {/* Month selector strip */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
                            <span className="inline-block w-3 h-3 bg-[#F24F00]" />
                            انتخاب ماه
                        </h2>
                        <button
                            type="button"
                            onClick={() => goTo(currentMonthIndex())}
                            className="text-xs font-bold text-[#075F26] hover:text-[#F24F00] transition-colors"
                        >
                            ماه جاری
                        </button>
                    </div>

                    <div className="relative">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
                            {MONTHS.map((m) => {
                                const isActive = m.index === active;
                                const isCurrent = m.index === currentMonthIndex();
                                return (
                                    <button
                                        key={m.index}
                                        ref={(el) => { monthRefs.current[m.index] = el; }}
                                        type="button"
                                        onClick={() => goTo(m.index)}
                                        className={`relative flex-shrink-0 snap-center px-4 py-3 min-w-[5.5rem] text-center transition-all border-2 ${
                                            isActive
                                                ? 'border-[#F24F00] bg-[#F24F00] text-white shadow-md scale-[1.02]'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-[#F24F00]/40 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="block text-sm font-black">{m.name}</span>
                                        <span className={`block text-[10px] mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                            {m.season}
                                        </span>
                                        {isCurrent && !isActive && (
                                            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-[#075F26] ring-2 ring-white" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Main viewer */}
                <section className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">

                    {/* Vertical timeline — desktop */}
                    <aside className="hidden lg:block bg-white shadow-sm border-t-4 border-[#075F26] p-5 sticky top-28">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">خط زمانی سال</h3>
                        <ol className="relative space-y-0">
                            <div className="absolute top-2 bottom-2 right-[11px] w-0.5 bg-gray-200" />
                            {MONTHS.map((m) => {
                                const isActive = m.index === active;
                                return (
                                    <li key={m.index}>
                                        <button
                                            type="button"
                                            onClick={() => goTo(m.index)}
                                            className={`relative flex items-center gap-3 w-full py-2.5 pr-1 text-right transition-colors group ${
                                                isActive ? 'text-[#F24F00]' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            <span
                                                className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-black transition-colors ${
                                                    isActive
                                                        ? 'border-[#F24F00] bg-[#F24F00] text-white'
                                                        : 'border-gray-300 bg-white text-gray-400 group-hover:border-[#F24F00]/50'
                                                }`}
                                            >
                                                {(m.index + 1).toLocaleString('fa-IR')}
                                            </span>
                                            <span className={`text-sm ${isActive ? 'font-black' : 'font-medium'}`}>
                                                {m.name}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </aside>

                    {/* PDF viewer card */}
                    <div className="bg-white shadow-sm border-t-4 border-[#F24F00] overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                            <div>
                                <h2 className="text-lg font-black text-gray-900">
                                    گاه‌شمار {selected.name}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    فصل {selected.season} — {(selected.index + 1).toLocaleString('fa-IR')} از ۱۲
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    className="p-2 border border-gray-200 bg-white hover:border-[#F24F00] hover:text-[#F24F00] transition-colors"
                                    aria-label="ماه قبل"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="p-2 border border-gray-200 bg-white hover:border-[#F24F00] hover:text-[#F24F00] transition-colors"
                                    aria-label="ماه بعد"
                                >
                                    <svg className="w-4 h-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <a
                                    href={selected.pdf}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#075F26] border border-[#075F26]/30 hover:bg-[#075F26] hover:text-white transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    دانلود
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setFullscreen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#F24F00] hover:opacity-90 transition-opacity"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                    تمام‌صفحه
                                </button>
                            </div>
                        </div>

                        <div className="relative bg-gray-100" style={{ height: 'min(75vh, 900px)' }}>
                            <iframe
                                key={selected.pdf}
                                src={`${selected.pdf}#view=FitH&toolbar=0`}
                                title={`گاه‌شمار سلامت — ${selected.name}`}
                                className="absolute inset-0 w-full h-full border-0"
                            />
                        </div>
                    </div>
                </section>

                {/* Month cards grid */}
                <section>
                    <h2 className="flex items-center gap-2 text-sm font-black text-gray-900 mb-5">
                        <span className="inline-block w-3 h-3 bg-[#F24F00]" />
                        همه ماه‌های سال
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {MONTHS.map((m) => {
                            const isActive = m.index === active;
                            return (
                                <button
                                    key={m.index}
                                    type="button"
                                    onClick={() => goTo(m.index)}
                                    className={`group text-right bg-white shadow-sm overflow-hidden border-2 transition-all hover:shadow-md ${
                                        isActive ? 'border-[#F24F00] ring-2 ring-[#F24F00]/20' : 'border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    <div
                                        className="h-1.5 w-full"
                                        style={{ backgroundColor: m.accent }}
                                    />
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <span className="text-lg font-black text-gray-900 group-hover:text-[#F24F00] transition-colors">
                                                {m.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5">
                                                {m.season}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-5">
                                            مناسبت‌های سلامت ماه {m.name}
                                        </p>
                                        <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-[#075F26] group-hover:text-[#F24F00] transition-colors">
                                            مشاهده تقویم
                                            <svg className="w-3 h-3 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* Fullscreen modal */}
            {fullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white shrink-0">
                        <span className="text-sm font-bold">
                            گاه‌شمار سلامت — {selected.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href={selected.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 text-xs font-bold border border-white/30 hover:bg-white/10 transition-colors"
                            >
                                باز کردن در تب جدید
                            </a>
                            <button
                                type="button"
                                onClick={() => setFullscreen(false)}
                                className="p-2 hover:bg-white/10 transition-colors"
                                aria-label="بستن"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <iframe
                        key={`fs-${selected.pdf}`}
                        src={`${selected.pdf}#view=FitH`}
                        title={`گاه‌شمار سلامت — ${selected.name}`}
                        className="flex-1 w-full border-0 bg-white"
                    />
                </div>
            )}
        </BlogLayout>
    );
}
