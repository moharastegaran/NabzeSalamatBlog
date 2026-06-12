import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export type Sub = { label: string; href: string };
export type CatItem = { id: string; label: string; href: string; subs?: Sub[] };

export const MENU: CatItem[] = [
    {
        id: 'refrigerator',
        label: 'یخچال و فریزر',
        href: '/shop?category_id=4',
        subs: [
            { label: 'دوقلو', href: '/shop?category_id=4&type=1' },
            { label: 'کمبی- فریزر بالا',   href:  '/shop?category_id=4&type=1' },
            { label: 'کمبی- فریزر پایین',        href:  '/shop?category_id=4&type=1' },
            { label: 'کوچک هتلی',        href:  '/shop?category_id=4&type=1' },
            { label: 'فریزر صندوقی',        href:  '/shop?category_id=4&type=1' },
        ],
    },
    {
        id: 'washing',
        label: 'ماشین لباسشویی',
        href: '/shop?category_id=14',
        subs: [
            // { label: 'درب از جلو', href: '/shop?catname=ماشین+لباسشویی&load=front' },
            // { label: 'درب از بالا', href: '/shop?catname=ماشین+لباسشویی&load=top' },
        ],
    },
    {
        id: 'dishwasher',
        label: 'ماشین ظرفشویی',
        href: '/shop?category_id=13',
        subs: [
            // { label: 'ظرفشویی ۱۲ نفره', href: '/shop?catname=ماشین+ظرفشویی&capacity=12' },
            // { label: 'ظرفشویی ۱۴ نفره', href: '/shop?catname=ماشین+ظرفشویی&capacity=14' },
        ],
    },
    {
        id: 'tv',
        label: 'تلویزیون',
        href: '/shop?category_id=17',
        subs: [
            // { label: 'تلویزیون ۴K',    href: '/shop?catname=تلویزیون&resolution=4k' },
            // { label: 'تلویزیون هوشمند', href: '/shop?catname=تلویزیون&type=smart' },
        ],
    },
    {
        id: 'oven',
        label: 'اجاق گاز',
        href: '/shop?category_id=1',
        subs: [
            // { label: 'اجاق گاز رومیزی', href: '/shop?catname=اجاق+گاز&type=countertop' },
            // { label: 'اجاق گاز فردار',  href: '/shop?catname=اجاق+گاز&type=with-oven' },
        ],
    },
    {
        id: 'split',
        label: 'سرمایش و گرمایش',
        href: '/shop?category_id=11',
        subs: [
            { label: 'کولر آبی', href: '/shop?category_id=11' },
            { label: 'اسپلیت',   href: '/shop?category_id=11' },
            { label: 'بخاری', href: '/shop?category_id=11' },
            { label: 'پنکه',   href: '/shop?category_id=11' },
        ],
    },
    {
        id: 'kitchen',
        label: 'لوازم خانگی کوچک',
        href: '/shop?category_id=2',
        subs: [
            { label: 'جاروبرقی',  href: '/shop?category_id=2' },
            { label: 'اتو',   href: '/shop?category_id=2' },
            { label: 'اسپرسوساز', href: '/shop?category_id=2' },
            { label: 'خردکن',  href: '/shop?category_id=2' },
            { label: 'غذاساز',   href: '/shop?category_id=2' },
            { label: 'هواپز', href: '/shop?category_id=2' },
        ],
    },
];

interface Props {
    triggerClass: string;
    activeClass: string;
    isShopActive: boolean;
}

export default function CatMegaMenu({ triggerClass, activeClass, isShopActive }: Props) {
    const [open, setOpen]     = useState(false);
    const [active, setActive] = useState(MENU[0].id);
    const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const show = () => {
        if (timer.current) clearTimeout(timer.current);
        setOpen(true);
    };
    const hide = () => {
        timer.current = setTimeout(() => setOpen(false), 120);
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (!open) setActive(MENU[0].id);
    }, [open]);

    const activeCat = MENU.find(c => c.id === active);

    return (
        <div ref={containerRef} className="relative" onMouseEnter={show} onMouseLeave={hide}>
            {/* Trigger */}
            <button className={`${isShopActive ? activeClass : triggerClass} flex items-center gap-1`}>
                دسته‌بندی کالاها
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute top-full right-0 mt-2 flex gap-2 max-w-[350px] w-[350px] bg-[#F2F2F2] rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-2"
                    dir="rtl"
                >
                    {/* Column 1 – main categories */}
                    <div className="w-[155px] flex-shrink-0 border-l border-gray-100 py-1.5">
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#E31F25] hover:bg-[#FFF0F0] transition mx-1.5 rounded-lg"
                        >
                            همه محصولات
                        </Link>
                        <div className="my-1 border-t border-gray-100" />
                        {MENU.map(cat => (
                            <Link
                                key={cat.id}
                                href={cat.href}
                                onMouseEnter={() => setActive(cat.id)}
                                className={`flex items-center justify-between px-3 py-3 text-sm transition mx-0 rounded-xl
                                    ${active === cat.id
                                        ? 'bg-white text-[#E31F25] font-bold'
                                        : 'text-[#1F0001] hover:bg-[#F7F7F7]'
                                    }`}
                            >
                                <span>{cat.label}</span>
                                {cat.subs && cat.subs.length > 0 && (
                                    <svg className="w-3 h-3 flex-shrink-0 opacity-40 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Column 2 – sub-items */}
                    <div key={activeCat?.id} className="flex-1 py-1.5 px-1 bg-white rounded-2xl">
                        {activeCat && (
                            <>
                                <Link
                                    href={activeCat.href}
                                    className="flex items-center gap-1.5 px-3 py-3 text-xs font-bold text-[#404040] hover:text-[#E31F25] transition rounded-lg hover:bg-[#F7F7F7] mx-0.5"
                                >
                                    همه {activeCat.label}
                                    <svg className="w-3 h-3 opacity-50 -scale-x-100 mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <div className="my-1 border-t border-gray-100 mx-2" />
                                {activeCat.subs?.map((sub, i) => (
                                    <Link
                                        key={i}
                                        href={sub.href}
                                        className="flex items-center px-3 py-2 text-sm text-[#555] hover:text-[#E31F25] hover:bg-[#F7F7F7] rounded-lg transition"
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
