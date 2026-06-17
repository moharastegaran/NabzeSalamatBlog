import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { BlogComment, PaginatedData } from '@/types/models';
import { toJalali } from '@/utils/date';
import type { PageProps } from '@/types';

interface Props {
    comments: PaginatedData<BlogComment>;
}

export default function BlogComments({ comments }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canApprove = auth.user.permissions.includes('comments.approve');
    const canDiscard = auth.user.permissions.includes('comments.discard');

    const approve = (comment: BlogComment) => {
        router.patch(route('blog.comments.approve', comment.id), {}, { preserveScroll: true });
    };

    const destroy = (comment: BlogComment) => {
        if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
            router.delete(route('blog.comments.destroy', comment.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">مدیریت نظرات</h2>}>
            <Head title="مدیریت نظرات" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-4">

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['نام', 'ایمیل', 'متن نظر', 'مقاله', 'تاریخ', 'وضعیت', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {comments.data.map(comment => (
                                        <tr key={comment.id} className={`hover:bg-gray-50 ${!comment.is_approved ? 'bg-yellow-50/40' : ''}`}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{comment.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{comment.email}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                                                <p className="line-clamp-2">{comment.body}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {comment.post ? (
                                                    <a
                                                        href={route('shop.blog.show', comment.post.slug)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        {comment.post.title}
                                                    </a>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{toJalali(comment.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    comment.is_approved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                                }`}>
                                                    {comment.is_approved ? 'تأیید شده' : 'در انتظار'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canApprove && !comment.is_approved && (
                                                        <button
                                                            onClick={() => approve(comment)}
                                                            title="تأیید"
                                                            className="rounded p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {canDiscard && (
                                                        <button
                                                            onClick={() => destroy(comment)}
                                                            title="حذف"
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
                                    {comments.data.length === 0 && (
                                        <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">نظری ثبت نشده است.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {comments.last_page > 1 && (
                        <div className="flex justify-center gap-1">
                            {comments.links.map((link, i) => (
                                link.url ? (
                                    <a
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
