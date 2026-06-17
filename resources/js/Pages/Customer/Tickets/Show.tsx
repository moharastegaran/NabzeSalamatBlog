import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Ticket, TicketStatus, TicketDepartment } from '@/types/models';
import { toJalali } from '@/utils/date';
import { FormEventHandler, useRef } from 'react';
import InputError from '@/Components/InputError';

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
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function CustomerTicketShow({ ticket }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const { data, setData, processing, errors, reset } = useForm<{ body: string; attachments: File[] }>({
        body:        '',
        attachments: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('body', data.body);
        data.attachments.forEach((f) => fd.append('attachments[]', f));
        router.post(route('customer.tickets.reply', ticket.id), fd, {
            onSuccess: () => {
                reset();
                if (fileRef.current) fileRef.current.value = '';
            },
            preserveScroll: true,
        });
    };

    return (
        <CustomerLayout>
            <Head title={`تیکت #${ticket.id}`} />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <a href={route('customer.tickets.index')} className="mt-1 text-gray-400 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </a>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-gray-800 truncate">{ticket.title}</h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{DEPT_LABELS[ticket.department]}</span>
                            <span>•</span>
                            <span>ثبت: {toJalali(ticket.created_at)}</span>
                        </div>
                    </div>
                    <span className={`shrink-0 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}>
                        {STATUS_LABELS[ticket.status]}
                    </span>
                </div>



                {/* Messages */}
                <div className="space-y-3">
                    {(ticket.messages ?? []).map((msg) => (
                        <div
                            key={msg.id}
                            className={`rounded-xl p-4 ${msg.is_staff ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-gray-200'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-semibold ${msg.is_staff ? 'text-indigo-700' : 'text-gray-600'}`}>
                                    {msg.is_staff ? '👤 پشتیبانی' : '🙋 شما'}
                                </span>
                                <span className="text-xs text-gray-400">{toJalali(msg.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                        </div>
                    ))}
                </div>

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
                                    className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
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

                {/* Reply form */}
                {ticket.status !== 'closed' ? (
                    <form onSubmit={submit} className="rounded-xl bg-white border border-gray-200 p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-700">ارسال پیام</p>
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                            placeholder="پیام خود را بنویسید..."
                            required
                        />
                        <InputError message={errors.body} />

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
                                    onChange={(e) => setData('attachments', Array.from(e.target.files ?? []))}
                                />
                            </label>
                            {data.attachments.length > 0 && (
                                <span className="text-xs text-gray-400">{data.attachments.length} فایل</span>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mr-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'در حال ارسال...' : 'ارسال پیام'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-400">
                        این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
