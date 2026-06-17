import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BlogCategory } from '@/types/models';
import type { PageProps } from '@/types';

interface FlatRow { cat: BlogCategory; depth: number; }

function buildFlatList(cats: BlogCategory[]): FlatRow[] {
    const childrenOf = new Map<number | null, BlogCategory[]>();
    for (const cat of cats) {
        const bucket = childrenOf.get(cat.parent_id ?? null) ?? [];
        bucket.push(cat);
        childrenOf.set(cat.parent_id ?? null, bucket);
    }
    const result: FlatRow[] = [];
    function walk(parentId: number | null, depth: number) {
        const children = (childrenOf.get(parentId) ?? []).sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        for (const cat of children) {
            result.push({ cat, depth });
            walk(cat.id, depth + 1);
        }
    }
    walk(null, 0);
    return result;
}

interface Props {
    categories: BlogCategory[];
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

export default function BlogCategoriesIndex({ categories }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canCreate = auth.user.permissions.includes('blog_categories.create');
    const canEdit   = auth.user.permissions.includes('blog_categories.edit');
    const canDelete = auth.user.permissions.includes('blog_categories.delete');

    const flatRows = useMemo(() => buildFlatList(categories), [categories]);

    const [selected, setSelected] = useState<Set<number>>(new Set());
    const allIds = flatRows.map(r => r.cat.id);
    const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));
    const someSelected = selected.size > 0;

    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allIds));
    const toggleOne = (id: number) => setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const destroy = (cat: BlogCategory) => {
        if (confirm(`آیا از حذف دسته‌بندی "${cat.name}" اطمینان دارید؟`)) {
            router.delete(route('blog.categories.destroy', cat.id), { preserveScroll: true });
        }
    };

    const destroySelected = () => {
        if (!confirm(`آیا از حذف ${selected.size} دسته‌بندی انتخاب‌شده اطمینان دارید؟`)) return;
        setDropdownOpen(false);
        router.delete(route('blog.categories.bulkDestroy'), {
            data: { ids: [...selected] },
            preserveScroll: true,
            onSuccess: () => setSelected(new Set()),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">دسته‌بندی‌های وبلاگ</h2>}>
            <Head title="دسته‌بندی‌های وبلاگ" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-4">


                    <div className="flex items-center justify-end gap-2">
                        {canDelete && (
                            <div ref={dropdownRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(v => !v)}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    عملیات
                                    <svg className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute left-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                        <button
                                            type="button"
                                            onClick={destroySelected}
                                            disabled={!someSelected}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            حذف انتخاب‌شده‌ها
                                            {someSelected && <span className="mr-auto text-xs font-medium text-red-400">({selected.size})</span>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {canCreate && (
                            <Link
                                href={route('blog.categories.create')}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                + دسته‌بندی جدید
                            </Link>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                                        />
                                    </th>
                                    {['نام', 'آیکون', 'توضیحات', 'مقالات', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {flatRows.map(({ cat, depth }) => (
                                    <tr key={cat.id} className={`hover:bg-gray-50 ${selected.has(cat.id) ? 'bg-indigo-50' : ''}`}>
                                        <td className="px-4 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(cat.id)}
                                                onChange={() => toggleOne(cat.id)}
                                                className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div
                                                className="flex items-center gap-1.5"
                                                style={{ paddingRight: `${depth * 1.5}rem` }}
                                            >
                                                {depth > 0 && (
                                                    <span className="flex-none select-none text-gray-300">└─</span>
                                                )}
                                                <span className={depth === 0 ? 'font-medium text-gray-800' : 'text-gray-600'}>
                                                    {cat.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <ThumbCell path={cat.icon} alt="آیکون" />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate" title={cat.description ?? ''}>
                                            {cat.description ?? '—'}
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
                                                <a
                                                    href={route('front.blog.category', cat.slug)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                                                    title="مشاهده در سایت"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
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
                                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">دسته‌بندی‌ای وجود ندارد.</td>
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
