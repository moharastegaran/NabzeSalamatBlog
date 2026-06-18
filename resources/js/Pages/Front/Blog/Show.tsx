import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import BlogLayout from '@/Layouts/BlogLayout';
import type { BlogComment, BlogPost, BlogTag } from '@/types/models';

interface Props {
    post: BlogPost & {
        approved_comments: BlogComment[];
    };
    related: BlogPost[];
    recentPosts: BlogPost[];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function RelatedCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={route('front.blog.show', post.slug)}
            className="group flex gap-3 items-start"
        >
            <div className="flex-none w-20 h-16 overflow-hidden rounded-lg bg-gray-100">
                {post.featured_image ? (
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-200">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="line-clamp-2 text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors leading-6">
                    {post.title}
                </p>
                {post.published_at && (
                    <p className="mt-1 text-xs text-gray-400">{formatDate(post.published_at)}</p>
                )}
            </div>
        </Link>
    );
}

function CommentForm({ postId }: { postId: number }) {
    const [form, setForm] = useState({ name: '', email: '', body: '' });
    const [submitted, setSubmitted] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('blog.comments.store', postId), form, {
            preserveScroll: true,
            onSuccess: () => { setForm({ name: '', email: '', body: '' }); setSubmitted(true); },
        });
    };

    if (submitted) {
        return (
            <div className="rounded-xl bg-green-50 px-5 py-4 text-sm text-green-700 ring-1 ring-green-100">
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
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">ایمیل</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
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
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
                />
            </div>
            <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
                ارسال نظر
            </button>
        </form>
    );
}

export default function BlogShow({ post, related, recentPosts }: Props) {
    const date = post.published_at ? formatDate(post.published_at) : null;
    const comments = post.approved_comments ?? [];

    return (
        <BlogLayout>
            <Head title={`${post.title} | وبلاگ`} />

            {/* Featured image */}
            {post.featured_image && (
                <div className="w-full max-h-[480px] overflow-hidden bg-gray-100">
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                    <Link href="/" className="hover:text-gray-600">خانه</Link>
                    <span>/</span>
                    <Link href={route('front.blog.index')} className="hover:text-gray-600">وبلاگ</Link>
                    {post.category && (
                        <>
                            <span>/</span>
                            <Link href={route('front.blog.category', post.category.slug)} className="hover:text-gray-600">
                                {post.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-600 line-clamp-1">{post.title}</span>
                </nav>

                <div className="flex flex-col gap-10 lg:flex-row lg:items-start">

                    {/* Main content */}
                    <article className="min-w-0 flex-1">

                        {/* Post header */}
                        <div className="mb-8">
                            {post.category && (
                                <Link
                                    href={route('front.blog.category', post.category.slug)}
                                    className="mb-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    {post.category.name}
                                </Link>
                            )}
                            <h1 className="text-2xl font-bold leading-9 text-gray-900 sm:text-3xl">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="mt-3 text-base text-gray-500 leading-7">{post.excerpt}</p>
                            )}

                            {/* Meta row */}
                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400 border-b border-gray-100 pb-5">
                                {post.author && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        {post.author.name}
                                    </span>
                                )}
                                {date && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                                        </svg>
                                        {date}
                                    </span>
                                )}
                                {post.views > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {post.views.toLocaleString('fa-IR')} بازدید
                                    </span>
                                )}
                                {comments.length > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                        </svg>
                                        {comments.length} نظر
                                    </span>
                                )}
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.map((tag: BlogTag) => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Post body */}
                        <div
                            className="blog-body"
                            dangerouslySetInnerHTML={{ __html: post.body }}
                        />

                        {/* Comments */}
                        <div className="mt-14">
                            <h2 className="mb-6 text-lg font-bold text-gray-800">
                                نظرات
                                {comments.length > 0 && (
                                    <span className="mr-2 text-sm font-normal text-gray-400">({comments.length})</span>
                                )}
                            </h2>

                            {comments.length > 0 && (
                                <div className="mb-10 space-y-4">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="font-medium text-gray-800 text-sm">{comment.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(comment.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-7">{comment.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                                <h3 className="mb-5 text-base font-semibold text-gray-800">ثبت نظر</h3>
                                <CommentForm postId={post.id} />
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 flex-none space-y-6">

                        {/* Recent posts */}
                        {recentPosts.length > 0 && (
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                <h3 className="mb-4 text-sm font-bold text-gray-800">جدیدترین مقالات</h3>
                                <div className="space-y-4">
                                    {recentPosts.map(p => (
                                        <RelatedCard key={p.id} post={p} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tag cloud */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                <h3 className="mb-4 text-sm font-bold text-gray-800">برچسب‌ها</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: BlogTag) => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600 ring-1 ring-gray-200"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category link */}
                        {post.category && (
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                <h3 className="mb-3 text-sm font-bold text-gray-800">دسته‌بندی</h3>
                                <Link
                                    href={route('front.blog.category', post.category.slug)}
                                    className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                                >
                                    {post.category.name}
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-6 text-lg font-bold text-gray-800">مقالات مرتبط</h2>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map(p => (
                                <Link
                                    key={p.id}
                                    href={route('front.blog.show', p.slug)}
                                    className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-indigo-100"
                                >
                                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                        {p.featured_image ? (
                                            <img
                                                src={`/storage/${p.featured_image}`}
                                                alt={p.title}
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
                                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors leading-6">
                                            {p.title}
                                        </h3>
                                        {p.excerpt && (
                                            <p className="line-clamp-2 text-xs text-gray-500">{p.excerpt}</p>
                                        )}
                                        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-gray-400 border-t border-gray-50">
                                            {p.author && <span>{p.author.name}</span>}
                                            {p.published_at && <span>{formatDate(p.published_at)}</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </BlogLayout>
    );
}
