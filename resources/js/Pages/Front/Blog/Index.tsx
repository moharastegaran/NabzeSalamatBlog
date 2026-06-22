import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import BlogLayout from '@/Layouts/BlogLayout';
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
    const date = post.published_at
        ? new Date(post.published_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="group flex flex-col overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            {/* Image */}
            <div className="aspect-video w-full overflow-hidden bg-gray-100 flex-shrink-0">
                {post.featured_image ? (
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Top accent on hover */}
            <div className="border-t-2 border-transparent group-hover:border-[#F24F00] transition-colors duration-200" />

            {/* Body */}
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
                    {post.author && <span>{post.author.name}</span>}
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

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ links }: { links: PaginatedData<unknown>['links'] }) {
    if (links.filter(l => !l.label.includes('laquo') && !l.label.includes('raquo')).length <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-1 flex-wrap pt-10">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                            link.active
                                ? 'bg-[#F24F00] text-white'
                                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={i}
                        className="px-3 py-1.5 text-sm text-gray-300 ring-1 ring-gray-100"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
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
    const activeParentId = categories.find(cat =>
        cat.children.some(c => c.slug === activeCategory)
    )?.id ?? null;

    const [openId, setOpenId] = useState<number | null>(activeParentId);

    const toggleOpen = (id: number) => setOpenId(prev => prev === id ? null : id);

    return (
        <div className="bg-white p-4 shadow-sm">
            <SideboxHeader title="دسته‌بندی‌ها" />
            <div>
                {/* All posts */}
                <button
                    onClick={() => onSelect(undefined)}
                    className={`flex w-full items-center gap-2 py-2.5 border-b border-gray-100 text-sm transition-colors ${
                        !activeCategory ? 'text-[#F24F00] font-bold' : 'text-gray-700 hover:text-[#F24F00]'
                    }`}
                >
                    <span className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${!activeCategory ? 'bg-[#F24F00]' : 'bg-gray-300'}`} />
                    همه اخبار
                </button>

                {categories.map(cat => {
                    const hasChildren = cat.children.length > 0;
                    const isOpen      = openId === cat.id;
                    const isActive    = activeCategory === cat.slug;
                    const hasActiveChild = cat.children.some(c => c.slug === activeCategory);

                    return (
                        <div key={cat.id} className="border-b border-gray-100 last:border-0">
                            <div className="flex items-center">
                                <button
                                    onClick={() => onSelect(isActive ? undefined : cat.slug)}
                                    className={`flex flex-1 items-center gap-2 py-2.5 text-sm transition-colors ${
                                        isActive || hasActiveChild
                                            ? 'text-[#F24F00] font-bold'
                                            : 'text-gray-700 hover:text-[#F24F00]'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 flex-shrink-0 rounded-full transition-colors ${isActive || hasActiveChild ? 'bg-[#F24F00]' : 'bg-gray-300'}`} />
                                    {cat.name}
                                </button>

                                {hasChildren && (
                                    <button
                                        onClick={() => toggleOpen(cat.id)}
                                        aria-label={isOpen ? 'بستن' : 'باز کردن'}
                                        className="px-2 py-2.5 text-gray-300 hover:text-[#F24F00] transition-colors"
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
                                <div className="bg-gray-50/60 border-t border-gray-50 pb-0.5">
                                    {cat.children.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => onSelect(activeCategory === child.slug ? undefined : child.slug)}
                                            className={`flex w-full items-center gap-2 py-2 pr-5 text-xs transition-colors ${
                                                activeCategory === child.slug
                                                    ? 'text-[#F24F00] font-bold'
                                                    : 'text-gray-600 hover:text-[#F24F00]'
                                            }`}
                                        >
                                            <span className={`h-px w-3 flex-shrink-0 ${activeCategory === child.slug ? 'bg-[#F24F00]' : 'bg-gray-300'}`} />
                                            {child.name}
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
            <div className="flex gap-2">
                {/* Telegram */}
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 flex-col items-center gap-1.5 py-3 bg-[#229ED9] text-white hover:opacity-90 transition-opacity"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span className="text-[11px] font-medium">تلگرام</span>
                </a>

                {/* Instagram */}
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 flex-col items-center gap-1.5 py-3 bg-gradient-to-b from-[#E1306C] to-[#833AB4] text-white hover:opacity-90 transition-opacity"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-[11px] font-medium">اینستاگرام</span>
                </a>

                {/* WhatsApp */}
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 flex-col items-center gap-1.5 py-3 bg-[#25D366] text-white hover:opacity-90 transition-opacity"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="text-[11px] font-medium">واتساپ</span>
                </a>
            </div>
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

    const activeCategoryLabel = categories
        .flatMap(c => [c, ...c.children])
        .find(c => c.slug === activeCategory)?.name;

    return (
        <BlogLayout>
            <Head title="وبلاگ" />

            {/* Page header */}
            <div className="border-b border-gray-100 bg-white py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-8 bg-[#F24F00] flex-shrink-0" />
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight">وبلاگ نبض سلامت</h1>
                            <p className="mt-0.5 text-sm text-gray-500">آخرین مقالات، راهنماها و اخبار حوزه سلامت</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-7 items-start">

                    {/* ── Main content ── */}
                    <main>
                        {/* Sort bar */}
                        <div className="mb-5 flex items-center justify-between gap-3 bg-white px-4 py-3 shadow-sm">
                            <span className="text-sm text-gray-500">
                                <span className="font-bold text-gray-800">{posts.total.toLocaleString('fa-IR')}</span>
                                {' '}مقاله
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">مرتب‌سازی:</span>
                                <select
                                    value={activeSort}
                                    onChange={e => go({ sort: e.target.value })}
                                    className="border border-gray-200 bg-white py-1.5 pr-2 pl-7 text-sm text-gray-700 focus:border-[#F24F00] focus:outline-none focus:ring-1 focus:ring-[#F24F00] transition-colors"
                                >
                                    {Object.entries(SORT_LABELS).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active filter badges */}
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

                        {/* Posts grid */}
                        {posts.data.length > 0 ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {posts.data.map(post => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                                <Pagination links={posts.links} />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white py-24 text-center shadow-sm">
                                {/* Subtle illustration */}
                                <div className="mb-5 flex h-16 w-16 items-center justify-center bg-gray-50">
                                    <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
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

                    {/* ── Sidebar ── */}
                    <aside className="space-y-5 lg:sticky lg:top-28">

                        <SearchSideWidget
                            value={search}
                            onChange={setSearch}
                            onSubmit={submitSearch}
                        />

                        {categories.length > 0 && (
                            <CategoriesSideWidget
                                categories={categories}
                                activeCategory={activeCategory}
                                onSelect={slug => go({ category: slug as any })}
                            />
                        )}

                        <SocialSideWidget />

                    </aside>

                </div>
            </div>
        </BlogLayout>
    );
}
