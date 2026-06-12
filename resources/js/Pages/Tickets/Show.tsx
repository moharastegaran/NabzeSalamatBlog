import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Ticket, TicketStatus, TicketDepartment } from '@/types/models';
import { toJalali } from '@/utils/date';
import { FormEventHandler, useRef } from 'react';
import { PageProps } from '@/types';

const STATUS_LABELS: Record<TicketStatus, string> = {
    open:        'باز',
    in_progress: 'در حال بررسی',
    closed:      'بسته شده',
};
const STATUS_COLORS: Record<TicketStatus, string> = {
    open:        'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    closed:      'bg-gray-100 text-gray-500',
};
const DEPT_LABELS: Record<TicketDepartment, string> = {
    technical: 'فنی',
    financial: 'مالی',
    support:   'پشتیبانی',
};

interface Props {
    ticket: Ticket;
    staff: { id: number; name: string }[];
    flash?: { success?: string };
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function TicketShow({ ticket, staff, flash }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canRespond = auth.user.permissions.includes('tickets.respond');
    const canAssign  = auth.user.permissions.includes('tickets.assign');
    const canClose   = auth.user.permissions.includes('tickets.close');
    const fileRef = useRef<HTMLInputElement>(null);

    const replyForm = useForm<{ body: string; attachments: File[] }>({ body: '', attachments: [] });
    const statusForm = useForm({ status: ticket.status, assigned_to: ticket.assigned_to ?? '' });

    const submitReply: FormEventHandler = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('body', replyForm.data.body);
        replyForm.data.attachments.forEach((f) => fd.append('attachments[]', f));
        router.post(route('tickets.reply', ticket.id), fd, {
            onSuccess: () => {
                replyForm.reset();
                if (fileRef.current) fileRef.current.value = '';
            },
            preserveScroll: true,
        });
    };

    const submitStatus: FormEventHandler = (e) => {
        e.preventDefault();
        statusForm.patch(route('tickets.updateStatus', ticket.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <a onClick={() => router.get(route('tickets.index'))} className="text-gray-400 hover:text-indigo-600 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </a>
                <h2 className="text-xl font-bold text-gray-800 truncate">{ticket.title}</h2>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}>
                    {STATUS_LABELS[ticket.status]}
                </span>
            </div>
        }>
            <Head title={`تیکت #${ticket.id}`} />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">

                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-3 text-green-700 text-sm">{flash.success}</div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Thread */}
                        <div className="lg:col-span-2 space-y-4">
                            {(ticket.messages ?? []).map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`rounded-xl p-4 ${msg.is_staff ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-gray-200'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-semibold ${msg.is_staff ? 'text-indigo-700' : 'text-gray-600'}`}>
                                            {msg.is_staff ? '👤' : '🙋'} {msg.user?.name ?? '—'}
                                        </span>
                                        <span className="text-xs text-gray-400">{toJalali(msg.created_at)}</span>
                                    </div>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                                </div>
                            ))}

                            {/* Attachments */}
                            {(ticket.attachments ?? []).length > 0 && (
                                <div className="rounded-xl bg-white border border-gray-200 p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">پیوست‌ها</p>
                                    <div className="space-y-2">
                                        {ticket.attachments!.map((att) => (
                                            <a
                                                key={att.id}
                                                href={`/storage/${att.path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 text-sm text-indigo-600 hover:underline"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                <span className="truncate">{att.original_name}</span>
                                                <span className="text-gray-400 text-xs shrink-0">({formatBytes(att.size)})</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reply box */}
                            {canRespond && ticket.status !== 'closed' && (
                                <form onSubmit={submitReply} className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
                                    <p className="text-sm font-medium text-gray-700">پاسخ پشتیبانی</p>
                                    <textarea
                                        value={replyForm.data.body}
                                        onChange={(e) => replyForm.setData('body', e.target.value)}
                                        rows={4}
                                        placeholder="پاسخ خود را بنویسید..."
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                        required
                                    />
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-indigo-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            افزودن پیوست
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => replyForm.setData('attachments', Array.from(e.target.files ?? []))}
                                            />
                                        </label>
                                        {replyForm.data.attachments.length > 0 && (
                                            <span className="text-xs text-gray-400">{replyForm.data.attachments.length} فایل انتخاب شده</span>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={replyForm.processing}
                                            className="mr-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                                        >
                                            {replyForm.processing ? 'در حال ارسال...' : 'ارسال پاسخ'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Info */}
                            <div className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
                                <p className="text-sm font-semibold text-gray-700">جزئیات تیکت</p>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">ثبت‌کننده</dt>
                                        <dd className="font-medium text-gray-800">{ticket.user?.name ?? '—'}</dd>
                                    </div>
                                    {ticket.to_user && (
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">ارسال به</dt>
                                            <dd className="font-medium text-gray-800">{ticket.to_user.name}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">دپارتمان</dt>
                                        <dd className="font-medium text-gray-800">{DEPT_LABELS[ticket.department]}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">تاریخ ثبت</dt>
                                        <dd className="text-gray-600">{toJalali(ticket.created_at)}</dd>
                                    </div>
                                    {ticket.closed_at && (
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">تاریخ بستن</dt>
                                            <dd className="text-gray-600">{toJalali(ticket.closed_at)}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Status + assign */}
                            {(canAssign || canClose) && <form onSubmit={submitStatus} className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
                                <p className="text-sm font-semibold text-gray-700">مدیریت تیکت</p>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">وضعیت</label>
                                    <div className="relative">
                                        <select
                                            value={statusForm.data.status}
                                            onChange={(e) => statusForm.setData('status', e.target.value as TicketStatus)}
                                            className="w-full appearance-none rounded-md border border-gray-300 pr-3 pl-8 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                                            style={{ background: 'none' }}
                                        >
                                            <option value="open">باز</option>
                                            <option value="in_progress">در حال بررسی</option>
                                            <option value="closed">بسته شده</option>
                                        </select>
                                        <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">تخصیص به</label>
                                    <div className="relative">
                                        <select
                                            value={statusForm.data.assigned_to}
                                            onChange={(e) => statusForm.setData('assigned_to', e.target.value)}
                                            className="w-full appearance-none rounded-md border border-gray-300 pr-3 pl-8 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                                            style={{ background: 'none' }}
                                        >
                                            <option value="">— بدون تخصیص —</option>
                                            {staff.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={statusForm.processing}
                                    className="w-full rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                                >
                                    ذخیره تغییرات
                                </button>
                            </form>}

                            {/* Delete */}
                            {canClose && (
                                <button
                                    onClick={() => confirm('این تیکت و تمام پیام‌های آن حذف شود؟') && router.delete(route('tickets.destroy', ticket.id))}
                                    className="w-full rounded-md border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    حذف تیکت
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
