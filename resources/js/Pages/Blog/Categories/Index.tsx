import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BlogCategory } from '@/types/models';
import type { PageProps } from '@/types';

interface Props {
    categories: BlogCategory[];
    flash?: { success?: string };
}

function ThumbCell({ path, alt }: { path?: string | null; alt: string }) {
    if (!path) return <span className="text-gray-300">—</span>;
    return (
        <img
            src={`/storage/${path}`}
            alt={alt}
            className="h-8 w-8 rounded object-cover ring-1 ring-gray-200"
        />
    );
}

export default function BlogCategoriesIndex({ categories, flash }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canCreate = auth.user.permissions.includes('blog_categories.create');
    const canEdit   = auth.user.permissions.includes('blog_categories.edit');
    const canDelete = auth.user.permissions.includes('blog_categories.delete');

    const destroy = (cat: BlogCategory) => {
        if (confirm(`آیا از حذف دسته‌بندی "${cat.name}" اطمینان دارید؟`)) {
            router.delete(route('blog.categories.destroy', cat.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">دسته‌بندی‌های وبلاگ</h2>}>
            <Head title="دسته‌بندی‌های وبلاگ" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-4">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-green-700">{flash.success}</div>
                    )}

                    {canCreate && (
                        <div className="flex justify-end">
                            <Link
                                href={route('blog.categories.create')}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                + دسته‌بندی جدید
                            </Link>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['نام', 'والد', 'آیکون', 'تصویر', 'توضیحات', 'زیر‌دسته‌ها', 'مقالات', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{cat.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {cat.parent ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                    {cat.parent.name}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <ThumbCell path={cat.icon} alt="آیکون" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <ThumbCell path={cat.thumbnail} alt="تصویر" />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate" title={cat.description ?? ''}>
                                            {cat.description ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                                            {cat.children_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center">
                                            {(cat.posts_count ?? 0) > 0 ? (
                                                <Link
                                                    href={route('blog.index', { category: cat.id })}
                                                    className="font-medium text-indigo-600 hover:underline"
                                                >
                                                    {cat.posts_count}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">0</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {canEdit && (
                                                    <Link
                                                        href={route('blog.categories.edit', cat.id)}
                                                        className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                        title="ویرایش"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => destroy(cat)}
                                                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        title="حذف"
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
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">دسته‌بندی‌ای وجود ندارد.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
