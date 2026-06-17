import { Link, usePage } from '@inertiajs/react';
import CatMegaMenu, { MENU } from '@/Components/CatMegaMenu';
import { PropsWithChildren, useState, useEffect, useRef } from 'react';
import { PageProps } from '@/types';
import { BlogPost } from '@/types/models';
import axios from 'axios';
import logoSrc from '../../images/logo.png';
import logoSrc2 from '../../images/logo.png';
import rubikalogo from '../../images/rubika.png';
import balelogo from '../../images/bale.webp'
import enamadLogo from '../../images/enamad-temp.png';
interface Props extends PropsWithChildren {
    cartCount?: number;
    floatingHeader?: boolean;
}

export default function ShopLayout({ children, cartCount = 0, floatingHeader = false }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { url } = usePage();
    const pathname = url.split('?')[0];

    const isActive = (path: string) => pathname === path;

    // ── Scroll detection (transparent → white on scroll for floating header) ──
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        if (!floatingHeader) return;
        const onScroll = () => setScrolled(window.scrollY > 56);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [floatingHeader]);

    const isGlass = floatingHeader && !scrolled;

    // ── Search ──
    const [query, setQuery]         = useState('');
    const [results, setResults]     = useState<BlogPost[]>([]);
    const [dropOpen, setDropOpen]   = useState(false);
    const [searching, setSearching] = useState(false);
    const searchWrap  = useRef<HTMLDivElement>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close search dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchWrap.current && !searchWrap.current.contains(e.target as Node)) {
                setDropOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleQueryChange = (q: string) => {
        setQuery(q);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (q.trim().length < 2) { setResults([]); setDropOpen(false); return; }

        searchTimer.current = setTimeout(async () => {
            setSearching(true);
            try {
                const { data } = await axios.get<BlogPost[]>(route('front.blog.search'), { params: { q } });
                setResults(data);
                setDropOpen(true);
            } finally {
                setSearching(false);
            }
        }, 350);
    };

    // ── Dynamic header classes ──
    // Outer <header>: positioning only — transparent so the rounded card floats
    const headerOuter = floatingHeader
        ? 'fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-0'
        : 'sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2';

    // Inner card: bg + rounded + shadow
    const headerInner = floatingHeader
        ? `max-w-shop mx-auto rounded-full transition-all duration-300 py-1 sm:py-2 ${
            scrolled
                ? 'bg-[#F2F2F2]'
                : 'transparent'
          }`
        : 'max-w-shop mx-auto bg-[#F2F2F2] rounded-full shadow-sm py-1.5';

    const textPrimary  = isGlass ? 'text-white'      : 'text-[#404040]';
    const textMuted    = isGlass ? 'text-white/70'   : 'text-[#898A89]';
    const inputBorder  = isGlass ? 'border-[#E6E1F4] bg-white' : 'border-gray-200 bg-white';
    const inputText    = isGlass ? 'text-[#404040] placeholder-[#404040]/45' : 'text-[#404040] placeholder-[#B3B3B4]';

    const navActive   = 'bg-[#B8181E] text-white px-3 py-0.5 rounded-3xl font-semibold text-base';
    const navInactive = isGlass
        ? 'text-[#1F0001]/85 hover:bg-white/15 hover:text-[#B8181E] px-3 py-0.5 rounded-xl font-semibold text-base transition'
        : 'text-[#1F0001] hover:bg-[#F2F2F2] hover:text-[#B8181E] px-3 py-0.5 rounded-xl font-semibold text-base transition';

    const authBtn = isGlass
        ? 'bg-white text-[#1A1528] hover:bg-[#F2F2F2]'
        : 'bg-[#E31F25] hover:bg-[#B8181E] text-white';

    return (
        <div className="min-h-screen" dir="rtl">

            {/* ── Header ── */}
            <header className={headerOuter}>
                <div className={`${headerInner} pl-2 pr-3 sm:px-6 lg:px-8`}>
                    <div className="flex items-center justify-between h-12 sm:h-14 gap-4">

                        {/* Right group: Logo + Nav */}
                        <div className="flex items-center gap-4">
                            <Link href={route('front.landing')} className="flex-shrink-0 sm:mr-0 mr-1">
                                <img src={logoSrc} alt="جی‌سان" className="w-[70px]" />
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                <Link
                                    href={route('front.landing')}
                                    className={isActive('/') ? navActive : navInactive}
                                >
                                    خانه
                                </Link>
                                <CatMegaMenu
                                    triggerClass={navInactive}
                                    activeClass={navActive}
                                    isShopActive={isActive('/shop')}
                                />

                                {/* Credit panel dropdown */}
                                <Link
                                    href={route('login')}
                                    className={navInactive}
                                >
                                    پنل اعتباری
                                </Link>
                            </nav>
                        </div>

                        {/* Left group: Search + Cart + Auth */}
                        <div className="flex items-center gap-3">

                            {/* Search input + dropdown */}
                            <div ref={searchWrap} className="relative block">
                                <div className={`flex items-center rounded-3xl border-2 px-2 py-0 gap-2 transition ${inputBorder}`}>
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={e => handleQueryChange(e.target.value)}
                                        onKeyDown={e => e.key === 'Escape' && setDropOpen(false)}
                                        placeholder="جستجوی محصول..."
                                        className={`bg-transparent outline-0 text-sm w-36 lg:w-48 border-none py-2 ${inputText}`}
                                    />
                                    {searching ? (
                                        <svg className={`hidden sm:block animate-spin h-4 w-4 flex-shrink-0 ${textMuted}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`hidden sm:block h-4 w-4 flex-shrink-0 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Results dropdown */}
                                {dropOpen && results.length > 0 && (
                                    <div className="absolute top-full right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        {results.map(p => {
                                            const img = p.featured_image ? `/storage/${p.featured_image}` : null;
                                            return (
                                                <Link
                                                    key={p.id}
                                                    href={route('front.blog.show', p.slug)}
                                                    onClick={() => { setDropOpen(false); setQuery(''); }}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F2F2F2] transition"
                                                >
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#EEEEEE] flex-shrink-0">
                                                        {img ? (
                                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#D5D5D5]">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-sm text-[#404040] line-clamp-1 flex-1`}>{p.title}</span>
                                                </Link>
                                            );
                                        })}
                                        <Link
                                            href={route('front.blog.index', { search: query })}
                                            onClick={() => setDropOpen(false)}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-[#EEEEEE] text-xs text-[#E31F25] hover:bg-[#F2F2F2] transition font-medium"
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
                                    <div className="absolute top-full right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 z-50">
                                        <p className="text-sm text-[#898A89] text-center">نتیجه‌ای یافت نشد</p>
                                    </div>
                                )}
                            </div>

                            {/* Login / Register */}
                            <Link
                                href={route('customer.login')}
                                className="hidden lg:inline-flex flex-shrink-0 bg-[#E31F25] hover:bg-[#B8181E] text-white text-sm font-semibold px-4 py-2.5 rounded-3xl transition-colors duration-200"
                            >
                                {auth.user ? 'پنل کاربری' : 'ورود/ثبت نام'}
                            </Link>

                        </div>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="bg-white pb-8 lg:pb-0">{children}</main>

            {/* ── Footer ── */}
            <footer className="max-w-shop mx-auto bg-white text-[#404040] lg:mt-16 mt-4 px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-4">

                    <div className="col-span-1 lg:col-span-2 bg-[#F2F2F2] flex flex-col justify-around rounded-2xl gap-6 lg:px-8 lg:py-2 p-4">
                        {/* Logo (right) + Title & description (left) */}
                        <div className="flex items-center gap-6">
                            {/* Logo — first child renders on the right in RTL */}
                            <div className="flex-shrink-0">
                                <img src={logoSrc2} alt="جی‌سان" className="w-20 h-auto opacity-90" />
                            </div>
                            {/* Text — renders to the left of the logo in RTL */}
                            <div className="hidden sm:block">
                                <h4 className="text-lg font-bold text-black">فروشگاه لوازم خانگی جی‌سان</h4>
                                <p className="text-[#6F6F6F] text-base max-w-md mt-2 mb-0">
                                    احترام، پاسخ اعتماد است
                                </p>
                            </div>
                        </div>

                        {/* ── Bottom row: 4 quick-access cols + Enamad ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                            {/* Quick access col 1 */}
                            <div>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href={route('front.about-us')} className="hover:text-[#B8181E] text-base font-medium transition">
                                           درباره ما
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('front.contact')} className="hover:text-[#B8181E] text-base font-medium transition">
                                            تماس با ما
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#B8181E] text-base font-medium transition">
                                            نظرسنجی
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick access col 2 */}
                            <div>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href={route('front.blog.index')} className="hover:text-[#B8181E] text-base font-medium transition">
                                            بلاگ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route('front.gallery')} className="hover:text-[#B8181E] text-base font-medium transition">
                                            گالری
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="/docs/gsun-catalogue.pdf" target="_blank" rel="noreferrer"
                                           className="hover:text-[#B8181E] text-base font-medium transition">
                                            کاتالوگ محصولات
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick access col 3 */}
                            <div>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="hover:text-[#B8181E] text-base font-medium transition">
                                            رویه ارسال سفارش
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#B8181E] text-base font-medium transition">
                                            شیوه‌های پرداخت
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#B8181E] text-base font-medium transition">
                                            شرایط مرجوعی کالا
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick access col 4 */}
                            <div>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="hover:text-[#B8181E] text-base font-medium transition">
                                            رسیدگی به شکایات
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-[#B8181E] text-base font-medium transition">
                                            خدمات پس از فروش
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Col 5 — Enamad (نماد اعتماد الکترونیکی) */}
                            <div className="flex lg:flex-col flex-row">
                                {/* Replace the placeholder below with the actual Enamad embed code */}
                                <div className="flex items-center justify-center">
                                    <img src={enamadLogo} alt="ای نماد جی سان" className="w-16 lg:w-20 bg-white/8 border border-white/12 rounded-xl"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Top row: CTA (35%) + Brand info ── */}
                    <div className="flex flex-col rounded-2xl lg:gap-y-6 gap-y-4">

                        {/* CTA, vertically + horizontally centered */}
                        <div className="bg-[#F2F2F2] flex flex-col items-center justify-center text-center rounded-2xl px-8 lg:py-8 py-6">
                            <h3 className="text-xl font-black mb-3 leading-snug">
                                اعطای نمایندگی
                            </h3>
                            <p className="lg:text-sm text-base font-normal leading-6 lg:mb- 5 mb-3">
                                با دریافت نمایندگی، به جمع شرکای تجاری جی‌سان بپیوندید.  بازاری سودآور و پایدار در انتظار شماست.
                            </p>
                            <a
                                href="#"
                                className="inline-block bg-[#E31F25] hover:bg-[#B8181E] text-white font-bold px-8 py-3 rounded-3xl transition shadow-lg"
                            >
                                درخواست نمایندگی
                            </a>
                        </div>

                        <div className="flex flex-row items-stretch justify-center lg:gap-6 gap-4">
                            {[
                                {
                                    label: 'اینستاگرام',
                                    href: 'https://www.instagram.com/gsun_company',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="lg:w-8 lg:h-8 w-5 h-5">
                                            <path className={'text-purple-600'} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'کارشناس فروش',
                                    href: 'https://wa.me/+989102094818',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="lg:w-8 lg:h-8 w-5 h-5">
                                            <path className={'text-green-500'} d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'لینک  بله',
                                    href: 'https://ble.ir/gsun_support',
                                    icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="40" viewBox="0 0 90 40" fill="none" className={'lg:w-8 lg:h-8 w-5 h-5'}>
                                            <path d="M44.235 12.2185C43.2628 12.2185 42.4743 13.0069 42.4743 13.9772L42.4757 20.3785C42.4757 22.9368 40.39 25.0212 37.8253 25.0212C35.2619 25.0212 33.1733 22.9396 33.1733 20.3814L33.1719 13.98L33.1705 7.14853C33.1705 6.17825 32.3806 5.3913 31.4084 5.3913C30.4362 5.3913 29.6477 6.17966 29.6477 7.14994L29.6491 13.9814L29.6505 20.3828C29.6505 22.941 27.5648 25.0255 25 25.0255C22.4366 25.0255 20.3481 22.9439 20.3481 20.3856C20.3467 15.8867 16.6783 12.2284 12.1719 12.2298C7.66557 12.2312 4 15.8924 4 20.3898C4.00141 24.8873 7.66981 28.5456 12.1762 28.5456C12.7965 28.5456 13.4155 28.4751 14.016 28.3383C14.9642 28.1211 15.5563 27.1776 15.3373 26.2313C15.1196 25.2878 14.1842 24.6912 13.2261 24.9126C12.8841 24.9902 12.5309 25.0311 12.1762 25.0311C9.61281 25.0311 7.52426 22.9495 7.52426 20.3912C7.52426 17.8315 9.60999 15.7485 12.1733 15.7471C14.7381 15.7471 16.8253 17.8287 16.8267 20.3884C16.8281 24.8859 20.4965 28.5442 25.0028 28.5442C27.6029 28.5442 29.9176 27.3214 31.4155 25.4274C32.9147 27.32 35.2294 28.5413 37.8281 28.5413C42.3358 28.5399 46.0014 24.8788 46 20.3814L45.9986 13.98C45.9958 13.0055 45.2073 12.2185 44.235 12.2185Z" fill="#00B894"/>
                                            <path d="M38.6196 31.0632C37.639 31.0632 36.8434 31.8572 36.8434 32.8359C36.8434 33.8147 37.639 34.6087 38.6196 34.6087C39.6003 34.6087 40.3959 33.8147 40.3959 32.8359C40.3959 31.8558 39.6003 31.0632 38.6196 31.0632Z" fill="#00B894"/>
                                            <path d="M72.2139 4.1563C72.2051 4.15482 72.1962 4.15433 72.1878 4.15285C71.9482 4.12031 71.707 4.09171 71.464 4.06952C71.3821 4.06213 71.2993 4.0572 71.2169 4.05079C71.0409 4.03747 70.8649 4.02465 70.6869 4.01726C70.5631 4.01183 70.4383 4.01035 70.3141 4.00789C70.2091 4.00592 70.1055 4 70 4C69.9522 4 69.9043 4.00247 69.8565 4.00296C69.8235 4.00345 69.7909 4.00148 69.7579 4.00197C69.6864 4.00296 69.6159 4.0074 69.5449 4.00937C69.4423 4.01233 69.3393 4.01529 69.2367 4.01972C69.1253 4.02515 69.0148 4.03205 68.9039 4.03994C68.8018 4.04684 68.7002 4.05374 68.5987 4.06262C68.4882 4.07248 68.3787 4.08382 68.2688 4.09565C68.1687 4.1065 68.0681 4.11686 67.9685 4.12968C67.859 4.14348 67.7506 4.15975 67.6416 4.17553C67.5425 4.19032 67.4434 4.20413 67.3452 4.22089C67.2368 4.23914 67.1298 4.25935 67.0223 4.27957C66.9247 4.29781 66.827 4.31556 66.7304 4.33578C66.6229 4.35797 66.5169 4.38262 66.4104 4.40727C66.3147 4.42897 66.2191 4.45017 66.1244 4.47384C66.0174 4.50046 65.9119 4.52955 65.8059 4.55815C65.7127 4.5833 65.619 4.60795 65.5268 4.63458C65.4212 4.66515 65.3172 4.69818 65.2132 4.73122C65.1215 4.75982 65.0297 4.78792 64.9385 4.818C64.835 4.85251 64.7324 4.88998 64.6299 4.92647C64.5396 4.95852 64.4494 4.98958 64.3601 5.02311C64.2576 5.06206 64.156 5.10348 64.0539 5.14441C63.9671 5.17941 63.8794 5.21294 63.7931 5.24943C63.69 5.29282 63.589 5.33917 63.4874 5.38453C63.4036 5.422 63.3192 5.458 63.2359 5.49695C63.1343 5.54428 63.0342 5.59507 62.9337 5.64438C62.8528 5.68431 62.7709 5.72277 62.6906 5.76419C62.5895 5.81646 62.4899 5.87119 62.3903 5.92542C62.3124 5.96783 62.2335 6.00826 62.1566 6.05165C62.054 6.10934 61.9539 6.16998 61.8528 6.23014C61.7803 6.27304 61.7074 6.31445 61.6359 6.35834C61.5269 6.42539 61.4204 6.49541 61.3129 6.56493C61.2513 6.60487 60.6329 7.02743 60.6329 7.02743C60.6329 7.02743 57.7178 4.80616 56.5547 4.20018C55.3915 3.59421 54 4.43834 54 5.74989V8.70336V19.6933C54 19.7983 54 19.9014 54 20C54 28.4822 60.6014 35.4182 68.9463 35.9615C68.9946 35.965 69.0424 35.9694 69.0908 35.9724C69.251 35.9813 69.4127 35.9847 69.574 35.9892C69.6741 35.9921 69.7727 35.9985 69.8733 35.9995C69.8945 35.9995 69.9157 35.9985 69.9369 35.9985C69.9581 35.9985 69.9793 36 70.001 36C70.1213 36 70.2396 35.9936 70.3595 35.9911C70.4941 35.9882 70.6292 35.9872 70.7633 35.9808C70.9033 35.9744 71.0424 35.9625 71.1814 35.9522C71.3141 35.9423 71.4467 35.9349 71.5784 35.9221C71.7164 35.9088 71.853 35.8896 71.9901 35.8728C72.1207 35.8565 72.2524 35.8422 72.3826 35.823C72.5182 35.8028 72.6518 35.7771 72.7864 35.754C72.9156 35.7313 73.0448 35.7106 73.173 35.6849C73.3071 35.6578 73.4392 35.6258 73.5719 35.5957C73.6981 35.5671 73.8248 35.54 73.9496 35.5084C74.0812 35.4749 74.2109 35.4364 74.3411 35.3999C74.4649 35.3649 74.5891 35.3324 74.7114 35.2949C74.8406 35.255 74.9673 35.2106 75.095 35.1677C75.2158 35.1273 75.3381 35.0883 75.4574 35.0449C75.5837 34.9991 75.7074 34.9488 75.8322 34.9C75.9505 34.8536 76.0698 34.8092 76.1872 34.7599C76.3105 34.7082 76.4313 34.652 76.5526 34.5972C76.6679 34.5455 76.7843 34.4957 76.8982 34.4409C77.018 34.3837 77.1354 34.3216 77.2532 34.2614C77.3661 34.2038 77.48 34.1485 77.591 34.0884C77.7069 34.0258 77.8198 33.9587 77.9337 33.8936C78.0436 33.8305 78.1551 33.7694 78.2636 33.7038C78.3765 33.6357 78.4864 33.5633 78.5974 33.4923C78.7034 33.4247 78.8109 33.3586 78.9154 33.2886C79.0249 33.2152 79.1309 33.1373 79.2384 33.0608C79.3409 32.9884 79.4445 32.9173 79.5451 32.8429C79.6506 32.764 79.7531 32.6812 79.8567 32.6003C79.9553 32.5229 80.0549 32.448 80.1516 32.3686C80.2541 32.2843 80.3532 32.196 80.4533 32.1092C80.547 32.0284 80.6427 31.949 80.7344 31.8656C80.833 31.7764 80.9282 31.6827 81.0248 31.591C81.1141 31.5062 81.2053 31.4229 81.2925 31.3356C81.3867 31.2414 81.4775 31.1438 81.5692 31.0471C81.6545 30.9579 81.7413 30.8706 81.8246 30.7794C81.9143 30.6808 82.0001 30.5787 82.0874 30.4777C82.1683 30.3845 82.2511 30.2933 82.3295 30.1981C82.4143 30.096 82.4947 29.99 82.5765 29.8855C82.6535 29.7879 82.7323 29.6922 82.8068 29.5926C82.8862 29.4866 82.9611 29.3771 83.0381 29.2692C83.1105 29.1676 83.185 29.0675 83.2545 28.9644C83.3295 28.854 83.3995 28.7401 83.472 28.6277C83.539 28.5231 83.6081 28.4206 83.6727 28.3146C83.7422 28.2007 83.8068 28.0833 83.8738 27.967C83.936 27.859 84.0006 27.7525 84.0602 27.643C84.1248 27.5237 84.185 27.4019 84.2466 27.2806C84.3028 27.1712 84.361 27.0632 84.4147 26.9522C84.4749 26.828 84.5291 26.7008 84.5863 26.575C84.6366 26.4641 84.6894 26.3541 84.7367 26.2417C84.791 26.1135 84.8398 25.9824 84.8911 25.8527C84.9354 25.7398 84.9828 25.6284 85.0247 25.514C85.0735 25.3813 85.1164 25.2457 85.1618 25.1111C85.2002 24.9967 85.2416 24.8843 85.2776 24.7689C85.3205 24.6314 85.3575 24.4913 85.3965 24.3523C85.429 24.2374 85.4645 24.124 85.4941 24.0081C85.5311 23.8656 85.5612 23.7212 85.5942 23.5772C85.6203 23.4618 85.6499 23.3484 85.6736 23.232C85.7042 23.0841 85.7278 22.9342 85.754 22.7848C85.7742 22.6704 85.7973 22.5575 85.8151 22.4427C85.8393 22.2854 85.8565 22.1261 85.8757 21.9678C85.8891 21.8584 85.9063 21.7504 85.9172 21.6399C85.9354 21.4619 85.9463 21.2815 85.9581 21.1015C85.9645 21.0093 85.9744 20.9181 85.9793 20.8254C85.9926 20.5665 85.9985 20.3057 85.999 20.0434C85.999 20.0291 86 20.0148 86 20C86.001 11.9152 80.0026 5.23464 72.2139 4.1563ZM79.3404 17.9528L70.0503 27.2431C69.4404 27.8526 68.6416 28.1573 67.8423 28.1573C67.043 28.1573 66.2442 27.8526 65.6343 27.2431L60.6605 22.2691C59.4412 21.0497 59.4412 19.073 60.6605 17.8537C61.8799 16.6348 63.8567 16.6348 65.0761 17.8537L67.8428 20.6203L74.9254 13.5374C76.1448 12.3185 78.1215 12.3185 79.3409 13.5374C80.5598 14.7572 80.5598 16.7334 79.3404 17.9528Z" fill="#00B894"/>
                                        </svg>
                                    ),
                                },
                                {
                                    label: 'لینک  روبیکا',
                                    href: 'https://rubika.ir/gsun_support',
                                    icon: (
                                        <img src={rubikalogo} alt="روبیکا" className="lg:w-8 lg:h-8 w-5 h-5" />
                                    ),
                                }
                            ].map(({ label, href, icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="grow bg-[#F2F2F2] rounded-2xl p-5 flex align-center justify-center"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>

                    </div>
                </div>
                {/* ── Copyright bar ── */}
                <div className="max-w-shop mx-auto bg-[#F2F2F2] rounded-2xl py-3 text-center text-[#1F0001] text-sm font-medium mt-4 lg:mb-8 mb-24">
                    © {new Date().getFullYear()} فروشگاه جی‌سان — تمامی حقوق محفوظ است
                </div>
            </footer>

            {/* ── Floating support button ── */}
            <SupportFab />

            {/* ── Mobile bottom nav ── */}
            <BottomNav cartCount={cartCount} auth={auth} pathname={pathname} />
        </div>
    );
}

function BottomNav({ cartCount, auth, pathname }: { cartCount: number; auth: PageProps['auth']; pathname: string }) {
    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

    const [menuOpen, setMenuOpen]   = useState(false);
    const [activeCat, setActiveCat] = useState(MENU[0].id);
    const panelRef   = useRef<HTMLDivElement>(null);
    const shopBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuOpen) return;
            if (panelRef.current?.contains(e.target as Node)) return;
            if (shopBtnRef.current?.contains(e.target as Node)) return;
            setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) setActiveCat(MENU[0].id);
    }, [menuOpen]);

    const activeMenuCat = MENU.find(c => c.id === activeCat);
    const isShopActive  = isActive('/shop');

    const navItemClass = (active: boolean) =>
        `relative flex flex-col items-center gap-1 py-2 flex-1 rounded-full ${active ? 'bg-[#F2F2F2]' : 'bg-white'}`;
    const iconClass    = (active: boolean) => active ? 'text-[#E31F25]' : 'text-[#898A89]';
    const labelClass   = (active: boolean) =>
        `text-[10px] font-bold leading-none ${active ? 'text-[#E31F25]' : 'text-[#898A89]'}`;

    return (
        <>
            {/* ── Mobile category panel (above BottomNav) ── */}
            {menuOpen && (
                <div
                    ref={panelRef}
                    dir="rtl"
                    className="lg:hidden fixed inset-x-4 z-[41] bg-[#F2F2F2] rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
                    style={{ bottom: 'calc(4rem + 14px)' }}
                >
                    <div className="flex max-h-[60vh]">
                        {/* Column 1 – main categories */}
                        <div className="w-2/5 flex-shrink-0 py-1.5 overflow-y-auto">
                            <Link
                                href="/shop"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center px-3 py-2.5 text-xs font-bold text-[#E31F25]"
                            >
                                همه محصولات
                            </Link>
                            <div className="border-t border-gray-200 mx-2 my-1" />
                            {MENU.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    onClick={() => setMenuOpen(false)}
                                    onMouseEnter={() => setActiveCat(cat.id)}
                                    onTouchStart={() => setActiveCat(cat.id)}
                                    className={`flex items-center justify-between px-3 py-2.5 text-xs transition
                                        ${activeCat === cat.id ? 'bg-white text-[#B8181E] font-bold' : 'text-[#1F0001]'}`}
                                >
                                    <span className="leading-snug">{cat.label}</span>
                                    {cat.subs && cat.subs.length > 0 && (
                                        <svg className="w-3 h-3 flex-shrink-0 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Column 2 – sub-items */}
                        <div className="flex-1 bg-white py-1.5 px-1 overflow-y-auto">
                            {activeMenuCat && (
                                <>
                                    <Link
                                        href={activeMenuCat.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-[#404040] hover:text-[#E31F25]"
                                    >
                                        همه {activeMenuCat.label}
                                    </Link>
                                    <div className="border-t border-gray-100 mx-2 my-1" />
                                    {activeMenuCat.subs?.map(sub => (
                                        <Link
                                            key={sub.href}
                                            href={sub.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center px-3 py-2.5 text-sm text-[#555] hover:text-[#E31F25] hover:bg-[#F7F7F7] rounded-lg transition"
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

            {/* ── Bottom nav bar ── */}
            <nav className="lg:hidden fixed bottom-2 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_16px_rgba(0,0,0,0.08)] rounded-full mx-4 px-2 py-0.5">
                <div className="flex items-center justify-around h-16 px-1">

                    {/* Home */}
                    <Link href={route('front.landing')} className={navItemClass(isActive('/'))}>
                        <div className={iconClass(isActive('/'))}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <span className={labelClass(isActive('/'))}>خانه</span>
                    </Link>

                    {/* Shop – toggles category panel */}
                    <button ref={shopBtnRef} onClick={() => setMenuOpen(o => !o)} className={navItemClass(isShopActive || menuOpen)}>
                        <div className={iconClass(isShopActive || menuOpen)}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <span className={labelClass(isShopActive || menuOpen)}>فروشگاه</span>
                    </button>


                    {/* Auth */}
                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        className={navItemClass(isActive('/dashboard') || isActive('/login'))}
                    >
                        <div className={iconClass(isActive('/dashboard') || isActive('/login'))}>
                            {auth.user ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            )}
                        </div>
                        <span className={labelClass(isActive('/dashboard') || isActive('/login'))}>
                            {auth.user ? 'داشبورد' : 'ورود'}
                        </span>
                    </Link>

                </div>
            </nav>
        </>
    );
}

function SupportFab() {
    const [open, setOpen] = useState(false);

    const items = [
        {
            label: 'تماس تلفنی با کارشناسان',
            sub: '021-22004818',
            href: 'tel:002122004818',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
        },
        {
            label: 'پشتیبانی و مشاوره خرید در بله',
            sub: 'کلیک کنید',
            href: 'https://ble.ir/@gsun_support',
            icon: (
                <img src={balelogo} alt="بله" className="sm:w-auto w-[90px]" />
            ),
        },
        {
            label: 'پشتیبانی و مشاوره خرید در روبیکا',
            sub: 'کلیک کنید',
            href: 'https://rubika.ir/gsun_support',
            icon: (
                <img src={rubikalogo} alt="روبیکا" className="sm:w-auto w-[90px]" />
            ),
        },
    ];

    return (
        <div className="fixed bottom-20 left-6 lg:bottom-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
            {/* Action cards */}
            <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
                {items.map(item => (
                    <a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="flex items-center gap-3 bg-white rounded-2xl shadow-lg shadow-black/10 px-4 py-3 min-w-[200px] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150 border border-gray-100"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#E31F25]/10 text-[#E31F25] flex items-center justify-center flex-shrink-0">
                            {item.icon}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800 leading-none">{item.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Main FAB */}
            <button
                onClick={() => setOpen(o => !o)}
                className={`pointer-events-auto w-14 h-14 rounded-full bg-[#E31F25] text-white shadow-lg shadow-[#E31F25]/40 flex items-center justify-center transition-all duration-300 hover:bg-[#B8181E] hover:scale-105 ${open ? 'rotate-45' : ''}`}
                aria-label="پشتیبانی"
            >
                {open ? (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 41 36" fill="none">
                        <path d="M20.4619 2.18208C18.7426 2.18208 17.0402 2.52072 15.4516 3.17868C13.8632 3.83664 12.4198 4.80103 11.2041 6.01678C9.98835 7.23252 9.02396 8.67584 8.36599 10.2643C7.84751 11.516 7.52731 12.8386 7.41485 14.1844C7.99633 14.2082 8.46043 14.6871 8.46043 15.2746V26.185C8.46043 26.7874 7.97195 27.276 7.36939 27.276H3.00524C2.6738 27.276 2.36032 27.1254 2.15329 26.8664C-0.716933 23.2789 -0.716933 18.1806 2.15329 14.5931C2.36032 14.3341 2.6738 14.1835 3.00524 14.1835H5.22633C5.34322 12.5511 5.7219 10.9456 6.35001 9.42925C7.11765 7.57605 8.24275 5.89218 9.66112 4.47381C11.0795 3.05543 12.7634 1.93033 14.6166 1.1627C16.4698 0.395087 18.4559 0 20.4619 0C22.4679 0 24.454 0.395087 26.3072 1.1627C28.1605 1.93033 29.8442 3.05543 31.2625 4.47381C32.6811 5.89218 33.8062 7.57605 34.5738 9.42925C35.2018 10.9456 35.5804 12.5511 35.6974 14.1835H37.9185C38.25 14.1835 38.5633 14.3341 38.7704 14.5931C41.6407 18.1806 41.6407 23.2789 38.7704 26.8664C38.5633 27.1254 38.25 27.276 37.9185 27.276H36.7991C36.5748 29.8351 35.0395 32.1174 32.7142 33.28C32.0507 33.6117 31.3415 33.8423 30.6098 33.9643L25.9171 34.7466V34.9133C25.9171 35.5157 25.4285 36.0043 24.826 36.0043H20.4619C19.8594 36.0043 19.3708 35.5157 19.3708 34.9133V32.7312C19.3708 32.1287 19.8594 31.6402 20.4619 31.6402H24.826C25.3624 31.6402 25.8084 32.0273 25.8998 32.5372L30.2511 31.8119C30.7683 31.7257 31.2695 31.5627 31.7384 31.3283C33.3237 30.5356 34.3894 29.0066 34.605 27.276H33.5543C32.9519 27.276 32.4633 26.7874 32.4633 26.185V15.2746C32.4633 14.6871 32.9274 14.2082 33.509 14.1844C33.3964 12.8386 33.0763 11.516 32.5578 10.2643C31.8997 8.67584 30.9354 7.23252 29.7196 6.01678C28.5039 4.80103 27.0607 3.83664 25.4721 3.17868C23.8836 2.52072 22.1811 2.18208 20.4619 2.18208Z" fill="white"/>
                        <path d="M31.3702 17.4567C31.3702 24.6875 26.4854 30.5492 20.4598 30.5492C14.4342 30.5492 9.54945 24.6875 9.54945 17.4567C9.54945 10.226 14.4342 4.36426 20.4598 4.36426C26.4854 4.36426 31.3702 10.226 31.3702 17.4567Z" fill="white"/>
                    </svg>
                    // <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    //     <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    // </svg>
                )}
            </button>
        </div>
    );
}
