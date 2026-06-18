import { Head, Link } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import type { BlogCategory, BlogPost, PaginatedData } from '@/types/models';

interface CategoryWithMeta extends BlogCategory {
    posts_count: number;
    parent?: Pick<BlogCategory, 'id' | 'name' | 'slug'>;
    children: (Pick<BlogCategory, 'id' | 'name' | 'slug'> & { posts_count: number })[];
}

interface Props {
    category: CategoryWithMeta;
    posts: PaginatedData<BlogPost>;
}

function PostCard({ post }: { post: BlogPost }) {
    const date = post.published_at
        ? new Date(post.published_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <Link href={route('front.blog.show', post.slug)} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-indigo-100">
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
                {post.featured_image ? (
                    <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <h2 className="line-clamp-2 text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                </h2>

                {post.excerpt && (
                    <p className="line-clamp-2 text-sm text-gray-500">{post.excerpt}</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-3 text-xs text-gray-400">
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
    const pages = links.filter(l => l.label !== '&laquo; قبلی' && l.label !== 'بعدی &raquo;');
    if (pages.length <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1 flex-wrap">
            {links.map((link, i) => (
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
            ))}
        </div>
    );
}

export default function BlogCategory({ category, posts }: Props) {
    return (
        <BlogLayout>
            <Head title={`${category.name} | وبلاگ`} />

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-gray-600">خانه</Link>
                    <span>/</span>
                    <Link href={route('front.blog.index')} className="hover:text-gray-600">وبلاگ</Link>
                    {category.parent && (
                        <>
                            <span>/</span>
                            <Link href={route('front.blog.category', category.parent.slug)} className="hover:text-gray-600">
                                {category.parent.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-700">{category.name}</span>
                </nav>

                {/* Category header */}
                <div className="mb-8 flex items-start gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    {(category.thumbnail || category.icon) && (
                        <img
                            src={`/storage/${category.thumbnail ?? category.icon}`}
                            alt={category.name}
                            className="h-20 w-20 flex-none rounded-xl object-cover ring-1 ring-gray-200"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
                        {category.description && (
                            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-400">{category.posts_count} مقاله</p>
                    </div>
                </div>

                {/* Child categories */}
                {category.children.length > 0 && (
                    <div className="mb-8">
                        <h2 className="mb-3 text-sm font-medium text-gray-500">زیردسته‌ها</h2>
                        <div className="flex flex-wrap gap-2">
                            {category.children.map(child => (
                                <Link
                                    key={child.id}
                                    href={route('front.blog.category', child.slug)}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                >
                                    {child.name}
                                    {child.posts_count > 0 && (
                                        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                                            {child.posts_count}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Posts grid */}
                {posts.data.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.data.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {posts.last_page > 1 && (
                            <div className="mt-10">
                                <Pagination links={posts.links} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm ring-1 ring-gray-100">
                        <svg className="mb-4 h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400">هنوز مقاله‌ای در این دسته‌بندی منتشر نشده است.</p>
                    </div>
                )}
            </div>
        </BlogLayout>
    );
}
