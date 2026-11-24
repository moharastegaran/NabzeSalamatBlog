import { useState, useMemo, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import { BlogCategory, BlogPost, PaginatedData } from '@/types/models';
import { toJalali } from '@/utils/date';
import { markdownToTelegramField, serializeTelegramTags } from '@/utils/telegramClipboard';
import type { PageProps } from '@/types';

interface Props {
    posts: PaginatedData<BlogPost>;
    categories: Pick<BlogCategory, 'id' | 'name' | 'parent_id'>[];
    activeCategory?: { id: number; name: string; parent_id?: number | null } | null;
    statusCounts: Record<string, number>;
    filters: { search: string; category: number | null };
}

const statusLabel: Record<string, string> = { draft: 'پیش‌نویس', scheduled: 'زمان‌بندی شده', published: 'منتشر شده' };
const statusClass: Record<string, string> = {
    draft: 'bg-yellow-50 text-yellow-700',
    scheduled: 'bg-gray-100 text-gray-600',
    published: 'bg-green-50 text-green-700',
};

export default function BlogIndex({ posts, categories, activeCategory, statusCounts, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canCreate    = auth.user.permissions.includes('blog.create');
    const canEdit      = auth.user.permissions.includes('blog.edit');
    const canDelete    = auth.user.permissions.includes('blog.delete');
    const canInstagram = auth.user.permissions.includes('blog.instagram');

    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [copiedPostId, setCopiedPostId] = useState<number | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const statusOptions = Object.entries(statusCounts);
    const selectedCategoryIds = activeCategory ? [activeCategory.id] : [];

    const filteredPosts = useMemo(() => {
        return posts.data.filter(post =>
            selectedStatus === null || post.status === selectedStatus
        );
    }, [posts.data, selectedStatus]);

    const navigateFilters = (next: { category?: number | null; search?: string }) => {
        const category = next.category !== undefined ? next.category : (activeCategory?.id ?? null);
        const search = next.search !== undefined ? next.search : searchQuery;

        router.get(
            route('blog.index'),
            {
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            navigateFilters({ search: value });
        }, 350);
    };

    const handleCategoryChange = (ids: number[]) => {
        navigateFilters({ category: ids[0] ?? null });
    };

    const toggleCategoryChip = (categoryId: number) => {
        navigateFilters({
            category: activeCategory?.id === categoryId ? null : categoryId,
        });
    };

    const destroy = (post: BlogPost) => {
        if (confirm(`آیا از حذف مقاله "${post.title}" اطمینان دارید؟`)) {
            router.delete(route('blog.destroy', post.id));
        }
    };

    const copyBroadcastCaption = async (post: BlogPost) => {
        if (!post.caption_plain) return;

        const markdown = post.caption_plain;
        const field = markdownToTelegramField(markdown);
        let copied = false;

        try {
            if (typeof ClipboardItem !== 'undefined') {
                // text/plain stays markdown so Bale keeps formatting it.
                // The x-td-field formats are what Telegram Desktop pastes as real text links.
                const item = new ClipboardItem({
                    'text/plain': new Blob([markdown], { type: 'text/plain' }),
                    'web application/x-td-field-text': new Blob([field.text], { type: 'text/plain' }),
                    'web application/x-td-field-tags': new Blob([serializeTelegramTags(field.tags)], { type: 'application/octet-stream' }),
                });
                await navigator.clipboard.write([item]);
                copied = true;
            }
        } catch {
            copied = false;
        }

        if (!copied) {
            try {
                await navigator.clipboard.writeText(markdown);
            } catch {
                return;
            }
        }

        setCopiedPostId(post.id);
        if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
        copiedTimeout.current = setTimeout(() => setCopiedPostId(null), 2000);
    };

    const hasActiveFilters = Boolean(filters.search || activeCategory);
    const showEmptyUnfiltered = posts.data.length === 0 && !hasActiveFilters;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold leading-tight text-gray-800">اخبار وبلاگ</h2>
                    {canCreate && (
                        <Link
                            href={route('blog.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            + خبر جدید
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="اخبار وبلاگ" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 space-y-4">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
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

                            {categories.length > 0 && (
                                <CategoryMultiSelect
                                    categories={categories}
                                    selected={selectedCategoryIds}
                                    onChange={handleCategoryChange}
                                    single
                                    hideSelectedChips
                                    placeholder="همه دسته‌بندی‌ها"
                                    className="w-full sm:w-56 shrink-0"
                                />
                            )}
                        </div>

                        {statusOptions.length > 0 && (
                            <div className="flex flex-wrap items-center text-sm">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus(null)}
                                    className={`px-3 py-1 transition-colors ${selectedStatus === null ? 'font-semibold text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    همه
                                </button>
                                {statusOptions.map(([status, count]) => (
                                    <span key={status} className="flex items-center">
                                        <span className="text-gray-300 select-none">|</span>
                                        <button
                                            type="button"
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

                    {showEmptyUnfiltered ? (
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
                            {activeCategory && (
                                <button
                                    type="button"
                                    onClick={() => navigateFilters({ category: null })}
                                    className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    حذف فیلتر دسته‌بندی
                                </button>
                            )}
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
                                                            {post.categories.map(cat => {
                                                                const isActive = activeCategory?.id === cat.id;
                                                                return (
                                                                    <button
                                                                        key={cat.id}
                                                                        type="button"
                                                                        onClick={() => toggleCategoryChip(cat.id)}
                                                                        title={isActive ? 'حذف فیلتر این دسته' : 'فیلتر بر اساس این دسته'}
                                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                                                                            isActive
                                                                                ? 'bg-indigo-600 text-white ring-1 ring-indigo-600'
                                                                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                                                        }`}
                                                                    >
                                                                        {cat.name}
                                                                    </button>
                                                                );
                                                            })}
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
                                                    {post.status === 'scheduled' && post.publish_at && (
                                                        <p className="mt-1 text-xs text-gray-400">{toJalali(post.publish_at, true)}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {post.status === 'scheduled' && post.publish_at
                                                        ? <span title="زمان انتشار برنامه‌ریزی شده">{toJalali(post.publish_at)}</span>
                                                        : post.published_at ? toJalali(post.published_at) : toJalali(post.created_at)
                                                    }
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
                                                        {canInstagram && (
                                                            <>
                                                            <Link
                                                                href={route('blog.instagram', post.id)}
                                                                title="محتوای اینستاگرام"
                                                                className="rounded p-1.5 text-gray-400 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                                            >
                                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-.88a1.13 1.13 0 110 2.25 1.13 1.13 0 010-2.25z" />
                                                                </svg>
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                title={copiedPostId === post.id ? 'کپشن کپی شد' : 'کپی کپشن بله و تلگرام'}
                                                                aria-label={copiedPostId === post.id ? 'کپشن کپی شد' : 'کپی کپشن بله و تلگرام'}
                                                                onClick={() => copyBroadcastCaption(post)}
                                                                className={`rounded p-1.5 transition-colors ${copiedPostId === post.id ? 'bg-sky-50 text-sky-600' : 'text-gray-400 hover:bg-sky-50 hover:text-sky-600'}`}
                                                            >
                                                                {copiedPostId === post.id ? (
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            </>
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
