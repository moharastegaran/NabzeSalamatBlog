import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Ticket, PaginatedData, TicketStatus, TicketDepartment } from '@/types/models';
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
    technical: 'فنی',
    financial: 'مالی',
    support:   'پشتیبانی',
};

interface Props {
    tickets: PaginatedData<Ticket>;
    filters: { status?: string };
}

export default function CustomerTicketsIndex({ tickets, filters }: Props) {
    const filter = (status: string | null) => {
        router.get(route('customer.tickets.index'), status ? { status } : {}, { preserveState: true });
    };

    return (
        <CustomerLayout>
            <Head title="تیکت‌های پشتیبانی" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">تیکت‌های پشتیبانی</h1>
                    <Link
                        href={route('customer.tickets.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        + تیکت جدید
                    </Link>
                </div>

                {/* Status filter tabs */}
                <div className="flex gap-2">
                    {[null, 'open', 'in_progress', 'closed'].map((s) => (
                        <button
                            key={s ?? 'all'}
                            onClick={() => filter(s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                (filters.status ?? null) === s
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                            }`}
                        >
                            {s === null ? 'همه' : STATUS_LABELS[s as TicketStatus]}
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['#', 'عنوان', 'دپارتمان', 'وضعیت', 'پیام‌ها', 'آخرین بروزرسانی', ''].map((h) => (
                                        <th key={h} className="px-4 py-3 text-right text-sm font-medium text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {tickets.data.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-400">#{ticket.id}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                            <Link href={route('customer.tickets.show', ticket.id)} className="hover:text-indigo-600">
                                                {ticket.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{DEPT_LABELS[ticket.department]}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}>
                                                {STATUS_LABELS[ticket.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 text-center">{ticket.messages_count ?? 0}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{toJalali(ticket.updated_at)}</td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route('customer.tickets.show', ticket.id)}
                                                className="text-indigo-600 hover:underline text-sm"
                                            >
                                                مشاهده
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {tickets.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                                            هنوز تیکتی ثبت نشده است.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {tickets.last_page > 1 && (
                        <div className="flex justify-end gap-1 border-t border-gray-200 px-4 py-3">
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
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
