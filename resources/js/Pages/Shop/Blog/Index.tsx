import { Head, Link, router } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';
import BlogCard from '@/Components/BlogCard';

import { BlogCategory, BlogPost, BlogTag, PaginatedData, Product } from '@/types/models';
import { useEffect, useRef, useState } from 'react';
import blogBannerImg from '../../../../images/banners/blogBanner.jpg';

interface Filters {
    sort?: string;
    category?: string;
    search?: string;
}

interface Props {
    posts: PaginatedData<BlogPost & { tags?: BlogTag[] }>;
    categories: (BlogCategory & { posts_count: number })[];
    filters: Filters;
    latestProducts: Product[];
    cartCount: number;
}

const BlogIcon = (
    <svg className="h-14 w-14 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
);

export default function BlogIndex({ posts, categories, filters, latestProducts, cartCount }: Props) {
    const [allPosts, setAllPosts] = useState(posts.data);
    const [bannerPosts, setBannerPosts] = useState(posts.data.slice(0, 2));
    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const [loading, setLoading] = useState(false);
    const appendRef = useRef(false);

    // ── Carousel ─────────────────────────────────────────────────────────────
    const TOTAL = latestProducts.length;
    const [slideIndex, setSlideIndex] = useState(0);
    const [visibleCols, setVisibleCols] = useState(4);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            setVisibleCols(w >= 1024 ? 4 : w >= 640 ? 2 : 1);
            setSlideIndex(0);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const maxSlide  = Math.max(0, TOTAL - visibleCols);
    const canPrev   = slideIndex > 0;
    const canNext   = slideIndex < maxSlide;
    const prevSlide = () => setSlideIndex(s => Math.max(0, s - 1));
    const nextSlide = () => setSlideIndex(s => Math.min(maxSlide, s + 1));

    useEffect(() => {
        if (appendRef.current) {
            setAllPosts(prev => [...prev, ...posts.data]);
        } else {
            setAllPosts(posts.data);
            setBannerPosts(posts.data.slice(0, 3));
            setSearchInput(filters.search ?? '');
        }
        appendRef.current = false;
    }, [posts]);

    const buildParams = (overrides: Partial<Filters> = {}): Record<string, string> => {
        const merged = { ...filters, ...overrides };
        const params: Record<string, string> = {};
        if (merged.sort && merged.sort !== 'newest') params.sort = merged.sort;
        if (merged.category) params.category = merged.category;
        if (merged.search) params.search = merged.search;
        return params;
    };

    const navigate = (changes: Partial<Filters>) => {
        appendRef.current = false;
        router.get(route('shop.blog.index'), buildParams(changes), { preserveState: true, replace: true });
    };

    const loadMore = () => {
        if (loading) return;
        setLoading(true);
        appendRef.current = true;
        router.get(route('shop.blog.index'), { ...buildParams(), page: posts.current_page + 1 }, {
            only: ['posts'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const hasMore = posts.current_page < posts.last_page;
    const [b0, b1] = bannerPosts;

    return (
        <ShopLayout cartCount={cartCount}>
            <Head title="وبلاگ" />

            <div className="bg-white min-h-screen">
                <div className="mx-auto max-w-shop px-4 py-8 sm:px-6 lg:px-0">

                    {/* ── Banner grid ──────────────────────────────────────────── */}
                        <div className={`mb-8 grid grid-cols-1 gap-5 ${b1 ? 'sm:grid-cols-3' : ''}`}>
                            {/* Large single banner — explicit height so h-full works on child img */}
                            <div
                                className="relative lg:col-span-2 block overflow-hidden rounded-3xl h-72 sm:h-72"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="199" height="106" viewBox="0 0 199 106" fill="none"
                                className="block absolute -top-1 -right-1">
                                    <path d="M199 106C199 81.5 183.5 65.5 163 64L64 64C51 64 30 54.5 28.5 30C27 5.49998 12.5 -1.63043e-05 9.26681e-06 -1.73971e-05L199 0L199 106Z" fill="white"/>
                                </svg>
                                <h1 className="absolute right-10 top-2.5 text-[#1A1528] text-3xl lg:text-4xl font-bold">
                                    وبلاگ
                                </h1>
                                <img
                                    src={blogBannerImg}
                                    alt="بنر وبلاگ"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Two stacked banners — height matches large banner, flex-1 splits it */}
                            {bannerPosts.length > 0 && b1 &&
                                <div className="flex flex-col gap-5 h-72 sm:h-72">
                                    {([b0, b1] as (typeof b1)[]).filter(Boolean).map((post) => (
                                        <Link
                                            key={post.id}
                                            href={route('shop.blog.show', post.slug)}
                                            className="relative block flex-1 overflow-hidden rounded-3xl"
                                        >
                                            {post.featured_image ? (
                                                <img
                                                    src={`/storage/${post.featured_image}`}
                                                    alt={post.title}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                                                    {BlogIcon}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/55 to-transparent" />
                                            <p className="absolute left-10 top-8 w-[35%] text-sm font-bold leading-5 text-gray-800 drop-shadow line-clamp-2">
                                                {post.title}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            }
                        </div>

                    {/* ── Filter row ───────────────────────────────────────────── */}
                    <div className="mt-12 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
                        {/* Search */}
                        {/*<div className="relative flex-1 ml-0 lg:ml-40">*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        value={searchInput}*/}
                        {/*        onChange={e => setSearchInput(e.target.value)}*/}
                        {/*        onKeyDown={e => e.key === 'Enter' && navigate({ search: searchInput || undefined })}*/}
                        {/*        placeholder="جستجوی مقالات و اخبار"*/}
                        {/*        className="w-full rounded-2xl border-none bg-[#F2F2F2] py-3 pr-4 pl-10 text-sm text-[#1F0001] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E31F25]"*/}
                        {/*    />*/}
                        {/*    <button*/}
                        {/*        type="button"*/}
                        {/*        onClick={() => navigate({ search: searchInput || undefined })}*/}
                        {/*        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8181E] hover:text-[#E31F25] transition-colors"*/}
                        {/*        aria-label="جستجو"*/}
                        {/*    >*/}
                        {/*        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>*/}
                        {/*            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />*/}
                        {/*        </svg>*/}
                        {/*    </button>*/}
                        {/*</div>*/}

                        {/* Category */}
                        <div className="relative">
                            <select
                                value={filters.category ?? ''}
                                onChange={e => navigate({ category: e.target.value || undefined })}
                                className="w-full lg:min-w-[200px] appearance-none cursor-pointer rounded-2xl border-none bg-[#F2F2F2] py-3 pr-4 pl-8 text-sm font-medium text-[#1F0001] focus:outline-none focus:ring-1 focus:ring-[#E31F25] sm:w-auto"
                                style={{ backgroundImage: 'none'}}
                            >
                                <option value="">همه دسته‌بندی‌ها</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E31F25]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>


                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={filters.sort ?? 'newest'}
                                onChange={e => navigate({ sort: e.target.value })}
                                className="w-full lg:min-w-[150px] appearance-none cursor-pointer rounded-2xl border-none bg-[#F2F2F2] py-3 pr-4 pl-8 text-sm font-medium text-[#1F0001] focus:outline-none focus:ring-1 focus:ring-[#E31F25] sm:w-auto"
                                style={{ backgroundImage: 'none'}}
                            >
                                <option value="newest">جدیدترین</option>
                                <option value="oldest">قدیمی‌ترین</option>
                                <option value="most_viewed">پربازدیدترین</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#E31F25]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M10 17h4" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Post grid ────────────────────────────────────────────── */}
                    {allPosts.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                            <p className="text-gray-400">مقاله‌ای یافت نشد.</p>
                        </div>
                    ) : (
                        <>
                            {/* First 8: 3-2-3 on desktop */}
                            <div className="grid grid-cols-2 lg:gap-8 gap-3 lg:grid-cols-6">
                                {allPosts.slice(2, 10).map((post, idx) => {
                                    const lgSpan = (idx < 3 || idx >= 5) ? 'lg:col-span-2' : 'lg:col-span-2';
                                    return (
                                        <BlogCard
                                            key={post.id}
                                            post={post}
                                            className={lgSpan}
                                        />
                                    );
                                })}
                            </div>

                            {/* Remaining posts after load more */}
                            {allPosts.length > 10 && (
                                <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
                                    {allPosts.slice(10).map(post => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>
                            )}

                            {/* Load more */}
                            {hasMore && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="rounded-full bg-[#B8181E] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#E31F25] disabled:opacity-60 transition-colors"
                                    >
                                        {loading ? 'در حال بارگذاری...' : 'مشاهده بیشتر'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {/* ── Product carousel ─────────────────────────────────────── */}
                    {TOTAL > 0 && (
                        <div id="section-blog--recentproducts" className="mt-16">
                            <h2 className="mb-6 text-lg lg:text-3xl font-bold text-[#1A1528]">محصولات جدید</h2>

                            <div className="bg-[#F2F2F2] rounded-3xl relative p-10">
                                {/* Right arrow — prev in RTL (back toward first item) */}
                                <button
                                    type="button"
                                    onClick={prevSlide}
                                    disabled={!canPrev}
                                    aria-label="قبلی"
                                    className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-[#E31F25] hover:bg-[#E31F25] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Overflow-hidden track */}
                                <div className="overflow-hidden px-4">
                                    <div
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{
                                            width: `${(TOTAL / visibleCols) * 100}%`,
                                            transform: `translateX(${slideIndex * (100 / TOTAL)}%)`,
                                        }}
                                    >
                                        {latestProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className="px-4"
                                                style={{ width: `${100 / TOTAL}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Left arrow — next in RTL (forward toward last item) */}
                                <button
                                    type="button"
                                    onClick={nextSlide}
                                    disabled={!canNext}
                                    aria-label="بعدی"
                                    className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-[#E31F25] hover:bg-[#E31F25] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* View more */}
                                <div className="mt-8 flex justify-center">
                                    <Link
                                        href={route('shop.index')}
                                        className="rounded-full bg-[#B8181E] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#E31F25] transition-colors"
                                    >
                                        مشاهده بیشتر
                                    </Link>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </ShopLayout>
    );
}
