import { Head, Link, router } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';

import { Product, ProductCategory, PaginatedData } from '@/types/models';
import { useState, useRef, useCallback } from 'react';

interface ColorOption {
    id: number;
    label: string;
    value: string;
}

interface Props {
    products: PaginatedData<Product>;
    categories: (ProductCategory & { products_count: number })[];
    filters: {
        search?: string;
        category_id?: string;
        price_min?: string;
        price_max?: string;
        color_value?: string;
    };
    priceMin: number;
    priceMax: number;
    colorOptions: ColorOption[];
    cartCount: number;
}

// ─── Front-end only descriptions ─────────────────────────────────────────────
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'یخچال و فریزر':    'یخچال تک و دو درب، فریزر ایستاده و صندوقی',
    'ماشین لباسشویی':   'درب از جلو و بالا، ظرفیت‌های خانوادگی',
    'تلویزیون':         'هوشمند، LED و OLED با کیفیت تصویر بالا',
    'جاروبرقی':         'بی‌سیم، رباتیک و سطلی برای هر فضا',
    'اجاق گاز':         'رومیزی، توکار و اجاق برقی',
    'ماشین ظرفشویی':    'ظرفیت‌های خانوادگی و نیمه‌حرفه‌ای',
    'کولر و تهویه':     'کولر گازی، پرتابل و سیستم تهویه مطبوع',
    'اقلام ریز آشپزخانه' : 'قدرت در جزئیات \n در وسایل روزمره و کاربردی'
};

const DEFAULT_DESCRIPTION = 'محصولات این دسته‌بندی را مشاهده کنید';

// ─── Placeholder icon ─────────────────────────────────────────────────────────
function ImgPlaceholder({ className }: { className?: string }) {
    return (
        <svg className={className ?? 'h-6 w-6 text-gray-300'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

export default function ShopIndex({ products, categories, filters, priceMin, priceMax, colorOptions, cartCount }: Props) {
    const [localPriceMin, setLocalPriceMin] = useState(filters.price_min ?? '');
    const [localPriceMax, setLocalPriceMax] = useState(filters.price_max ?? '');
    const [localColorValue, setLocalColorValue] = useState(filters.color_value ?? '');
    const [sort, setSort] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc'>('newest');
    const [onlyInStock, setOnlyInStock] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);
    const [carouselProgress, setCarouselProgress] = useState(0);

    const handleCarouselScroll = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setCarouselProgress(max > 0 ? Math.abs(el.scrollLeft) / max : 0);
    }, []);

    const scrollCarousel = useCallback((dir: 'prev' | 'next') => {
        const el = carouselRef.current;
        if (!el) return;
        // RTL: next = scroll left (more items), prev = scroll right (back to start)
        el.scrollBy({ left: dir === 'next' ? -280 : 280, behavior: 'smooth' });
    }, []);

    const filterByCategory = (categoryId?: number) => {
        router.get(route('shop.index'), {
            search: filters.search || undefined,
            category_id: categoryId,
            price_min: filters.price_min || undefined,
            price_max: filters.price_max || undefined,
            color_value: filters.color_value || undefined,
        }, { preserveState: true });
    };

    const applyFilters = () => {
        router.get(route('shop.index'), {
            search: filters.search || undefined,
            category_id: filters.category_id || undefined,
            price_min: localPriceMin || undefined,
            price_max: localPriceMax || undefined,
            color_value: localColorValue || undefined,
        }, { preserveState: true });
    };

    const activeCategory = filters.category_id ? Number(filters.category_id) : null;

    const enrichedCategories = categories.map(cat => ({
        ...cat,
        description: CATEGORY_DESCRIPTIONS[cat.name] ?? DEFAULT_DESCRIPTION,
    }));

    const activeCategoryName = activeCategory
        ? enrichedCategories.find(c => c.id === activeCategory)?.name ?? null
        : null;

    const minPrice = (p: typeof products.data[0]) =>
        p.variations.length > 0 ? Math.min(...p.variations.map(v => v.price)) : 0;

    const sortedProducts = [...products.data]
        .filter(p => !onlyInStock || p.variations.some(v => v.stock > 0))
        .sort((a, b) => {
        if (sort === 'price_asc')  return minPrice(a) - minPrice(b);
        if (sort === 'price_desc') return minPrice(b) - minPrice(a);
        if (sort === 'oldest')     return a.id - b.id;
        return b.id - a.id; // newest
    });

    return (
        <ShopLayout cartCount={cartCount}>
            <Head title="فروشگاه" />

            <div className="max-w-shop mx-auto px-4 sm:px-6 lg:px-8  py-6 sm:py-8">
                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#404040]">
                        {activeCategoryName ? `جستجو در ${activeCategoryName}` : 'جستجو در فروشگاه'}
                    </h1>
                </div>

                {/* ── Category carousel ────────────────────────────────────────── */}
                {enrichedCategories.length > 0 && (
                    <>
                    <div
                        ref={carouselRef}
                        onScroll={handleCarouselScroll}
                        className="flex gap-3 overflow-x-auto py-3 px-2 mb-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                    >
                        {enrichedCategories.map(cat => {
                            const isActive = activeCategory === cat.id;
                            const imgSrc = cat.image ? `/storage/${cat.image}` : null;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => filterByCategory(isActive ? undefined : cat.id)}
                                    className={[
                                        'flex-shrink-0 rounded-lg transition-all duration-300 overflow-hidden focus:outline-none',
                                        /*
                                         * Inactive widths fill exactly N slots in the visible container:
                                         *   mobile  → 2 items: calc(50% − half-of-1-gap)
                                         *   tablet  → 3 items: calc(33.3% − third-of-2-gaps)
                                         *   desktop → 6 items: calc(16.67% − sixth-of-5-gaps)
                                         * Active card gets a fixed wider width so it expands without
                                         * compressing siblings (container scrolls to accommodate).
                                         */
                                        isActive
                                            ? 'flex flex-row-reverse items-center gap-3 w-64 md:w-72 bg-[#F2F2F2] ring-2 ring-[#E31F25] p-4'
                                            : 'flex flex-col items-center w-[calc(50%_-_6px)] md:w-[calc(33.333%_-_8px)] lg:w-[calc(16.667%_-_10px)] bg-[#F2F2F2] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 p-4',
                                    ].join(' ')}
                                >
                                    {/*
                                     * RTL: first child of flex-row = right side.
                                     * Active card → image (right), text (left).
                                     * Default card → flex-col, image on top.
                                     */}
                                    <div className={[
                                        'flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center',
                                        isActive ? 'w-20 h-[70px]' : 'w-full h-[70px] mb-3',
                                    ].join(' ')}>
                                        {imgSrc ? (
                                            <img src={imgSrc} alt={cat.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <ImgPlaceholder />
                                        )}
                                    </div>

                                    {isActive ? (
                                        <div className="flex-1 min-w-0 text-right">
                                            <p className="font-bold text-base text-[#1F0001] leading-tight truncate mb-3">{cat.name}</p>
                                            <p className="text-sm text-[#404040] font-medium mt-1.5 leading-5 line-clamp-2">{cat.description}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-[#616161] text-center leading-tight line-clamp-2 w-full">
                                            {cat.name}
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Carousel controls ──────────────────────────────── */}
                    <div className="w-full sm:w-1/2 flex items-center gap-1.5 mb-6 px-0 sm:px-2 mx-auto">
                        <div className="flex-1 h-[4px] rounded-full bg-[#EEEEEE] overflow-hidden ml-3 sm:ml-10">
                            <div
                                className="h-full bg-black rounded-full transition-all duration-200"
                                style={{ width: `${carouselProgress * 100}%` }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => scrollCarousel('prev')}
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-[#B3B3B4] shadow-sm flex items-center justify-center text-gray-500 hover:text-[#E31F25] hover:border-[#E31F25] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollCarousel('next')}
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-[#B3B3B4] shadow-sm flex items-center justify-center text-gray-500 hover:text-[#E31F25] hover:border-[#E31F25] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                    </>
                )}

                {/* ── Sort + count row ────────────────────────────────────── */}
                <div className="flex flex-row-reverse sm:flex-row items-center justify-between mb-4 gap-1">
                    {/* Product count — right side in RTL */}
                    <span className="text-base sm:text-lg font-medium text-[#252525]">
                        {sortedProducts.length}
                        {' '}محصول{activeCategoryName ? ` ${activeCategoryName}` : ''}
                    </span>

                    {/* Sort dropdown — desktop only */}
                    <div className="hidden sm:flex relative items-center gap-1.5">
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value as typeof sort)}
                                className="appearance-none font-medium border-none sm:min-w-[175px] rounded-2xl pr-4 pl-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31F25] text-[#1F0001] cursor-pointer"
                                style={{ background: '#F2F2F2' }}
                            >
                                <option value="newest">جدیدترین</option>
                                <option value="oldest">قدیمی‌ترین</option>
                                <option value="price_asc">ارزان‌ترین</option>
                                <option value="price_desc">گران‌ترین</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-[#E31F25] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M10 17h4" />
                            </svg>
                        </div>
                    </div>

                    {/* Filter toggle button — mobile only */}
                    <button
                        type="button"
                        onClick={() => setFilterOpen(v => !v)}
                        className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#1F0001]"
                        style={{ background: '#F2F2F2' }}
                    >
                        <span className="ml-8">فیلترها</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#B8181E]" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_683_27130)">
                                <mask id="mask0_683_27130" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <path d="M24 0H0V24H24V0Z" fill="white"/>
                                </mask>
                                <g mask="url(#mask0_683_27130)">
                                    <path d="M16.9513 9.48047C13.8465 9.48047 11.3223 12.0047 11.3223 15.1096C11.3223 16.1643 11.6185 17.1597 12.14 18.013C13.1117 19.6484 14.9012 20.7386 16.9513 20.7386C19.0015 20.7386 20.791 19.6365 21.7627 18.013C22.2842 17.1716 22.5804 16.1643 22.5804 15.1096C22.5804 12.0047 20.0681 9.48047 16.9513 9.48047ZM19.0608 15.9747H17.8402V17.2427C17.8402 17.7286 17.4372 18.1315 16.9513 18.1315C16.4655 18.1315 16.0625 17.7286 16.0625 17.2427V15.9747H14.8538C14.3679 15.9747 13.965 15.5717 13.965 15.0858C13.965 14.6 14.3679 14.197 14.8538 14.197H16.0625V13.0357C16.0625 12.5498 16.4655 12.1469 16.9513 12.1469C17.4372 12.1469 17.8402 12.5498 17.8402 13.0357V14.197H19.0608C19.5467 14.197 19.9496 14.6 19.9496 15.0858C19.9496 15.5717 19.5467 15.9747 19.0608 15.9747Z" fill="#B8181E"/>
                                    <path d="M21.3358 2.39384V5.0247C21.3358 5.9846 20.7432 7.18152 20.1507 7.78591L19.9374 7.97552C19.7715 8.12958 19.5226 8.16513 19.3093 8.09403C19.0723 8.01107 18.8353 7.95182 18.5983 7.89257C18.0768 7.76221 17.5199 7.70295 16.951 7.70295C12.8625 7.70295 9.54433 11.0212 9.54433 15.1096C9.54433 16.4606 9.9117 17.7879 10.6109 18.9256C11.2034 19.921 12.033 20.7506 12.9336 21.3076C13.2062 21.4853 13.3129 21.8645 13.0758 22.0779C12.9929 22.149 12.9099 22.2082 12.827 22.2675L11.1679 23.3459C9.62729 24.3058 7.50603 23.2274 7.50603 21.3076V14.9674C7.50603 14.126 7.03201 13.0476 6.55798 12.4551L2.06656 7.6674C1.47403 7.06302 1 5.9846 1 5.27356V2.51235C1 1.07841 2.06656 0 3.35829 0H18.9775C20.2692 0 21.3358 1.07841 21.3358 2.39384Z" fill="#B8181E"/>
                                </g>
                            </g>
                            <defs>
                                <clipPath id="clip0_683_27130">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                {/* ── Filter bar ──────────────────────────────────────────── */}
                <div className={[
                    'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
                    filterOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0',
                    'sm:max-h-none sm:opacity-100 sm:overflow-visible sm:transition-none',
                ].join(' ')}>

                    {/* Sort dropdown — mobile only, inside slide panel */}
                    <div className="sm:hidden mb-3">
                        <div className="relative w-full">
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value as typeof sort)}
                                className="appearance-none font-medium border-none w-full rounded-2xl pr-4 pl-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31F25] text-[#1F0001] cursor-pointer"
                                style={{ background: '#F2F2F2' }}
                            >
                                <option value="newest">جدیدترین</option>
                                <option value="oldest">قدیمی‌ترین</option>
                                <option value="price_asc">ارزان‌ترین</option>
                                <option value="price_desc">گران‌ترین</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-[#E31F25] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M10 17h4" />
                            </svg>
                        </div>
                    </div>

                <div className="mb-6 bg-[#F2F2F2] rounded-3xl sm:px-6 sm:py-5 p-4 flex flex-wrap items-end gap-x-6 gap-y-3">

                    {/* Price range */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-[#404040] whitespace-nowrap">محدوده قیمت</span>
                        <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
                            <input
                                type="number"
                                value={localPriceMin}
                                onChange={e => setLocalPriceMin(e.target.value)}
                                placeholder={priceMin ? String(priceMin) : 'از'}
                                min={priceMin}
                                max={priceMax}
                                className="w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E31F25] text-center"
                            />
                            <span className="text-[#898A89] text-sm">تا</span>
                            <input
                                type="number"
                                value={localPriceMax}
                                onChange={e => setLocalPriceMax(e.target.value)}
                                placeholder={priceMax ? String(priceMax) : 'تا'}
                                min={priceMin}
                                max={priceMax}
                                className="w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E31F25] text-center"
                            />
                            <span className="text-xs text-[#898A89]">ریال</span>
                        </div>
                    </div>

                    {/* Divider */}
                    {colorOptions.length > 0 && <div className="h-8 w-px bg-gray-300 flex-shrink-0 hidden sm:block" />}

                    {/* Color select */}
                    {colorOptions.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-[#404040]">رنگ</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {localColorValue && (
                                    <span
                                        className="inline-block w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                        style={{ background: localColorValue }}
                                    />
                                )}
                                <div className="relative">
                                    <select
                                        value={localColorValue}
                                        onChange={e => setLocalColorValue(e.target.value)}
                                        className="appearance-none border border-gray-200 rounded-lg pr-3 pl-7 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E31F25] min-w-[130px]"
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="">همه رنگ‌ها</option>
                                        {colorOptions.map(c => (
                                            <option key={c.id} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <svg
                                        className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#898A89] pointer-events-none"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-300 flex-shrink-0 hidden sm:block" />

                    {/* In-stock toggle */}
                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={onlyInStock}
                                onClick={() => setOnlyInStock(v => !v)}
                                className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#E31F25] focus:ring-offset-1 ${onlyInStock ? 'bg-[#E31F25]' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${onlyInStock ? 'right-1' : 'left-1'}`} />
                            </button>
                            <span className="text-sm font-medium text-[#1F0001] whitespace-nowrap">فقط کالاهای موجود</span>
                        </label>
                    </div>

                    {/* Apply button */}
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="mr-auto bg-[#E31F25] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#B8181E] transition flex-shrink-0"
                    >
                        اعمال فیلتر
                    </button>
                </div>
                </div>{/* end slide panel */}

                {/* ── Product grid ─────────────────────────────────────────── */}
                <div>
                    {sortedProducts.length > 0 ? (
                        <>
                            <div id="shop-products-section" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 bg-[#F2F2F2] rounded-3xl px-6 py-5">
                                {sortedProducts.map(p => <div key={p.id} />)}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="flex justify-center gap-1 mt-8">
                                    {products.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-3 py-1.5 rounded-lg text-sm border transition ${link.active ? 'bg-[#E31F25] text-white border-[#E31F25]' : 'border-gray-200 text-[#616161] hover:bg-[#F2F2F2]'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 rounded-lg text-sm border border-gray-100 text-[#B3B3B4]"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24 text-[#898A89]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-[#D5D5D5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>محصولی یافت نشد</p>
                        </div>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}
