import { useState, useMemo, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BlogPost, PaginatedData } from '@/types/models';
import { toJalali } from '@/utils/date';
import type { PageProps } from '@/types';

interface Props {
    posts: PaginatedData<BlogPost>;
    activeCategory?: { id: number; name: string } | null;
    statusCounts: Record<string, number>;
    filters: { search: string };
}

const statusLabel: Record<string, string> = { draft: 'پیش‌نویس', published: 'منتشر شده' };
const statusClass: Record<string, string> = {
    draft: 'bg-yellow-50 text-yellow-700',
    published: 'bg-green-50 text-green-700',
};

export default function BlogIndex({ posts, activeCategory, statusCounts, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canCreate = auth.user.permissions.includes('blog.create');
    const canEdit   = auth.user.permissions.includes('blog.edit');
    const canDelete = auth.user.permissions.includes('blog.delete');

    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const statusOptions = Object.entries(statusCounts);

    const filteredPosts = useMemo(() => {
        return posts.data.filter(post =>
            selectedStatus === null || post.status === selectedStatus
        );
    }, [posts.data, selectedStatus]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            router.get(
                route('blog.index'),
                { ...(activeCategory ? { category: activeCategory.id } : {}), ...(value ? { search: value } : {}) },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);
    };

    const destroy = (post: BlogPost) => {
        if (confirm(`آیا از حذف مقاله "${post.title}" اطمینان دارید؟`)) {
            router.delete(route('blog.destroy', post.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold leading-tight text-gray-800">مقالات وبلاگ</h2>
                    {canCreate && (
                        <Link
                            href={route('blog.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            + مقاله جدید
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="مقالات وبلاگ" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

                    {activeCategory && (
                        <div className="flex items-center gap-2 rounded-md bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700">
                            <span>فیلتر دسته‌بندی:</span>
                            <span className="font-semibold">{activeCategory.name}</span>
                            <Link href={route('blog.index')} className="mr-auto text-indigo-400 hover:text-indigo-700">✕ حذف فیلتر</Link>
                        </div>
                    )}

                    {(posts.data.length > 0 || filters.search !== '') && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
                            <div className="relative flex-1 max-w-sm">
                                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => handleSearch(e.target.value)}
                                    placeholder="جستجو در عنوان، خلاصه و متن..."
                                    className="w-full rounded-md border border-gray-200 py-2 pr-9 pl-3 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                    dir="rtl"
                                />
                            </div>

                            {statusOptions.length > 0 && (
                                <div className="flex items-center text-sm">
                                    <button
                                        onClick={() => setSelectedStatus(null)}
                                        className={`px-3 py-1 transition-colors ${selectedStatus === null ? 'font-semibold text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        همه
                                    </button>
                                    {statusOptions.map(([status, count]) => (
                                        <span key={status} className="flex items-center">
                                            <span className="text-gray-300 select-none">|</span>
                                            <button
                                                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                                                className={`px-3 py-1 transition-colors ${selectedStatus === status ? 'font-semibold text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {statusLabel[status] ?? status} ({count})
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {posts.data.length === 0 && filters.search === '' ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                            <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <p className="text-sm text-gray-500">هیچ مقاله‌ای ثبت نشده است.</p>
                            {canCreate && (
                                <Link href={route('blog.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                                    + مقاله جدید
                                </Link>
                            )}
                        </div>
                    ) : posts.data.length === 0 || filteredPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-14 text-center">
                            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm text-gray-500">نتیجه‌ای برای فیلتر انتخابی یافت نشد.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['#', 'تصویر', 'عنوان', 'نویسنده', 'دسته‌بندی', 'نظرات', 'وضعیت', 'تاریخ', ''].map(h => (
                                                <th key={h} className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredPosts.map(post => (
                                            <tr key={post.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-500">{post.id}</td>
                                                <td className="px-4 py-3">
                                                    {post.featured_image ? (
                                                        <img
                                                            src={`/storage/${post.featured_image}`}
                                                            alt=""
                                                            className="h-10 w-16 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                                                            <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-800 max-w-xs truncate">{post.title}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{post.author?.name ?? '—'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {post.categories && post.categories.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {post.categories.map(cat => (
                                                                <Link
                                                                    key={cat.id}
                                                                    href={route('blog.index', { category: cat.id })}
                                                                    className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
                                                                >
                                                                    {cat.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{post.comments_count ?? 0}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[post.status]}`}>
                                                        {statusLabel[post.status]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {post.published_at ? toJalali(post.published_at) : toJalali(post.created_at)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {post.status === 'published' && (
                                                            <a
                                                                href={route('front.blog.show', post.slug)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="مشاهده"
                                                                className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        {canEdit && (
                                                            <Link
                                                                href={route('blog.edit', post.id)}
                                                                title="ویرایش"
                                                                className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                type="button"
                                                                title="حذف"
                                                                onClick={() => destroy(post)}
                                                                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center gap-1">
                            {posts.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded px-3 py-1.5 text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    />
                                ) : (
                                    <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="rounded px-3 py-1.5 text-sm text-gray-300" />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
