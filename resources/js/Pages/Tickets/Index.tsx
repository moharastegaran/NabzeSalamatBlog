import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Ticket, PaginatedData, TicketStatus, TicketDepartment } from '@/types/models';
import { PageProps } from '@/types';
import { toJalali } from '@/utils/date';

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
    technical:  'فنی، تکنیکال و IT',
    financial:  'مالی و اداری',
    support:    'پشتیبانی سفارش',
};

interface Props {
    tickets: PaginatedData<Ticket>;
    filters: { status?: string; department?: string };
}

export default function TicketsIndex({ tickets, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const canClose = auth.user.permissions.includes('tickets.close');

    const closeTicket = (id: number) => {
        router.patch(route('tickets.updateStatus', id), { status: 'closed' }, { preserveScroll: true });
    };

    const filter = (key: string, value: string | null) => {
        const params = { ...filters, [key]: value ?? undefined };
        router.get(route('tickets.index'), params, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">تیکت‌های پشتیبانی</h2>}>
            <Head title="تیکت‌ها" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 space-y-4">

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-sm text-gray-500">فیلتر:</span>

                        {(['', 'open', 'in_progress', 'closed'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => filter('status', s || null)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                    (filters.status ?? '') === s
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                                }`}
                            >
                                {s === '' ? 'همه' : STATUS_LABELS[s as TicketStatus]}
                            </button>
                        ))}

                        <span className="text-gray-300">|</span>

                        {(['', 'technical', 'financial', 'support'] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => filter('department', d || null)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                    (filters.department ?? '') === d
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                                }`}
                            >
                                {d === '' ? 'همه دپارتمان‌ها' : DEPT_LABELS[d as TicketDepartment]}
                            </button>
                        ))}

                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['#', 'عنوان', 'ثبت‌کننده', 'ارسال به', 'دپارتمان', 'وضعیت', 'پیام‌ها', 'تخصیص به', 'آخرین بروزرسانی', ''].map((h) => (
                                            <th key={h} className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500">#{ticket.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">
                                                <Link href={route('tickets.show', ticket.id)} className="hover:text-indigo-600">
                                                    {ticket.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{ticket.user?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{ticket.to_user?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{DEPT_LABELS[ticket.department]}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}>
                                                    {STATUS_LABELS[ticket.status]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 text-center">{ticket.messages_count ?? 0}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{ticket.assignee?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{toJalali(ticket.updated_at)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={route('tickets.show', ticket.id)}
                                                        className="inline-flex items-center justify-center rounded p-1.5 text-indigo-600 hover:bg-indigo-50"
                                                        title="مشاهده"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={route('tickets.show', ticket.id)}
                                                        className="inline-flex items-center justify-center rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                        title="ویرایش"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    {canClose && ticket.status !== 'closed' && (
                                                        <button
                                                            onClick={() => closeTicket(ticket.id)}
                                                            className="inline-flex items-center justify-center rounded p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                                                            title="بستن تیکت"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.data.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="px-4 py-8 text-center text-gray-400">هیچ تیکتی یافت نشد.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-600">
                                نمایش <strong>{tickets.from}</strong>–<strong>{tickets.to}</strong> از <strong>{tickets.total}</strong>
                            </p>
                            <div className="flex gap-1">
                                {tickets.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1 text-sm rounded border ${
                                            link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : link.url
                                                ? 'text-gray-700 border-gray-200 hover:bg-gray-50'
                                                : 'text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
