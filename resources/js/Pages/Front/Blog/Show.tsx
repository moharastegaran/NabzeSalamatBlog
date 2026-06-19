import { useState, useEffect, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import AdBannerSlot from '@/Components/AdBannerSlot';
import type { AdBanner, BlogComment, BlogPost, BlogTag } from '@/types/models';

interface Props {
    post: BlogPost & { approved_comments: BlogComment[] };
    related: BlogPost[];
    recentPosts: BlogPost[];
    adBanners: AdBanner[];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Sidebar header (matches Category.tsx) ─────────────────────────────────────
function SideboxHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b-2 border-[#F24F00]">
            <span className="inline-block w-3 h-3 bg-[#F24F00] shrink-0" />
            <h3 className="text-sm font-black text-gray-900 tracking-tight">{title}</h3>
        </div>
    );
}

// ── Recent / related compact card ─────────────────────────────────────────────
function RecentCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0 group"
        >
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
    );
}

// ── Thin right action sidebar ──────────────────────────────────────────────────
function ActionSidebar({ commentCount }: { commentCount: number }) {
    const [pageUrl, setPageUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => { setPageUrl(window.location.href); }, []);

    const shareUrl = encodeURIComponent(pageUrl);

    const copyLink = () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const scrollToComments = () => {
        document.getElementById('post-comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="sticky top-6 flex flex-col items-center gap-3">
            {/* Telegram */}
            <a
                href={pageUrl ? `https://t.me/share/url?url=${shareUrl}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                title="اشتراک در تلگرام"
                className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-500 hover:bg-[#229ED9] hover:text-white transition-colors duration-200"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
            </a>

            {/* WhatsApp */}
            <a
                href={pageUrl ? `https://wa.me/?text=${shareUrl}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                title="اشتراک در واتساپ"
                className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-500 hover:bg-[#25D366] hover:text-white transition-colors duration-200"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            </a>

            {/* Copy link */}
            <button
                onClick={copyLink}
                title={copied ? 'کپی شد!' : 'کپی لینک'}
                className={`w-10 h-10 flex items-center justify-center bg-white shadow-sm transition-colors duration-200 ${
                    copied ? 'text-green-500' : 'text-gray-500 hover:bg-[#F24F00] hover:text-white'
                }`}
            >
                {copied ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                )}
            </button>

            <div className="w-5 h-px bg-gray-200" />

            {/* Comments scroll */}
            <button
                onClick={scrollToComments}
                title="رفتن به نظرات"
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#F24F00] transition-colors"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span className="text-[10px] font-semibold tabular-nums">{commentCount}</span>
            </button>
        </div>
    );
}

// ── Comment form ───────────────────────────────────────────────────────────────
function CommentForm({ postId }: { postId: number }) {
    const [form, setForm] = useState({ name: '', email: '', body: '' });
    const [submitted, setSubmitted] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.post(route('blog.comments.store', postId), form, {
            preserveScroll: true,
            onSuccess: () => { setForm({ name: '', email: '', body: '' }); setSubmitted(true); },
        });
    };

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-100 px-5 py-4 text-sm text-green-700">
                نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود.
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">نام <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-[#F24F00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F24F00]"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">ایمیل</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-[#F24F00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F24F00]"
                    />
                </div>
            </div>
            <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">متن نظر <span className="text-red-500">*</span></label>
                <textarea
                    required
                    rows={4}
                    value={form.body}
                    onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-[#F24F00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F24F00] resize-none"
                />
            </div>
            <button
                type="submit"
                className="bg-[#F24F00] px-6 py-2 text-sm font-bold text-white hover:bg-[#d44400] transition-colors"
            >
                ارسال نظر
            </button>
        </form>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogShow({ post, related, recentPosts, adBanners }: Props) {
    const date = post.published_at ? formatDate(post.published_at) : null;
    const comments = post.approved_comments ?? [];

    return (
        <BlogLayout>
            <Head title={`${post.title} | وبلاگ`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                    <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
                    <span>/</span>
                    <Link href={route('front.blog.index')} className="hover:text-gray-600 transition-colors">وبلاگ</Link>
                    {post.category && (
                        <>
                            <span>/</span>
                            <Link href={route('front.blog.category', post.category.slug)} className="hover:text-gray-600 transition-colors">
                                {post.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-700 line-clamp-1">{post.title}</span>
                </nav>

                {/* Post title block */}
                <div className="mb-6">
                    {post.category && (
                        <Link
                            href={route('front.blog.category', post.category.slug)}
                            className="mb-2 inline-block text-xs font-bold text-[#F24F00] uppercase tracking-wide hover:underline"
                        >
                            {post.category.name}
                        </Link>
                    )}
                    <h1 className="text-2xl font-black leading-snug text-gray-900 sm:text-3xl">{post.title}</h1>
                    {post.excerpt && (
                        <p className="mt-2 text-base text-gray-500 leading-7">{post.excerpt}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 border-b border-gray-100 pb-4">
                        {post.author && (
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {post.author.name}
                            </span>
                        )}
                        {date && (
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                                </svg>
                                {date}
                            </span>
                        )}
                        {post.views > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {post.views.toLocaleString('fa-IR')} بازدید
                            </span>
                        )}
                        {comments.length > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                                {comments.length} نظر
                            </span>
                        )}
                    </div>
                </div>

                {/* Featured image — below title */}
                {post.featured_image && (
                    <div className="mb-8 w-full overflow-hidden bg-gray-100 max-h-[460px]">
                        <img
                            src={`/storage/${post.featured_image}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* 3-column: RTL → col1=right(44px action) | col2=middle(article) | col3=left(sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-[44px_1fr_272px] gap-6 items-start">

                    {/* Thin right action sidebar */}
                    <div className="hidden lg:block">
                        <ActionSidebar commentCount={comments.length} />
                    </div>

                    {/* Main article */}
                    <article className="min-w-0">

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {post.tags.map((tag: BlogTag) => (
                                    <span key={tag.id} className="bg-[#F24F00]/10 px-3 py-1 text-xs font-bold text-[#F24F00]">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Body */}
                        <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.body }} />

                        {/* Comments */}
                        <div id="post-comments" className="mt-14 scroll-mt-6">
                            <h2 className="mb-6 flex items-center gap-2 text-base font-black text-gray-900">
                                <span className="inline-block w-3 h-3 bg-[#F24F00]" />
                                نظرات
                                {comments.length > 0 && (
                                    <span className="text-sm font-normal text-gray-400">({comments.length})</span>
                                )}
                            </h2>

                            {comments.length > 0 && (
                                <div className="mb-8 space-y-4">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="bg-white p-5 shadow-sm">
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="font-bold text-gray-800 text-sm">{comment.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(comment.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-7">{comment.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="bg-white p-6 shadow-sm">
                                <h3 className="mb-5 flex items-center gap-2 text-sm font-black text-gray-800">
                                    <span className="inline-block w-2.5 h-2.5 bg-[#F24F00]" />
                                    ثبت نظر
                                </h3>
                                <CommentForm postId={post.id} />
                            </div>
                        </div>

                        {/* Related posts */}
                        {related.length > 0 && (
                            <section className="mt-14">
                                <h2 className="mb-5 flex items-center gap-2 text-base font-black text-gray-900">
                                    <span className="inline-block w-3 h-3 bg-[#F24F00]" />
                                    مقالات مرتبط
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {related.map(p => (
                                        <Link
                                            key={p.id}
                                            href={route('front.blog.show', p.slug)}
                                            className="group flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                                {p.featured_image ? (
                                                    <img src={`/storage/${p.featured_image}`} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-200">
                                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col gap-1.5 p-3">
                                                <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-[#F24F00] transition-colors leading-snug">
                                                    {p.title}
                                                </h3>
                                                {p.published_at && (
                                                    <span className="text-xs text-gray-400">{formatDate(p.published_at)}</span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </article>

                    {/* Left sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-6">

                        {/* Recent posts */}
                        {recentPosts.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <SideboxHeader title="جدیدترین مقالات" />
                                <div>
                                    {recentPosts.map(p => <RecentCard key={p.id} post={p} />)}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <SideboxHeader title="برچسب‌ها" />
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: BlogTag) => (
                                        <span key={tag.id} className="bg-[#F24F00]/10 px-3 py-1 text-xs font-bold text-[#F24F00]">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        {post.category && (
                            <div className="bg-white p-4 shadow-sm">
                                <SideboxHeader title="دسته‌بندی" />
                                <Link
                                    href={route('front.blog.category', post.category.slug)}
                                    className="flex items-center justify-between py-1.5 text-sm text-gray-700 hover:text-[#F24F00] transition-colors group"
                                >
                                    <span>{post.category.name}</span>
                                    <svg className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#F24F00] transition-colors -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {/* Ad banners */}
                        {adBanners.length > 0 && (
                            <AdBannerSlot banners={adBanners} />
                        )}

                        {/* Social */}
                        <div className="bg-white p-4 shadow-sm">
                            <SideboxHeader title="ما را دنبال کنید" />
                            <div className="flex justify-around pt-1">
                                {([
                                    {
                                        label: 'تلگرام', href: '#', color: 'hover:bg-[#229ED9]',
                                        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
                                    },
                                    {
                                        label: 'اینستاگرام', href: '#', color: 'hover:bg-[#E1306C]',
                                        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
                                    },
                                    {
                                        label: 'ایکس', href: '#', color: 'hover:bg-gray-900',
                                        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                                    },
                                ] as const).map(s => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-1.5 group"
                                    >
                                        <div className={`w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors duration-200 ${s.color}`}>
                                            {s.icon}
                                        </div>
                                        <span className="text-[11px] text-gray-500 group-hover:text-[#F24F00] transition-colors">{s.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </aside>
                </div>
            </div>
        </BlogLayout>
    );
}
