import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { PageProps, NavCategory, ContactInfoItem, ContactInfoIcon, ContactInfoType } from '@/types';
import { BlogPost } from '@/types/models';
import axios from 'axios';
import { SOCIAL_LINKS } from '@/constants/socials';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function BlogLayout({ children }: PropsWithChildren) {
    const { auth, navCategories, breakingNews, footerQuickLinks, footerBrand, contactInfos } = usePage<PageProps>().props;
    const { url }  = usePage();
    const pathname = url.split('?')[0];
    const isActive = (path: string) =>
        pathname === path || (path !== '/' && pathname.startsWith(path));

    // ── Persian date ──────────────────────────────────────────────────────────
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(t);
    }, []);
    const persianWeekday = now.toLocaleDateString('fa-IR', { weekday: 'long' });
    const persianDate = persianWeekday + '، ' + now.toLocaleDateString('fa-IR', {
        year: 'numeric', month: 'long', day: '2-digit',
    });
    const persianTime = now.toLocaleTimeString('fa-IR', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const persianDateTime = `${persianDate} | ${persianTime}`;

    // ── Breaking news rotation ────────────────────────────────────────────────
    const [bnIdx, setBnIdx] = useState(0);
    const [prevBnIdx, setPrevBnIdx] = useState<number | null>(null);
    useEffect(() => {
        if (breakingNews.length <= 1) return;
        const t = setInterval(() => {
            setBnIdx(cur => {
                setPrevBnIdx(cur);
                return (cur + 1) % breakingNews.length;
            });
        }, 4000);
        return () => clearInterval(t);
    }, [breakingNews.length]);

    // ── Search ────────────────────────────────────────────────────────────────
    const [adModalOpen, setAdModalOpen] = useState(false);
    const [menuOpen,    setMenuOpen]    = useState(false);

    const [query,     setQuery]     = useState('');
    const [results,   setResults]   = useState<BlogPost[]>([]);
    const [dropOpen,  setDropOpen]  = useState(false);
    const [searching, setSearching] = useState(false);
    const searchWrap  = useRef<HTMLDivElement>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchWrap.current && !searchWrap.current.contains(e.target as Node))
                setDropOpen(false);
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
            <header className="sticky top-0 z-50 shadow-md">

                {/* ── 1 · Dark topbar ──────────────────────────────────────── */}
                <div className="bg-[#042F10] text-gray-300 text-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center sm:justify-between h-8">

                            {/* Right: secondary links */}
                            <div className="flex items-center gap-4">
                                <nav className="hidden sm:flex items-center gap-0 divide-x divide-x-reverse divide-gray-700">
                                    <Link href={route('front.about-us')} className="hover:text-white transition-colors px-3">
                                        درباره ما
                                    </Link>
                                    <Link href={route('front.health-timeline')} className="hover:text-white transition-colors px-3">
                                        گاه‌شمار سلامت
                                    </Link>
                                    <Link href={route('front.contact')} className="hover:text-white transition-colors px-3">
                                        تماس با ما
                                    </Link>
                                    <button onClick={() => setAdModalOpen(true)} className="hover:text-white transition-colors px-3">
                                        درخواست تبلیغات
                                    </button>
                                </nav>
                            </div>

                            {/* Left: date */}
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-[#F8F8F8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{persianDateTime}</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ── 2 · White logo + search bar ──────────────────────────── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                        {/*
                          Mobile  : two rows — [Logo | Hamburger] then [Search full-width]
                          Desktop : single row — Logo | Search | Socials | Auth
                        */}
                        <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-2 md:flex-nowrap md:h-20 md:gap-6">

                            {/* Hamburger — mobile only, pushed to left end of row 1 */}
                            <button
                                onClick={() => setMenuOpen(true)}
                                aria-label="منوی ناوبری"
                                className="md:hidden flex-shrink-0 ml-auto flex flex-col justify-center items-center gap-1.5 w-9 h-9 text-gray-700 hover:text-[#F24F00] transition-colors"
                            >
                                <span className="block w-5 h-0.5 bg-current" />
                                <span className="block w-5 h-0.5 bg-current" />
                                <span className="block w-3.5 h-0.5 bg-current self-end" />
                            </button>

                            {/* Logo */}
                            <Link href={route('front.landing')} className="flex-shrink-0">
                                <ApplicationLogo className="h-16 md:h-20 w-auto" />
                            </Link>

                            {/* Search — wraps to its own full-width row on mobile */}
                            <div ref={searchWrap} className="relative w-full pb-1 md:pb-0 md:w-auto md:flex-1 md:max-w-lg order-last md:order-none">
                                <div className="flex items-center border border-gray-300 bg-white py-0 px-2 sm:px-3 sm:py-2 gap-0.5 sm:gap-2 focus-within:border-[#F24F00] transition-colors">
                                    {searching ? (
                                        <svg className="animate-spin h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={e => handleQueryChange(e.target.value)}
                                        onKeyDown={e => e.key === 'Escape' && setDropOpen(false)}
                                        placeholder="جستجو در نبض سلامت..."
                                        className="bg-transparent outline-none text-sm flex-1 p-2 text-gray-700 placeholder-gray-400 border-none"
                                    />
                                </div>

                                {dropOpen && results.length > 0 && (
                                    <div className="absolute top-full right-0 mt-0 w-full bg-white shadow-xl border border-gray-200 overflow-hidden z-50">
                                        {results.map(p => (
                                            <Link
                                                key={p.id}
                                                href={route('front.blog.show', p.slug)}
                                                onClick={() => { setDropOpen(false); setQuery(''); }}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition"
                                            >
                                                <div className="w-10 h-10 overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {p.featured_image ? (
                                                        <img src={`/storage/${p.featured_image}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-700 line-clamp-1 flex-1">{p.title}</span>
                                            </Link>
                                        ))}
                                        <Link
                                            href={route('front.blog.index', { search: query })}
                                            onClick={() => setDropOpen(false)}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-50 text-xs text-[#F24F00] hover:bg-gray-100 transition font-semibold"
                                        >
                                            مشاهده همه نتایج
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}

                                {dropOpen && results.length === 0 && query.trim().length >= 2 && !searching && (
                                    <div className="absolute top-full right-0 mt-0 w-full bg-white shadow-xl border border-gray-200 px-4 py-3 z-50">
                                        <p className="text-sm text-gray-400 text-center">نتیجه‌ای یافت نشد</p>
                                    </div>
                                )}
                            </div>

                            {/* Socials — desktop only */}
                            <div className="hidden md:flex items-center gap-6 text-gray-800">
                                {SOCIAL_LINKS.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.key}
                                            href={social.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            className="hover:text-[#F24F00] transition-colors"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Auth — desktop only */}
                            {auth.user && (
                                <Link
                                    href={route('dashboard')}
                                    className="hidden md:inline-flex flex-shrink-0 items-center gap-2 bg-[#F24F00] hover:bg-[#075F26] text-white text-sm font-bold px-5 py-2 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    پنل مدیریت
                                </Link>
                            )}

                        </div>
                    </div>
                </div>

                {/* ── 3 · Navigation bar — desktop only ───────────────────── */}
                <nav className="hidden md:block bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ul className="flex items-stretch">

                            <li>
                                <Link
                                    href={route('front.landing')}
                                    className={`flex items-center px-6 py-3 text-sm font-bold border-l border-[#F24F00]/20 transition-colors ${
                                        isActive('/') && !isActive('/blog')
                                            ? 'text-[#F24F00]'
                                            : 'text-black/90 hover:text-[#F24F00]'
                                    }`}
                                >
                                    صفحه اصلی
                                </Link>
                            </li>

                            {navCategories.map(cat => (
                                <li key={cat.id} className="relative group">
                                    <Link
                                        href={route('front.blog.category', cat.slug)}
                                        className={`flex items-center gap-1 px-6 py-3 text-sm font-bold border-l border-[#F24F00]/20 transition-colors ${
                                            isActive(`/blog/category/${cat.slug}`)
                                                ? 'text-[#F24F00]'
                                                : 'text-black/90 hover:text-[#F24F00]'
                                        }`}
                                    >
                                        {cat.name}
                                        {cat.children.length > 0 && (
                                            <svg className="h-3 w-3 mt-px opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </Link>

                                    {cat.children.length > 0 && (
                                        <div className="absolute top-full right-0 w-48 bg-white border border-gray-200 shadow-xl z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-150 py-1">
                                            {cat.children.map(sub => (
                                                <Link
                                                    key={sub.slug}
                                                    href={route('front.blog.category', sub.slug)}
                                                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                                                        isActive(`/blog/category/${sub.slug}`)
                                                            ? 'text-[#F24F00] bg-red-50 font-bold'
                                                            : 'text-gray-700 hover:text-[#F24F00] hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="w-1 h-4 bg-[#F24F00] flex-shrink-0" />
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}

                        </ul>
                    </div>
                </nav>

            </header>

            {/* ── Breaking news ── */}
            {breakingNews.length > 0 && (
                <div className="max-w-7xl mx-auto mt-4 mb-4" dir="rtl">
                    <div className="bg-gray-900 mx-4 sm:mx-6 lg:mx-8">
                        <div className="flex items-stretch">
                            <div className="flex-shrink-0 bg-[#F24F00] flex items-center gap-2 px-3 sm:px-6">
                                <span className="animate-pulse w-2 h-2 rounded-full bg-white flex-shrink-0" />
                                <span className="text-white text-xs font-black whitespace-nowrap">اخبار فوری</span>
                            </div>
                            <div className="flex-1 relative h-16 sm:h-10 overflow-hidden">
                                {breakingNews.map((item, i) => {
                                    const isCurrent = i === bnIdx;
                                    const isPrev    = i === prevBnIdx;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`absolute inset-0 flex items-center px-4 transition-all duration-500 ease-in-out ${
                                                isCurrent ? 'opacity-100 translate-y-0'  :
                                                isPrev    ? 'opacity-0 -translate-y-3'   :
                                                            'opacity-0 translate-y-3'
                                            }`}
                                        >
                                            {item.url ? (
                                                <Link href={item.url}
                                                   className="text-gray-200 text-sm hover:text-[#F24F00] transition-colors w-full">
                                                    {item.title}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-200 text-sm w-full">{item.title}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Page content ══ */}
            <main className="pb-8">{children}</main>

            {/* ════════════════════════════════════════════
                FOOTER
            ════════════════════════════════════════════ */}
            <footer className="bg-gray-900 text-gray-400 mt-10" dir="rtl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_2fr_1.5fr_1.5fr] gap-8">

                        {/* Brand */}
                        <div className="md:col-span-1 flex flex-col gap-4">
                            <Link href={route('front.landing')}>
                                <ApplicationLogo className="object-contain w-auto brightness-0 invert opacity-80" />
                            </Link>
                            <div
                                className="text-sm leading-6 text-gray-400 [&_p]:m-0 [&_p+p]:mt-2 [&_a]:text-[#F24F00] hover:[&_a]:underline [&_strong]:font-semibold [&_em]:italic"
                                dangerouslySetInnerHTML={{
                                    __html: footerBrand?.html
                                        || 'نبض سلامت، تپش آگاهی و امید در مسیر سلامت جامعه است.<br />با ما همراه باشید تا تازه‌ترین اخبار، تحلیل‌ها و محتوای تخصصی در حوزه سلامت و دارو را دنبال کنید.',
                                }}
                            />
                            <div className="flex items-center gap-2 mt-1">
                                {SOCIAL_LINKS.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.key}
                                            href={social.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={social.label}
                                            className="w-8 h-8 bg-gray-800 hover:bg-[#F24F00] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h4 className="text-sm font-black text-white mb-4 pb-2 border-b border-gray-700">دسته‌بندی‌ها</h4>
                            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                                {navCategories.map(cat => (
                                    <li key={cat.id}>
                                        <Link href={route('front.blog.category', cat.slug)}
                                              className="text-sm text-gray-400 hover:text-[#F24F00] transition-colors flex items-center gap-2">
                                            <span className="w-1 h-1 bg-[#F24F00] flex-shrink-0" />
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick links */}
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-black text-white mb-4 pb-2 border-b border-gray-700">
                                {footerQuickLinks?.section_title ?? 'دسترسی سریع'}
                            </h4>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-[3fr_2fr] items-start align-top">
                                {(footerQuickLinks?.links ?? []).map(({ label, href }, index) => (
                                    <li key={`${index}-${href}`}>
                                        <a href={href} target="_blank" rel="noreferrer"
                                           className="text-sm text-gray-400 hover:text-[#F24F00] transition-colors flex items-center gap-2">
                                            <span className="w-1 h-1 bg-[#F24F00] flex-shrink-0" />
                                            {label}
                                        </a>
                                    </li>
                                ))}
                                {/* <li>
                                    <button onClick={() => setAdModalOpen(true)}
                                            className="text-sm text-gray-400 hover:text-[#F24F00] transition-colors flex items-center gap-2">
                                        <span className="w-1 h-1 bg-[#F24F00] flex-shrink-0" />
                                        ثبت آگهی در نبض سلامت
                                    </button>
                                </li> */}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-black text-white mb-4 pb-2 border-b border-gray-700">ارتباط با ما</h4>
                            <ul className="space-y-3.5">
                                {groupFooterContactInfos(contactInfos ?? []).map((group, i) => (
                                    <FooterContactItem key={`${group.type}-${i}`} group={group} />
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Copyright */}
                <div className="bg-black/40 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} نبض سلامت — تمامی حقوق محفوظ است
                    </div>
                </div>
            </footer>

            {/* ── Mobile side menu ── */}
            <MobileSideMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                navCategories={navCategories}
                auth={auth}
                pathname={pathname}
                onAdvertiseClick={() => { setMenuOpen(false); setAdModalOpen(true); }}
            />

            <AdvertiseModal open={adModalOpen} onClose={() => setAdModalOpen(false)} />

        </div>
    );
}

// ── Mobile side menu (slides from right) ─────────────────────────────────────
function MobileSideMenu({
    open,
    onClose,
    navCategories,
    auth,
    pathname,
    onAdvertiseClick,
}: {
    open: boolean;
    onClose: () => void;
    navCategories: NavCategory[];
    auth: PageProps['auth'];
    pathname: string;
    onAdvertiseClick: () => void;
}) {
    const isActive = (path: string) =>
        pathname === path || (path !== '/' && pathname.startsWith(path));

    const [expandedCat, setExpandedCat] = useState<number | null>(null);

    // close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <div className={`md:hidden fixed inset-0 z-[100] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} dir="rtl">

            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Panel — slides from right */}
            <div className={`absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#042F10]">
                    <span className="text-sm font-black text-white">منو</span>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-2">

                    {/* Home */}
                    <Link
                        href={route('front.landing')}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold border-b border-gray-50 transition-colors ${
                            isActive('/') && !isActive('/blog') ? 'text-[#F24F00] bg-red-50' : 'text-gray-800 hover:text-[#F24F00] hover:bg-gray-50'
                        }`}
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        صفحه اصلی
                    </Link>

                    {/* Blog */}
                    <Link
                        href={route('front.blog.index')}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold border-b border-gray-50 transition-colors ${
                            isActive('/blog') && expandedCat === null ? 'text-[#F24F00] bg-red-50' : 'text-gray-800 hover:text-[#F24F00] hover:bg-gray-50'
                        }`}
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        اخبار
                    </Link>

                    {/* Categories accordion */}
                    {navCategories.map(cat => (
                        <div key={cat.id}>
                            <button
                                onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold border-b border-gray-50 transition-colors ${
                                    isActive(`/blog/category/${cat.slug}`) ? 'text-[#F24F00] bg-red-50' : 'text-gray-800 hover:text-[#F24F00] hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F24F00] flex-shrink-0" />
                                    {cat.name}
                                </div>
                                {cat.children.length > 0 && (
                                    <svg
                                        className={`w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${expandedCat === cat.id ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>

                            {cat.children.length > 0 && expandedCat === cat.id && (
                                <div className="bg-gray-50 border-b border-gray-100">
                                    <Link
                                        href={route('front.blog.category', cat.slug)}
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-8 py-2.5 text-xs font-black text-gray-700 hover:text-[#F24F00] transition-colors border-b border-gray-100"
                                    >
                                        همه {cat.name}
                                    </Link>
                                    {cat.children.map(sub => (
                                        <Link
                                            key={sub.slug}
                                            href={route('front.blog.category', sub.slug)}
                                            onClick={onClose}
                                            className={`flex items-center gap-2 px-8 py-2.5 text-xs border-b border-gray-100 last:border-0 transition-colors ${
                                                isActive(`/blog/category/${sub.slug}`) ? 'text-[#F24F00] font-bold' : 'text-gray-600 hover:text-[#F24F00]'
                                            }`}
                                        >
                                            <span className="w-1 h-3 bg-[#F24F00] flex-shrink-0" />
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Secondary links */}
                    <div className="mt-2 pt-2">
                        <Link href={route('front.about-us')} onClick={onClose}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#F24F00] hover:bg-gray-50 transition-colors">
                            درباره ما
                        </Link>
                        <Link href={route('front.health-timeline')} onClick={onClose}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#F24F00] hover:bg-gray-50 transition-colors">
                            گاه‌شمار سلامت
                        </Link>
                        <Link href={route('front.contact')} onClick={onClose}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#F24F00] hover:bg-gray-50 transition-colors">
                            تماس با ما
                        </Link>
                        <button onClick={onAdvertiseClick}
                                className="w-full text-right flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#F24F00] hover:bg-gray-50 transition-colors">
                            درخواست تبلیغات
                        </button>
                    </div>
                </nav>

                {/* Auth footer */}
                <div className="border-t border-gray-100 p-4">
                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full bg-[#F24F00] hover:bg-[#d44400] text-white text-sm font-bold py-2.5 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {auth.user ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            )}
                        </svg>
                        {auth.user ? 'پنل مدیریت' : 'ورود به حساب'}
                    </Link>
                </div>

            </div>
        </div>
    );
}

// ── Footer contact item ───────────────────────────────────────────────────────

const FOOTER_CONTACT_ICONS: Record<ContactInfoIcon, ReactNode> = {
    building: (
        <svg className="h-4 w-4 text-[#F24F00] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    ),
    phone: (
        <svg className="h-4 w-4 text-[#F24F00] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
    ),
    whatsapp: (
        <svg className="h-4 w-4 text-[#F24F00] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    email: (
        <svg className="h-4 w-4 text-[#F24F00] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
    ),
};

function defaultContactIcon(type: ContactInfoType): ContactInfoIcon {
    switch (type) {
        case 'address': return 'building';
        case 'phone': return 'phone';
        case 'whatsapp': return 'whatsapp';
        case 'email': return 'email';
    }
}

function contactHref(info: ContactInfoItem): string | null {
    switch (info.type) {
        case 'email':
            return `mailto:${info.value}`;
        case 'phone':
            return `tel:${info.value.replace(/[^\d+]/g, '')}`;
        case 'whatsapp': {
            const digits = info.value.replace(/\D/g, '');
            const normalized = digits.startsWith('98')
                ? digits
                : digits.startsWith('0')
                    ? `98${digits.slice(1)}`
                    : digits;
            return `https://wa.me/${normalized}`;
        }
        default:
            return null;
    }
}

type FooterContactGroup = {
    type: ContactInfoType;
    items: ContactInfoItem[];
};

function groupFooterContactInfos(infos: ContactInfoItem[]): FooterContactGroup[] {
    const groups: FooterContactGroup[] = [];
    let whatsappGroup: FooterContactGroup | null = null;

    for (const info of infos) {
        if (info.type === 'whatsapp') {
            if (!whatsappGroup) {
                whatsappGroup = { type: 'whatsapp', items: [info] };
                groups.push(whatsappGroup);
            } else {
                whatsappGroup.items.push(info);
            }
            continue;
        }

        groups.push({ type: info.type, items: [info] });
    }

    return groups;
}

function FooterContactItem({ group }: { group: FooterContactGroup }) {
    const first = group.items[0];
    const iconKey = (first.icon || defaultContactIcon(group.type)) as ContactInfoIcon;
    const icon = FOOTER_CONTACT_ICONS[iconKey] ?? FOOTER_CONTACT_ICONS.building;

    if (group.type === 'whatsapp') {
        return (
            <li className="flex items-start gap-2 text-sm">
                {icon}
                <div className="space-y-1">
                    {group.items.map((info, i) => (
                        <a
                            key={`${info.value}-${i}`}
                            href={contactHref(info) ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            dir="ltr"
                            className="block hover:text-white transition-colors text-right"
                        >
                            {info.value}
                        </a>
                    ))}
                </div>
            </li>
        );
    }

    const href = contactHref(first);
    const description = first.description?.trim() || null;

    return (
        <li className="flex items-start gap-2 text-sm">
            {icon}
            <div>
                {href ? (
                    <a
                        href={href}
                        dir={group.type === 'address' ? undefined : 'ltr'}
                        className="hover:text-white transition-colors leading-5"
                    >
                        {first.value}
                    </a>
                ) : (
                    <span className="leading-5">{first.value}</span>
                )}
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                )}
            </div>
        </li>
    );
}

// ── Advertise modal ───────────────────────────────────────────────────────────

function AdvertiseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { advertiseModal } = usePage<PageProps>().props;
    const content = advertiseModal;
    const close = useCallback(onClose, [onClose]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, close]);

    if (!open || !content) return null;

    const secondaryUrl = content.secondary_button.url?.trim() || null;
    const isWhatsApp = /wa\.me|whatsapp/i.test(content.primary_button.url);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={close}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white shadow-2xl" dir="rtl" onClick={e => e.stopPropagation()}>
                <div className="h-1.5 bg-[#F24F00]" />
                <div className="flex items-start justify-between p-5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-[#F24F00]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#F24F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-900">{content.title}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{content.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={close} className="text-gray-300 hover:text-gray-600 transition-colors mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-5 pb-4 space-y-3">
                    {content.descriptions.map((paragraph, i) => (
                        <p key={i} className="text-sm text-gray-700 leading-7">{paragraph}</p>
                    ))}
                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 space-y-2">
                        {content.features.map(item => (
                            <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F24F00] flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 leading-6">{content.hint}</p>
                </div>
                <div className="flex gap-3 px-5 pb-5">
                    <a
                        href={content.primary_button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-1 items-center justify-center gap-2.5 font-black text-sm py-3 transition-colors ${
                            isWhatsApp
                                ? 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'
                                : 'bg-[#F24F00] hover:opacity-90 text-white'
                        }`}
                    >
                        {isWhatsApp && (
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        )}
                        {content.primary_button.label}
                    </a>
                    {secondaryUrl ? (
                        <a
                            href={secondaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-3 text-sm text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-colors"
                        >
                            {content.secondary_button.label}
                        </a>
                    ) : (
                        <button
                            onClick={close}
                            className="px-5 py-3 text-sm text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-colors"
                        >
                            {content.secondary_button.label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
