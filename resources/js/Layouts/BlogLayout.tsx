import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect, useRef } from 'react';
import { PageProps } from '@/types';
import { BlogPost } from '@/types/models';
import axios from 'axios';
import logoSrc from '../../images/logo.png';

// ── Static category menu (matches seeded data) ────────────────────────────────
const BLOG_MENU = [
    {
        id: 'salamat-omumi',
        label: 'سلامت عمومی',
        slug: 'salamat-omumi',
        subs: [
            { label: 'بهداشت فردی',      slug: 'behdasht-fardi' },
            { label: 'پیشگیری از بیماری', slug: 'pishgiri' },
        ],
    },
    {
        id: 'taghzie-salem',
        label: 'تغذیه سالم',
        slug: 'taghzie-salem',
        subs: [
            { label: 'رژیم غذایی',       slug: 'rezim-ghazayi' },
            { label: 'مکمل‌های غذایی',   slug: 'mokamelha-ghazayi' },
        ],
    },
    {
        id: 'varzesh-va-tanasob',
        label: 'ورزش و تناسب اندام',
        slug: 'varzesh-va-tanasob',
        subs: [
            { label: 'یوگا و مدیتیشن', slug: 'yoga-va-mediteyshan' },
        ],
    },
    {
        id: 'salamat-ravan',
        label: 'سلامت روان',
        slug: 'salamat-ravan',
        subs: [
            { label: 'مدیریت استرس', slug: 'modiriyat-stress' },
        ],
    },
    {
        id: 'bimariyha-va-pishgiri',
        label: 'بیماری‌ها و پیشگیری',
        slug: 'bimariyha-va-pishgiri',
        subs: [
            { label: 'پیشگیری از بیماری', slug: 'pishgiri' },
        ],
    },
];

export default function BlogLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const { url }  = usePage();
    const pathname = url.split('?')[0];
    const isActive = (path: string) =>
        pathname === path || (path !== '/' && pathname.startsWith(path));

    // ── Persian date (updates every minute) ──────────────────────────────────
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(t);
    }, []);
    const persianDate = now.toLocaleDateString('fa-IR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // ── Search ────────────────────────────────────────────────────────────────
    const [query,     setQuery]     = useState('');
    const [results,   setResults]   = useState<BlogPost[]>([]);
    const [dropOpen,  setDropOpen]  = useState(false);
    const [searching, setSearching] = useState(false);
    const searchWrap  = useRef<HTMLDivElement>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (searchWrap.current && !searchWrap.current.contains(e.target as Node))
                setDropOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const handleQueryChange = (q: string) => {
        setQuery(q);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (q.trim().length < 2) { setResults([]); setDropOpen(false); return; }
        searchTimer.current = setTimeout(async () => {
            setSearching(true);
            try {
                const { data } = await axios.get<BlogPost[]>(
                    route('front.blog.search'), { params: { q } }
                );
                setResults(data);
                setDropOpen(true);
            } finally {
                setSearching(false);
            }
        }, 350);
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">

            {/* ════════════════════════════════════════════
                HEADER
            ════════════════════════════════════════════ */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">

                {/* ── 1 · Topbar ───────────────────────────────────────────── */}
                <div className="bg-gray-50 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-9 text-xs text-gray-500">

                            {/* Right: today's Persian date */}
                            <div className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#B8181E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{persianDate}</span>
                            </div>

                            {/* Left: secondary links + social icons */}
                            <div className="flex items-center gap-4">

                                {/* Secondary nav */}
                                <nav className="hidden sm:flex items-center gap-3 divide-x divide-x-reverse divide-gray-200">
                                    <Link href={route('front.about-us')} className="hover:text-[#B8181E] transition-colors pr-3 first:pr-0">
                                        درباره ما
                                    </Link>
                                    <Link href={route('front.contact')} className="hover:text-[#B8181E] transition-colors pr-3">
                                        تماس با ما
                                    </Link>
                                    <a href="#" className="hover:text-[#B8181E] transition-colors pr-3">
                                        آگهی
                                    </a>
                                </nav>

                                {/* Social icons */}
                                <div className="flex items-center gap-2.5">
                                    {/* Instagram */}
                                    <a href="#" target="_blank" rel="noreferrer" aria-label="اینستاگرام"
                                       className="text-gray-400 hover:text-[#B8181E] transition-colors">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    {/* Telegram */}
                                    <a href="#" target="_blank" rel="noreferrer" aria-label="تلگرام"
                                       className="text-gray-400 hover:text-[#B8181E] transition-colors">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                        </svg>
                                    </a>
                                    {/* WhatsApp */}
                                    <a href="#" target="_blank" rel="noreferrer" aria-label="واتساپ"
                                       className="text-gray-400 hover:text-[#B8181E] transition-colors">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2 · Main header ──────────────────────────────────────── */}
                <div className="border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 gap-4">

                            {/* Right: Logo */}
                            <Link href={route('front.landing')} className="flex-shrink-0">
                                <img src={logoSrc} alt="نبض سلامت" className="h-10 w-auto" />
                            </Link>

                            {/* Center: Search */}
                            <div ref={searchWrap} className="relative flex-1 max-w-xl">
                                <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-2 gap-2 focus-within:border-[#B8181E] focus-within:bg-white focus-within:shadow-sm transition-all">
                                    {searching ? (
                                        <svg className="animate-spin h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={e => handleQueryChange(e.target.value)}
                                        onKeyDown={e => e.key === 'Escape' && setDropOpen(false)}
                                        placeholder="جستجو در مقالات سلامت..."
                                        className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                                    />
                                </div>

                                {/* Results */}
                                {dropOpen && results.length > 0 && (
                                    <div className="absolute top-full right-0 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        {results.map(p => {
                                            const img = p.featured_image ? `/storage/${p.featured_image}` : null;
                                            return (
                                                <Link
                                                    key={p.id}
                                                    href={route('front.blog.show', p.slug)}
                                                    onClick={() => { setDropOpen(false); setQuery(''); }}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition"
                                                >
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {img ? (
                                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-700 line-clamp-1 flex-1">{p.title}</span>
                                                </Link>
                                            );
                                        })}
                                        <Link
                                            href={route('front.blog.index', { search: query })}
                                            onClick={() => setDropOpen(false)}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-gray-100 text-xs text-[#B8181E] hover:bg-gray-50 transition font-medium"
                                        >
                                            مشاهده همه نتایج
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}

                                {/* No results */}
                                {dropOpen && results.length === 0 && query.trim().length >= 2 && !searching && (
                                    <div className="absolute top-full right-0 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 z-50">
                                        <p className="text-sm text-gray-400 text-center">نتیجه‌ای یافت نشد</p>
                                    </div>
                                )}
                            </div>

                            {/* Left: Login / Register */}
                            <Link
                                href={auth.user ? route('dashboard') : route('login')}
                                className="hidden sm:inline-flex flex-shrink-0 items-center gap-2 bg-[#E31F25] hover:bg-[#B8181E] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {auth.user ? 'پنل کاربری' : 'ورود / ثبت‌نام'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── 3 · Bottom bar — comprehensive nav ───────────────────── */}
                <nav className="hidden md:block bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ul className="flex items-stretch">

                            {/* Home */}
                            <li>
                                <Link
                                    href={route('front.landing')}
                                    className={`flex items-center px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                        isActive('/') && !isActive('/blog')
                                            ? 'text-[#B8181E] border-[#B8181E]'
                                            : 'text-gray-600 border-transparent hover:text-[#B8181E] hover:border-[#B8181E]/30'
                                    }`}
                                >
                                    خانه
                                </Link>
                            </li>

                            {/* All articles */}
                            <li>
                                <Link
                                    href={route('front.blog.index')}
                                    className={`flex items-center px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                        pathname === '/blog'
                                            ? 'text-[#B8181E] border-[#B8181E]'
                                            : 'text-gray-600 border-transparent hover:text-[#B8181E] hover:border-[#B8181E]/30'
                                    }`}
                                >
                                    همه مقالات
                                </Link>
                            </li>

                            {/* Category items with dropdown */}
                            {BLOG_MENU.map(cat => (
                                <li key={cat.id} className="relative group">
                                    <Link
                                        href={route('front.blog.category', cat.slug)}
                                        className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                            isActive(`/blog/category/${cat.slug}`)
                                                ? 'text-[#B8181E] border-[#B8181E]'
                                                : 'text-gray-600 border-transparent group-hover:text-[#B8181E] group-hover:border-[#B8181E]/30'
                                        }`}
                                    >
                                        {cat.label}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-px opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Link>

                                    {/* Dropdown panel */}
                                    <div className="absolute top-full right-0 w-48 bg-white border border-gray-100 rounded-b-xl rounded-tl-xl shadow-lg z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-150 py-1.5">
                                        {cat.subs.map(sub => (
                                            <Link
                                                key={sub.slug}
                                                href={route('front.blog.category', sub.slug)}
                                                className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                                                    isActive(`/blog/category/${sub.slug}`)
                                                        ? 'text-[#B8181E] bg-red-50 font-medium'
                                                        : 'text-gray-600 hover:text-[#B8181E] hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#E31F25]/60 flex-shrink-0" />
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                            ))}

                        </ul>
                    </div>
                </nav>

            </header>

            {/* ══ Page content ══ */}
            <main className="bg-white pb-8 lg:pb-0">{children}</main>

            {/* ════════════════════════════════════════════
                FOOTER
            ════════════════════════════════════════════ */}
            <footer className="bg-white border-t border-gray-100 mt-12" dir="rtl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        {/* Brand column */}
                        <div className="md:col-span-1 flex flex-col gap-4">
                            <Link href={route('front.landing')}>
                                <img src={logoSrc} alt="نبض سلامت" className="h-10 w-auto opacity-90" />
                            </Link>
                            <p className="text-sm text-gray-500 leading-7">
                                نبض سلامت، منبع معتبر مقالات پزشکی و سبک زندگی سالم به زبان فارسی.
                            </p>
                            {/* Social icons */}
                            <div className="flex items-center gap-3 mt-1">
                                {[
                                    { label: 'اینستاگرام', href: '#', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                                    { label: 'تلگرام',      href: '#', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
                                ].map(({ label, href, icon }) => (
                                    <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                                       className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#E31F25] hover:text-white text-gray-500 flex items-center justify-center transition-colors">
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-4">دسته‌بندی‌ها</h4>
                            <ul className="space-y-2.5">
                                {BLOG_MENU.map(cat => (
                                    <li key={cat.id}>
                                        <Link href={route('front.blog.category', cat.slug)}
                                              className="text-sm text-gray-500 hover:text-[#B8181E] transition-colors">
                                            {cat.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick links */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-4">دسترسی سریع</h4>
                            <ul className="space-y-2.5">
                                <li><Link href={route('front.landing')}    className="text-sm text-gray-500 hover:text-[#B8181E] transition-colors">صفحه اصلی</Link></li>
                                <li><Link href={route('front.blog.index')} className="text-sm text-gray-500 hover:text-[#B8181E] transition-colors">همه مقالات</Link></li>
                                <li><Link href={route('front.about-us')}   className="text-sm text-gray-500 hover:text-[#B8181E] transition-colors">درباره ما</Link></li>
                                <li><Link href={route('front.contact')}    className="text-sm text-gray-500 hover:text-[#B8181E] transition-colors">تماس با ما</Link></li>
                                <li><a href="#"                            className="text-sm text-gray-500 hover:text-[#B8181E] transition-colors">آگهی در نبض سلامت</a></li>
                            </ul>
                        </div>

                        {/* Contact info */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-4">ارتباط با ما</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#B8181E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@nabzesalamat.ir
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#B8181E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    ۰۲۱-۲۲۰۰۴۸۱۸
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Copyright bar */}
                <div className="border-t border-gray-100 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-400">
                        © {new Date().getFullYear()} نبض سلامت — تمامی حقوق محفوظ است
                    </div>
                </div>
            </footer>

            {/* ── Mobile bottom nav ── */}
            <MobileBottomNav auth={auth} pathname={pathname} />

        </div>
    );
}

// ── Mobile bottom navigation ──────────────────────────────────────────────────
function MobileBottomNav({
    auth,
    pathname,
}: {
    auth: PageProps['auth'];
    pathname: string;
}) {
    const isActive = (path: string) =>
        pathname === path || (path !== '/' && pathname.startsWith(path));

    const [catOpen, setCatOpen] = useState(false);
    const [activeCat, setActiveCat] = useState(BLOG_MENU[0].id);
    const panelRef  = useRef<HTMLDivElement>(null);
    const catBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!catOpen) return;
            if (panelRef.current?.contains(e.target as Node)) return;
            if (catBtnRef.current?.contains(e.target as Node)) return;
            setCatOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [catOpen]);

    useEffect(() => { if (!catOpen) setActiveCat(BLOG_MENU[0].id); }, [catOpen]);

    const activeItem = BLOG_MENU.find(c => c.id === activeCat);

    const itemCls  = (active: boolean) =>
        `relative flex flex-col items-center gap-1 py-2 flex-1 rounded-full ${active ? 'bg-gray-100' : ''}`;
    const iconCls  = (active: boolean) => active ? 'text-[#E31F25]' : 'text-gray-400';
    const labelCls = (active: boolean) =>
        `text-[10px] font-bold leading-none ${active ? 'text-[#E31F25]' : 'text-gray-400'}`;

    return (
        <>
            {/* Category slide-up panel */}
            {catOpen && (
                <div
                    ref={panelRef}
                    dir="rtl"
                    className="lg:hidden fixed inset-x-4 z-[41] bg-gray-50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
                    style={{ bottom: 'calc(4rem + 14px)' }}
                >
                    <div className="flex max-h-[60vh]">
                        {/* Parent categories */}
                        <div className="w-2/5 flex-shrink-0 py-1.5 overflow-y-auto">
                            <Link
                                href={route('front.blog.index')}
                                onClick={() => setCatOpen(false)}
                                className="flex items-center px-3 py-2.5 text-xs font-bold text-[#E31F25]"
                            >
                                همه مقالات
                            </Link>
                            <div className="border-t border-gray-200 mx-2 my-1" />
                            {BLOG_MENU.map(cat => (
                                <button
                                    key={cat.id}
                                    onMouseEnter={() => setActiveCat(cat.id)}
                                    onTouchStart={() => setActiveCat(cat.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition text-right ${
                                        activeCat === cat.id ? 'bg-white text-[#B8181E] font-bold' : 'text-gray-700'
                                    }`}
                                >
                                    <span className="leading-snug">{cat.label}</span>
                                    <svg className="w-3 h-3 flex-shrink-0 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        {/* Sub-categories */}
                        <div className="flex-1 bg-white py-1.5 px-1 overflow-y-auto">
                            {activeItem && (
                                <>
                                    <Link
                                        href={route('front.blog.category', activeItem.slug)}
                                        onClick={() => setCatOpen(false)}
                                        className="flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-gray-700 hover:text-[#E31F25]"
                                    >
                                        همه {activeItem.label}
                                    </Link>
                                    <div className="border-t border-gray-100 mx-2 my-1" />
                                    {activeItem.subs.map(sub => (
                                        <Link
                                            key={sub.slug}
                                            href={route('front.blog.category', sub.slug)}
                                            onClick={() => setCatOpen(false)}
                                            className="flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-[#E31F25] hover:bg-gray-50 rounded-lg transition"
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom nav bar */}
            <nav className="lg:hidden fixed bottom-2 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_16px_rgba(0,0,0,0.08)] rounded-full mx-4 px-2 py-0.5">
                <div className="flex items-center justify-around h-16 px-1">

                    {/* Home */}
                    <Link href={route('front.landing')} className={itemCls(isActive('/') && !isActive('/blog'))}>
                        <div className={iconCls(isActive('/') && !isActive('/blog'))}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <span className={labelCls(isActive('/') && !isActive('/blog'))}>خانه</span>
                    </Link>

                    {/* Blog */}
                    <Link href={route('front.blog.index')} className={itemCls(isActive('/blog') && !catOpen)}>
                        <div className={iconCls(isActive('/blog') && !catOpen)}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <span className={labelCls(isActive('/blog') && !catOpen)}>مقالات</span>
                    </Link>

                    {/* Categories */}
                    <button ref={catBtnRef} onClick={() => setCatOpen(o => !o)} className={itemCls(catOpen)}>
                        <div className={iconCls(catOpen)}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                        <span className={labelCls(catOpen)}>دسته‌ها</span>
                    </button>

                    {/* Auth */}
                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        className={itemCls(isActive('/dashboard') || isActive('/login'))}
                    >
                        <div className={iconCls(isActive('/dashboard') || isActive('/login'))}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                {auth.user ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                )}
                            </svg>
                        </div>
                        <span className={labelCls(isActive('/dashboard') || isActive('/login'))}>
                            {auth.user ? 'داشبورد' : 'ورود'}
                        </span>
                    </Link>

                </div>
            </nav>
        </>
    );
}
