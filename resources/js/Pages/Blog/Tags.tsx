import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { BlogTag } from '@/types/models';
import { useState } from 'react';
import type { PageProps } from '@/types';

interface Props {
    tags: (BlogTag & { posts_count: number })[];
}

export default function BlogTags({ tags }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canCreate = auth.user.permissions.includes('tags.create');
    const canDelete = auth.user.permissions.includes('tags.delete');

    const [name, setName] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const store = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('blog.tags.store'), { name }, {
            onError: setErrors,
            onSuccess: () => { setName(''); setErrors({}); },
            preserveScroll: true,
        });
    };

    const update = (tag: BlogTag) => {
        router.put(route('blog.tags.update', tag.id), { name: editName }, {
            onSuccess: () => setEditId(null),
            preserveScroll: true,
        });
    };

    const destroy = (tag: BlogTag) => {
        if (confirm(`آیا از حذف برچسب "${tag.name}" اطمینان دارید؟`)) {
            router.delete(route('blog.tags.destroy', tag.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">برچسب‌های وبلاگ</h2>}>
            <Head title="برچسب‌های وبلاگ" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">

                    {/* Add form */}
                    {canCreate && <form onSubmit={store} className="bg-white rounded-xl shadow-sm p-6 flex gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="نام برچسب جدید..."
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <button type="submit" className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                            افزودن
                        </button>
                    </form>}

                    {/* Tag cloud + list */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {tags.length === 0 ? (
                            <p className="px-6 py-8 text-center text-sm text-gray-400">هیچ برچسبی ثبت نشده است.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['نام', 'اسلاگ', 'مقالات', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {tags.map(tag => (
                                        <tr key={tag.id} className="hover:bg-gray-50">
                                            {editId === tag.id ? (
                                                <>
                                                    <td className="px-4 py-3" colSpan={2}>
                                                        <input
                                                            type="text"
                                                            value={editName}
                                                            onChange={e => setEditName(e.target.value)}
                                                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{tag.posts_count}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => update(tag)} className="text-sm text-indigo-600 hover:underline">ذخیره</button>
                                                            <button onClick={() => setEditId(null)} className="text-sm text-gray-500 hover:underline">انصراف</button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                                            #{tag.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{tag.slug}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{tag.posts_count}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {canCreate && (
                                                                <button
                                                                    onClick={() => { setEditId(tag.id); setEditName(tag.name); }}
                                                                    className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => destroy(tag)}
                                                                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
