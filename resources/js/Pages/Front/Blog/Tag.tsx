import { useState, type FormEvent } from 'react';
import { Link, router } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import AdBannerSlot from '@/Components/AdBannerSlot';
import MostReadWidget from '@/Components/MostReadWidget';
import SeoHead from '@/Components/SeoHead';
import SocialFollowWidget from '@/Components/SocialFollowWidget';
import BlogPagination from '@/Components/BlogPagination';
import type { AdBanner, BlogPost, BlogTag, PaginatedData } from '@/types/models';

interface TagWithMeta extends BlogTag {
    posts_count: number;
}

interface Props {
    tag: TagWithMeta;
    posts: PaginatedData<BlogPost>;
    recentPosts: BlogPost[];
    mostRead: BlogPost[];
    search: string;
    adBanners: AdBanner[];
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
    const date = post.published_at ? (() => {
        const d = new Date(post.published_at);
        return d.toLocaleDateString('fa-IR') + ' — ' + d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
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
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="border-t-2 border-transparent group-hover:border-[#F24F00] transition-colors duration-200" />

            <div className="flex flex-1 flex-col gap-2 p-4">
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                            <Link
                                key={tag.id}
                                href={route('front.blog.tag', tag.slug)}
                                onClick={e => e.stopPropagation()}
                                className="bg-[#F24F00]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F24F00] hover:bg-[#F24F00] hover:text-white transition-colors"
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                <h2 className="line-clamp-2 text-sm font-bold text-gray-800 leading-snug group-hover:text-[#F24F00] transition-colors">
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

// ── Sidebar helpers ───────────────────────────────────────────────────────────
function SideboxHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-[#F24F00] flex-shrink-0" />
            <h3 className="text-sm font-black text-gray-900 tracking-tight">{title}</h3>
        </div>
    );
}

function SearchWidget({ slug, defaultValue }: { slug: string; defaultValue: string }) {
    const [q, setQ] = useState(defaultValue);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('front.blog.tag', slug), q.trim() ? { search: q.trim() } : {}, { preserveState: false });
    };

    return (
        <div>
            <SideboxHeader title="جستجو" />
            <form onSubmit={submit} className="relative">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="جستجو در خبرها..."
                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2 pr-9 text-sm focus:border-[#F24F00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F24F00] transition-colors"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F24F00] transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

function RecentWidget({ posts }: { posts: BlogPost[] }) {
    return (
        <div>
            <SideboxHeader title="جدیدترین خبرها" />
            <div>
                {posts.map((post, index) => (
                    <Link
                        key={post.id}
                        href={route('front.blog.show', post.slug)}
                        className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0 group items-start"
                    >
                        <div className="w-5 h-5 bg-gray-100 text-gray-400 text-[10px] font-bold flex-shrink-0 flex items-center justify-center mt-0.5">
                            {(index + 1).toLocaleString('fa-IR')}
                        </div>
                        <div className="w-16 h-12 shrink-0 overflow-hidden bg-gray-100">
                            {post.featured_image
                                ? <img src={`/storage/${post.featured_image}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                : <div className="w-full h-full bg-gray-200" />
                            }
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                            <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#F24F00] transition-colors">
                                {post.title}
                            </h4>
                            {post.published_at && (
                                <span className="text-[10px] text-gray-400">{new Date(post.published_at).toLocaleDateString('fa-IR')}</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function SocialWidget() {
    return (
        <div>
            <SideboxHeader title="ما را دنبال کنید" />
            <SocialFollowWidget />
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogTag({ tag, posts, recentPosts, mostRead, search, adBanners }: Props) {
    return (
        <BlogLayout>
            <SeoHead
                title={`#${tag.name}`}
                description={`مقالات برچسب ${tag.name} در نبض سلامت`}
                url={`/blog/tag/${tag.slug}`}
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
                    <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
                    <svg className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <Link href={route('front.blog.index')} className="hover:text-gray-600 transition-colors">وبلاگ</Link>
                    <svg className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-gray-700 font-medium">#{tag.name}</span>
                </nav>

                {/* Tag header */}
                <div className="mb-7 overflow-hidden bg-white shadow-sm border-b-4 border-[#F24F00]">
                    <div className="h-1.5 w-full bg-[#F24F00]" />
                    <div className="flex items-center gap-5 p-5">
                        <div className="flex h-16 w-16 flex-none items-center justify-center bg-[#F24F00]/10 ring-2 ring-[#F24F00]/20">
                            <svg className="h-7 w-7 text-[#F24F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-black text-gray-900">#{tag.name}</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 bg-[#F24F00]/10 text-[#F24F00] text-xs font-bold px-2 py-0.5">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {tag.posts_count.toLocaleString('fa-IR')} مقاله
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search result notice */}
                {search && (
                    <div className="mb-5 flex items-center gap-2 text-sm text-gray-600 bg-[#F24F00]/5 border border-[#F24F00]/20 px-4 py-2.5">
                        <svg className="h-4 w-4 text-[#F24F00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>نتایج جستجو برای «<strong>{search}</strong>» — {posts.total.toLocaleString('fa-IR')} مقاله</span>
                        <Link
                            href={route('front.blog.tag', tag.slug)}
                            className="mr-auto text-xs text-[#F24F00] hover:underline shrink-0"
                        >
                            پاک کردن
                        </Link>
                    </div>
                )}

                {/* Main 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-7 items-start">

                    <main>
                        {posts.data.length > 0 ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                                    {posts.data.map(post => <PostCard key={post.id} post={post} />)}
                                </div>
                                {posts.last_page > 1 && <BlogPagination links={posts.links} className="mt-8" />}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white py-20 text-center shadow-sm">
                                <div className="mb-5 relative">
                                    <div className="flex h-20 w-20 items-center justify-center bg-gray-50">
                                        <svg className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#F24F00]/20" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#075F26]/20" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">
                                    {search ? `نتیجه‌ای برای «${search}» یافت نشد` : 'هنوز مقاله‌ای با این برچسب منتشر نشده است'}
                                </p>
                                <p className="mt-1 text-xs text-gray-400 max-w-xs">
                                    {search ? 'عبارت دیگری جستجو کنید یا فیلتر جستجو را پاک کنید.' : 'به زودی اخبار با این برچسب منتشر خواهد شد.'}
                                </p>
                                {search && (
                                    <Link
                                        href={route('front.blog.tag', tag.slug)}
                                        className="mt-4 inline-flex items-center gap-1.5 bg-[#F24F00] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                                    >
                                        پاک کردن جستجو
                                    </Link>
                                )}
                            </div>
                        )}
                    </main>

                    <aside className="space-y-5 lg:sticky lg:top-28">
                        <div className="bg-white p-4 shadow-sm">
                            <SearchWidget slug={tag.slug} defaultValue={search} />
                        </div>

                        {mostRead.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <MostReadWidget posts={mostRead} />
                            </div>
                        )}

                        {recentPosts.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <RecentWidget posts={recentPosts} />
                            </div>
                        )}

                        {adBanners.length > 0 && (
                            <AdBannerSlot banners={adBanners} />
                        )}

                        <div className="bg-white p-4 shadow-sm">
                            <SocialWidget />
                        </div>
                    </aside>

                </div>
            </div>
        </BlogLayout>
    );
}
