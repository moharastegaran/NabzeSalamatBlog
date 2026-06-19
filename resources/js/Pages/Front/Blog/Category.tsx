import { useState, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BlogLayout from '@/Layouts/BlogLayout';
import type { BlogCategory, BlogPost, PaginatedData } from '@/types/models';

interface CategoryChild extends Pick<BlogCategory, 'id' | 'name' | 'slug'> {
    posts_count: number;
}

interface CategoryWithMeta extends BlogCategory {
    posts_count: number;
    parent?: Pick<BlogCategory, 'id' | 'name' | 'slug'>;
    children: CategoryChild[];
}

interface Props {
    category: CategoryWithMeta;
    posts: PaginatedData<BlogPost>;
    recentPosts: BlogPost[];
    search: string;
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
    const date = post.published_at ? new Date(post.published_at).toLocaleDateString('fa-IR') : null;

    return (
        <Link href={route('front.blog.show', post.slug)} className="group flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="aspect-video w-full overflow-hidden bg-gray-100 flex-shrink-0">
                {post.featured_image ? (
                    <img src={`/storage/${post.featured_image}`} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="bg-[#F24F00]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F24F00]">
                                {tag.name}
                            </span>
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
    const pages = links.filter(l => l.label !== '&laquo; قبلی' && l.label !== 'بعدی &raquo;');
    if (pages.length <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1 flex-wrap mt-8">
            {links.map((link, i) => (
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
            ))}
        </div>
    );
}

// ── Sidebar helpers ───────────────────────────────────────────────────────────
function SideboxHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b-2 border-[#F24F00]">
            <span className="inline-block w-3 h-3 bg-[#F24F00] shrink-0" />
            <h3 className="text-sm font-black text-gray-900 tracking-tight">{title}</h3>
        </div>
    );
}

function SearchWidget({ slug, defaultValue }: { slug: string; defaultValue: string }) {
    const [q, setQ] = useState(defaultValue);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('front.blog.category', slug), q.trim() ? { search: q.trim() } : {}, { preserveState: false });
    };

    return (
        <div>
            <SideboxHeader title="جستجو" />
            <form onSubmit={submit} className="relative">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="جستجو در مقالات..."
                    className="w-full border border-gray-200 bg-gray-50 px-3 py-2 pr-9 text-sm focus:border-[#F24F00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F24F00]"
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

function ChildrenWidget({ children }: { children: CategoryChild[] }) {
    return (
        <div>
            <SideboxHeader title="زیردسته‌ها" />
            <div>
                {children.map(child => (
                    <Link
                        key={child.id}
                        href={route('front.blog.category', child.slug)}
                        className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm text-gray-700 hover:text-[#F24F00] transition-colors group"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="h-3 w-3 text-gray-300 group-hover:text-[#F24F00] transition-colors -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            {child.name}
                        </span>
                        <span className="text-xs text-gray-400 tabular-nums">{child.posts_count.toLocaleString('fa-IR')}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function RecentWidget({ posts }: { posts: BlogPost[] }) {
    return (
        <div>
            <SideboxHeader title="جدیدترین مقالات" />
            <div>
                {posts.map(post => (
                    <Link
                        key={post.id}
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
                ))}
            </div>
        </div>
    );
}

function SocialWidget() {
    const socials = [
        {
            label: 'تلگرام',
            href: '#',
            color: 'hover:bg-[#229ED9]',
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
            ),
        },
        {
            label: 'اینستاگرام',
            href: '#',
            color: 'hover:bg-[#E1306C]',
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            ),
        },
        {
            label: 'ایکس',
            href: '#',
            color: 'hover:bg-gray-900',
            icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            ),
        },
    ];

    return (
        <div>
            <SideboxHeader title="ما را دنبال کنید" />
            <div className="flex justify-around pt-1">
                {socials.map(s => (
                    <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center gap-1.5 group`}
                    >
                        <div className={`w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors duration-200 ${s.color}`}>
                            {s.icon}
                        </div>
                        <span className="text-[11px] text-gray-500 group-hover:text-[#F24F00] transition-colors">{s.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogCategory({ category, posts, recentPosts, search }: Props) {
    return (
        <BlogLayout>
            <Head title={`${category.name} | وبلاگ`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
                    <span>/</span>
                    <Link href={route('front.blog.index')} className="hover:text-gray-600 transition-colors">وبلاگ</Link>
                    {category.parent && (
                        <>
                            <span>/</span>
                            <Link href={route('front.blog.category', category.parent.slug)} className="hover:text-gray-600 transition-colors">
                                {category.parent.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-gray-700 font-medium">{category.name}</span>
                </nav>

                {/* Category header */}
                <div className="mb-7 flex items-center gap-5 bg-white p-5 shadow-sm border-r-4 border-[#F24F00]">
                    {(category.thumbnail || category.icon) && (
                        <img
                            src={`/storage/${category.thumbnail ?? category.icon}`}
                            alt={category.name}
                            className="h-16 w-16 flex-none object-cover ring-1 ring-gray-100"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-black text-gray-900">{category.name}</h1>
                        {category.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
                        )}
                        <p className="mt-1.5 text-xs text-gray-400">
                            {category.posts_count.toLocaleString('fa-IR')} مقاله
                        </p>
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
                            href={route('front.blog.category', category.slug)}
                            className="mr-auto text-xs text-[#F24F00] hover:underline shrink-0"
                        >
                            پاک کردن
                        </Link>
                    </div>
                )}

                {/* Main 2-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-7 items-start">

                    {/* Posts */}
                    <main>
                        {posts.data.length > 0 ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                                    {posts.data.map(post => <PostCard key={post.id} post={post} />)}
                                </div>
                                {posts.last_page > 1 && <Pagination links={posts.links} />}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white py-20 text-center shadow-sm">
                                <svg className="mb-4 h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm text-gray-400">
                                    {search ? `نتیجه‌ای برای «${search}» یافت نشد.` : 'هنوز مقاله‌ای در این دسته‌بندی منتشر نشده است.'}
                                </p>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="space-y-6 lg:sticky lg:top-6">

                        <div className="bg-white p-4 shadow-sm">
                            <SearchWidget slug={category.slug} defaultValue={search} />
                        </div>

                        {!category.parent_id && category.children.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <ChildrenWidget children={category.children} />
                            </div>
                        )}

                        {recentPosts.length > 0 && (
                            <div className="bg-white p-4 shadow-sm">
                                <RecentWidget posts={recentPosts} />
                            </div>
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
