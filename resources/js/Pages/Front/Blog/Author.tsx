import { Link } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import AdBannerSlot from '@/Components/AdBannerSlot';
import MostReadWidget from '@/Components/MostReadWidget';
import SeoHead from '@/Components/SeoHead';
import BlogPagination from '@/Components/BlogPagination';
import type { AdBanner, BlogPost, PaginatedData } from '@/types/models';

interface AuthorSummary {
    id: number;
    name: string;
}

interface Props {
    author: AuthorSummary;
    posts: PaginatedData<BlogPost>;
    recentPosts: BlogPost[];
    mostRead: BlogPost[];
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
                {post.category && (
                    <span className="text-[11px] font-bold text-[#F24F00] uppercase tracking-wide">
                        {post.category.name}
                    </span>
                )}
                <h2 className="line-clamp-2 text-sm font-bold text-gray-800 leading-snug group-hover:text-[#F24F00] transition-colors">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed">{post.excerpt}</p>
                )}
                <div className="mt-auto flex items-center justify-end pt-3 border-t border-gray-50 text-xs text-gray-400">
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

function RecentWidget({ posts }: { posts: BlogPost[] }) {
    return (
        <div>
            <SideboxHeader title="جدیدترین اخبار" />
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogAuthor({ author, posts, recentPosts, mostRead, adBanners }: Props) {
    return (
        <BlogLayout>
            <SeoHead
                title={author.name}
                description={`مقالات نوشته‌شده توسط ${author.name} در نبض سلامت`}
                url={`/blog/author/${author.id}`}
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
                    <span className="text-gray-700 font-medium">نویسنده: {author.name}</span>
                </nav>

                {/* Author header */}
                <div className="mb-7 overflow-hidden bg-white shadow-sm border-b-4 border-[#F24F00]">
                    <div className="h-1.5 w-full bg-[#F24F00]" />
                    <div className="flex items-center gap-5 p-5">
                        <div className="h-16 w-16 flex-none flex items-center justify-center bg-[#042F10] text-white text-2xl font-black shrink-0">
                            {author.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-black text-gray-900">{author.name}</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 bg-[#F24F00]/10 text-[#F24F00] text-xs font-bold px-2 py-0.5">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {posts.total.toLocaleString('fa-IR')} مقاله
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

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
                                <div className="mb-5">
                                    <div className="flex h-20 w-20 items-center justify-center bg-gray-50">
                                        <svg className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">هنوز مقاله‌ای منتشر نشده است</p>
                                <p className="mt-1 text-xs text-gray-400">این نویسنده هنوز مقاله‌ای منتشر نکرده است.</p>
                            </div>
                        )}
                    </main>

                    <aside className="space-y-5 lg:sticky lg:top-28">
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
                    </aside>

                </div>
            </div>
        </BlogLayout>
    );
}
