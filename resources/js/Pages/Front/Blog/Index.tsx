import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ShopLayout from '@/Layouts/ShopLayout';
import type { BlogCategory, BlogPost, PaginatedData } from '@/types/models';

interface Props {
    posts: PaginatedData<BlogPost>;
    categories: Pick<BlogCategory, 'id' | 'name' | 'slug'>[];
    filters: { category?: string; search?: string; sort?: string };
}

const SORT_LABELS: Record<string, string> = {
    newest:      'جدیدترین',
    oldest:      'قدیمی‌ترین',
    most_viewed: 'پربازدیدترین',
};

function PostCard({ post }: { post: BlogPost }) {
    const date = post.published_at
        ? new Date(post.published_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-indigo-100"
        >
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                {post.featured_image ? (
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-200">
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                {post.category && (
                    <span className="text-xs font-medium text-indigo-600">{post.category.name}</span>
                )}
                <h2 className="line-clamp-2 text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors leading-7">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="line-clamp-2 text-sm text-gray-500 leading-6">{post.excerpt}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3 text-xs text-gray-400 border-t border-gray-50">
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

function Pagination({ links }: { links: PaginatedData<unknown>['links'] }) {
    if (links.filter(l => !l.label.includes('laquo') && !l.label.includes('raquo')).length <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-1 flex-wrap pt-10">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            link.active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={i}
                        className="rounded-lg px-3 py-1.5 text-sm text-gray-300 ring-1 ring-gray-100"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}

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

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        go({ search: search.trim() || undefined as any });
    };

    const activeSort = filters.sort ?? 'newest';
    const activeCategory = filters.category;

    return (
        <ShopLayout>
            <Head title="وبلاگ" />

            {/* Page header */}
            <div className="border-b border-gray-100 bg-white py-10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">وبلاگ</h1>
                    <p className="mt-2 text-gray-500">آخرین مقالات و اخبار</p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Filter bar */}
                <div className="mb-8 flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <form onSubmit={submitSearch} className="flex min-w-0 flex-1 items-center gap-2">
                        <div className="relative flex-1 min-w-[200px]">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="جستجو در مقالات..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Sort */}
                    <select
                        value={activeSort}
                        onChange={e => go({ sort: e.target.value })}
                        className="rounded-xl border border-gray-200 bg-white py-2 pr-3 pl-8 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none"
                    >
                        {Object.entries(SORT_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Category pills */}
                {categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        <button
                            onClick={() => go({ category: undefined as any })}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                !activeCategory
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            همه
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => go({ category: activeCategory === cat.slug ? undefined as any : cat.slug })}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    activeCategory === cat.slug
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Posts */}
                {posts.data.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {posts.data.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                        <Pagination links={posts.links} />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm ring-1 ring-gray-100">
                        <svg className="mb-4 h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400">مقاله‌ای یافت نشد.</p>
                        {(filters.search || filters.category) && (
                            <button
                                onClick={() => { setSearch(''); go({ search: undefined as any, category: undefined as any }); }}
                                className="mt-3 text-sm text-indigo-600 hover:underline"
                            >
                                پاک کردن فیلترها
                            </button>
                        )}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
