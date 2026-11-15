import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import BlogLayout from '@/Layouts/BlogLayout';
import SeoHead from '@/Components/SeoHead';
import SocialFollowWidget from '@/Components/SocialFollowWidget';
import BlogPagination from '@/Components/BlogPagination';
import type { BlogPost, PaginatedData } from '@/types/models';

interface CategoryLeaf {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

interface CategoryNode extends CategoryLeaf {
    children: CategoryLeaf[];
}

interface Props {
    posts: PaginatedData<BlogPost>;
    categories: CategoryNode[];
    filters: { category?: string; search?: string; sort?: string };
}

const SORT_LABELS: Record<string, string> = {
    newest:      'جدیدترین',
    oldest:      'قدیمی‌ترین',
    most_viewed: 'پربازدیدترین',
};

function sortByPostsDesc<T extends { posts_count: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => b.posts_count - a.posts_count);
}

// ── Local helpers ─────────────────────────────────────────────────────────────

function SideboxHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-[#F24F00] flex-shrink-0" />
            <h3 className="text-sm font-black text-gray-900 tracking-tight">{title}</h3>
        </div>
    );
}

// ── Post card ─────────────────────────────────────────────────────────────────

function PostCard({ post }: { post: BlogPost }) {
    const date = post.published_at ? (() => {
        const d = new Date(post.published_at);
        return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
            + ' — ' + d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    })() : null;

    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="group flex flex-col overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            <div className="aspect-video w-full overflow-hidden bg-gray-100 flex-shrink-0">
                {post.featured_image ? (
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F24F00]/15 to-[#075F26]/20">
                        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="border-t-2 border-transparent group-hover:border-[#F24F00] transition-colors duration-200" />

            <div className="flex flex-1 flex-col gap-2 p-4">
                {post.category && (
                    <span className="text-[11px] font-bold text-[#F24F00] uppercase tracking-wide">
                        {post.category.name}
                    </span>
                )}
                <h2 className="line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-[#F24F00] transition-colors leading-snug">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed">{post.excerpt}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                    {post.author && (
                        <Link
                            href={route('front.blog.author', post.author.id)}
                            onClick={e => e.stopPropagation()}
                            className="hover:text-[#F24F00] transition-colors"
                        >
                            {post.author.name}
                        </Link>
                    )}
                    <div className="flex items-center gap-3">
                        {(post.approved_comments_count ?? 0) > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {post.approved_comments_count}
                            </span>
                        )}
                        {date && <span>{date}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── Sidebar widgets ───────────────────────────────────────────────────────────

function SearchSideWidget({
    value,
    onChange,
    onSubmit,
}: {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: FormEvent) => void;
}) {
    return (
        <div className="bg-white p-4 shadow-sm">
            <SideboxHeader title="جستجو" />
            <form onSubmit={onSubmit} className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="جستجو در اخبار..."
                    className="w-full border border-gray-200 bg-gray-50 py-2 pr-9 pl-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#F24F00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F24F00] transition-colors"
                />
                <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F24F00] transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

function CategoriesSideWidget({
    categories,
    activeCategory,
    onSelect,
}: {
    categories: CategoryNode[];
    activeCategory?: string;
    onSelect: (slug?: string) => void;
}) {
    const sortedCategories = sortByPostsDesc(categories);

    const activeParentId = sortedCategories.find(cat =>
        cat.children.some(c => c.slug === activeCategory)
    )?.id ?? null;

    const [openId, setOpenId] = useState<number | null>(activeParentId);

    const toggleOpen = (id: number) => setOpenId(prev => prev === id ? null : id);

    return (
        <div className="bg-white p-4 shadow-sm">
            <SideboxHeader title="دسته‌بندی‌ها" />
            <div className="space-y-2">
                <button
                    onClick={() => onSelect(undefined)}
                    className={`flex w-full items-center gap-2 border px-3 py-2.5 text-sm transition-colors ${
                        !activeCategory
                            ? 'border-[#F24F00]/40 bg-[#F24F00]/5 font-bold text-[#F24F00]'
                            : 'border-gray-100 bg-white text-gray-700 hover:border-[#F24F00]/40 hover:text-[#F24F00]'
                    }`}
                >
                    <span className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${!activeCategory ? 'bg-[#F24F00]' : 'bg-gray-300'}`} />
                    همه اخبار
                </button>

                {sortedCategories.map(cat => {
                    const children = sortByPostsDesc(cat.children);
                    const hasChildren = children.length > 0;
                    const isOpen      = openId === cat.id;
                    const isActive    = activeCategory === cat.slug;
                    const hasActiveChild = children.some(c => c.slug === activeCategory);

                    return (
                        <div key={cat.id} className="space-y-1.5">
                            <div
                                className={`group flex items-stretch overflow-hidden border shadow-sm transition-colors ${
                                    isActive || hasActiveChild
                                        ? 'border-[#F24F00]/40'
                                        : 'border-gray-100 hover:border-[#F24F00]/40'
                                }`}
                            >
                                <button
                                    onClick={() => onSelect(isActive ? undefined : cat.slug)}
                                    className={`flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                                        isActive || hasActiveChild
                                            ? 'font-bold text-[#F24F00]'
                                            : 'text-gray-700 group-hover:text-[#F24F00]'
                                    }`}
                                >
                                    <span className="truncate font-medium">{cat.name}</span>
                                </button>
                                <span className="flex shrink-0 flex-col items-center justify-center border-r border-gray-100 bg-[#F24F00]/5 px-3 py-2.5 text-center">
                                    <span className="text-sm font-black tabular-nums text-[#F24F00]">
                                        {cat.posts_count.toLocaleString('fa-IR')}
                                    </span>
                                    <span className="text-[10px] font-medium text-[#F24F00]/70">مقاله</span>
                                </span>
                                {hasChildren && (
                                    <button
                                        onClick={() => toggleOpen(cat.id)}
                                        aria-label={isOpen ? 'بستن' : 'باز کردن'}
                                        className="px-2.5 text-gray-300 hover:text-[#F24F00] transition-colors"
                                    >
                                        <svg
                                            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {hasChildren && isOpen && (
                                <div className="space-y-1.5 pr-3">
                                    {children.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => onSelect(activeCategory === child.slug ? undefined : child.slug)}
                                            className={`group flex w-full items-stretch overflow-hidden border shadow-sm transition-colors ${
                                                activeCategory === child.slug
                                                    ? 'border-[#F24F00]/40'
                                                    : 'border-gray-100 hover:border-[#F24F00]/40'
                                            }`}
                                        >
                                            <span className={`flex min-w-0 flex-1 items-center px-3 py-2 text-xs transition-colors ${
                                                activeCategory === child.slug
                                                    ? 'font-bold text-[#F24F00]'
                                                    : 'text-gray-600 group-hover:text-[#F24F00]'
                                            }`}>
                                                <span className="truncate font-medium">{child.name}</span>
                                            </span>
                                            <span className="flex shrink-0 flex-col items-center justify-center border-r border-gray-100 bg-[#F24F00]/5 px-2.5 py-2 text-center">
                                                <span className="text-xs font-black tabular-nums text-[#F24F00]">
                                                    {child.posts_count.toLocaleString('fa-IR')}
                                                </span>
                                                <span className="text-[9px] font-medium text-[#F24F00]/70">مقاله</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SocialSideWidget() {
    return (
        <div className="bg-white p-4 shadow-sm">
            <SideboxHeader title="ما را دنبال کنید" />
            <SocialFollowWidget />
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlogIndex({ posts, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const go = (patch: Partial<typeof filters>) => {
        const merged = { ...filters, ...patch };
        const params: Record<string, string> = {};
        if (merged.category) params.category = merged.category;
        if (merged.search)   params.search   = merged.search;
        if (merged.sort && merged.sort !== 'newest') params.sort = merged.sort;
        router.get(route('front.blog.index'), params, { preserveState: true, preserveScroll: false });
    };

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        go({ search: search.trim() || undefined as any });
    };

    const activeSort = filters.sort ?? 'newest';
    const activeCategory = filters.category;
    const sortedCategories = sortByPostsDesc(categories);

    const activeCategoryLabel = categories
        .flatMap(c => [c, ...c.children])
        .find(c => c.slug === activeCategory)?.name;

    return (
        <BlogLayout>
            <SeoHead
                title="وبلاگ"
                description="آخرین اخبار و مقالات حوزه سلامت، پزشکی و سبک زندگی در وبلاگ نبض سلامت."
                url="/blog"
            />

            <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
                    <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
                    <svg className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-gray-700 font-medium">وبلاگ</span>
                </nav>

                {/* Blog hub hero */}
                <header className="blog-hero relative mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[#042F10]" />
                    <div
                        className="absolute inset-0 opacity-95"
                        style={{
                            background:
                                'radial-gradient(ellipse 85% 75% at 100% 20%, rgba(242,79,0,0.6) 0%, transparent 55%), radial-gradient(ellipse 70% 90% at 0% 100%, rgba(7,95,38,0.95) 0%, transparent 55%)',
                        }}
                    />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.11]"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(-35deg, transparent, transparent 16px, rgba(255,255,255,0.07) 16px, rgba(255,255,255,0.07) 17px)',
                        }}
                    />

                    <div className="relative px-5 py-9 sm:px-8 sm:py-11">
                        <div className="blog-hero-meta max-w-3xl space-y-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FDBA8C]">
                                رسانه خبری سلامت
                            </p>
                            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                                وبلاگ نبض سلامت
                            </h1>
                            <p className="blog-hero-desc max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                                آخرین مقالات، راهنماها و اخبار حوزه سلامت، پزشکی و سبک زندگی
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="inline-flex items-center gap-1.5 bg-[#F24F00] px-3 py-1 text-xs font-bold text-white">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {posts.total.toLocaleString('fa-IR')} مقاله
                                </span>
                            </div>
                        </div>

                        {sortedCategories.length > 0 && (
                            <div className="blog-hero-cats mt-7 flex flex-wrap gap-2 border-t border-white/15 pt-5">
                                <button
                                    type="button"
                                    onClick={() => go({ category: undefined as any })}
                                    className={`inline-flex items-center px-3 py-2 text-xs font-semibold transition-colors ${
                                        !activeCategory
                                            ? 'bg-[#F24F00] text-white'
                                            : 'bg-white/10 text-white hover:bg-[#F24F00]'
                                    }`}
                                >
                                    همه
                                </button>
                                {sortedCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => go({ category: (activeCategory === cat.slug ? undefined : cat.slug) as any })}
                                        className={`group inline-flex max-w-full items-stretch overflow-hidden transition-colors ${
                                            activeCategory === cat.slug
                                                ? 'bg-[#F24F00]'
                                                : 'bg-white/10 hover:bg-[#F24F00]'
                                        }`}
                                    >
                                        <span className="truncate px-3 py-2 text-xs font-semibold text-white sm:text-sm">
                                            {cat.name}
                                        </span>
                                        <span className="flex shrink-0 items-center gap-1 border-r border-white/15 bg-black/20 px-2.5 py-2">
                                            <span className="text-xs font-black tabular-nums text-white">
                                                {cat.posts_count.toLocaleString('fa-IR')}
                                            </span>
                                            <span className="text-[10px] font-medium text-white/65">مقاله</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 inset-x-0 h-1 bg-[#F24F00]" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-7 items-start">

                    <main>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="h-5 w-1.5 bg-[#F24F00] shrink-0" />
                                <h2 className="text-base font-black text-gray-900 truncate">
                                    {activeCategoryLabel
                                        ? `مقالات ${activeCategoryLabel}`
                                        : filters.search
                                            ? 'نتایج جستجو'
                                            : 'آخرین مقالات'}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">مرتب‌سازی:</span>
                                <div className="relative">
                                    <select
                                        value={activeSort}
                                        onChange={e => go({ sort: e.target.value })}
                                        className="appearance-none border border-gray-200 bg-white py-1.5 pe-8 ps-2 text-sm text-gray-700 focus:border-[#F24F00] focus:outline-none focus:ring-1 focus:ring-[#F24F00] transition-colors"
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        {Object.entries(SORT_LABELS).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute end-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {(activeCategory || filters.search) && (
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-gray-400">فیلترهای فعال:</span>
                                {activeCategoryLabel && (
                                    <span className="inline-flex items-center gap-1.5 bg-[#F24F00]/10 text-[#F24F00] text-xs font-semibold px-2.5 py-1">
                                        {activeCategoryLabel}
                                        <button
                                            onClick={() => go({ category: undefined as any })}
                                            className="hover:opacity-70 transition-opacity leading-none"
                                            aria-label="حذف فیلتر دسته‌بندی"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.search && (
                                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1">
                                        «{filters.search}»
                                        <button
                                            onClick={() => { setSearch(''); go({ search: undefined as any }); }}
                                            className="hover:opacity-70 transition-opacity leading-none"
                                            aria-label="حذف فیلتر جستجو"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {posts.data.length > 0 ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {posts.data.map(post => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                                <BlogPagination links={posts.links} />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white py-24 text-center shadow-sm">
                                <div className="mb-5 flex h-16 w-16 items-center justify-center bg-[#F24F00]/10">
                                    <svg className="h-8 w-8 text-[#F24F00]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-600">مقاله‌ای یافت نشد</p>
                                <p className="mt-1 text-xs text-gray-400">با فیلتر دیگری امتحان کنید یا فیلترها را پاک کنید.</p>
                                {(filters.search || filters.category) && (
                                    <button
                                        onClick={() => { setSearch(''); go({ search: undefined as any, category: undefined as any }); }}
                                        className="mt-4 inline-flex items-center gap-1.5 bg-[#F24F00] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                                    >
                                        پاک کردن فیلترها
                                    </button>
                                )}
                            </div>
                        )}
                    </main>

                    <aside className="space-y-5 lg:sticky lg:top-28">
                        <SearchSideWidget
                            value={search}
                            onChange={setSearch}
                            onSubmit={submitSearch}
                        />

                        {sortedCategories.length > 0 && (
                            <CategoriesSideWidget
                                categories={sortedCategories}
                                activeCategory={activeCategory}
                                onSelect={slug => go({ category: slug as any })}
                            />
                        )}

                        <SocialSideWidget />
                    </aside>
                </div>
            </div>

            <style>{`
                @keyframes blog-fade-up {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .blog-hero { animation: blog-fade-up 0.55s ease-out both; }
                .blog-hero-meta { animation: blog-fade-up 0.55s 0.1s ease-out both; }
                .blog-hero-desc { animation: blog-fade-up 0.55s 0.16s ease-out both; }
                .blog-hero-cats { animation: blog-fade-up 0.55s 0.22s ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                    .blog-hero, .blog-hero-meta, .blog-hero-desc, .blog-hero-cats {
                        animation: none;
                    }
                }
            `}</style>
        </BlogLayout>
    );
}
