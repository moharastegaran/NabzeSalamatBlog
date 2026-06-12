import CustomerLayout from '@/Layouts/CustomerLayout';
import { formatPrice } from '@/utils/currency';
import { Head, Link } from '@inertiajs/react';
import { toJalali } from '@/utils/date';
import { Order, PaginatedData } from '@/types/models.d';


// ── Icons ──────────────────────────────────────────────────────────────────

function IconEye() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function IconPrint() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
    );
}

// ── Types ──────────────────────────────────────────────────────────────────

interface Stats {
    in_progress: number;
    shipped: number;
    cancelled: number;
}

interface Props {
    orders: PaginatedData<Order>;
    stats: Stats;
    tab: string;
}

const TABS: { key: keyof Stats; label: string }[] = [
    { key: 'in_progress', label: 'جاری' },
    { key: 'shipped',     label: 'تحویل شده' },
    { key: 'cancelled',   label: 'لغو شده' },
];

// ── Status helpers ─────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
    pending_rm_approval:  'در انتظار تایید مدیر',
    pending_cfo_approval: 'در انتظار تایید مالی',
    in_progress:          'در حال پردازش',
    awaiting_withdrawal:  'در انتظار تسویه',
    shipped:              'ارسال شده',
    cancelled:            'لغو شده',
};

function orderTotal(order: Order): number {
    const itemsTotal = (order.products ?? []).reduce(
        (sum, p) => sum + Number(p.unit_price) * Number(p.quantity),
        0,
    );
    return itemsTotal + Number(order.shipping_amount ?? 0) + Number(order.fee_amount ?? 0);
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Panel({ orders, stats, tab }: Props) {
    return (
        <CustomerLayout>
            <Head title="سفارش‌ها" />

            {/* Orders list */}
            <div className="bg-[#F2F2F2] rounded-3xl lg:p-6 p-2 overflow-hidden">

                <h3 className="text-lg font-bold text-right mb-5">سفارش‌ها</h3>

                {/* Tabs */}
                <div className="w-fit flex gap-0 mb-4 flex-wrap">
                    {TABS.map(t => {
                        const active = tab === t.key;
                        return (
                            <Link
                                key={t.key}
                                href={route('customer.panel', { tab: t.key })}
                                className={`flex items-center gap-2 px-5 py-2 text-base font-semibold transition-colors ${
                                    active
                                        ? 'text-[#B8181E] border-b-[3px] border-[#B8181E]'
                                        : 'text-[#404040] border-b border-[#404040] hover:bg-gray-100'
                                }`}
                            >
                                {t.label}
                                <span className={`inline-flex items-center justify-center min-w-[1.25rem] w-6 h-6 rounded-md text-sm font-bold text-white ${
                                    active ? 'bg-[#B8181E]' : 'bg-[#404040]'
                                }`}>
                                    {stats[t.key].toLocaleString('fa-IR')}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {orders.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-700 gap-3">
                        <svg className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm">هنوز سفارشی ثبت نشده است.</p>
                        <Link
                            href={route('shop.index')}
                            className="mt-1 rounded-lg bg-[#E31F25] px-4 py-2 text-sm font-medium text-white hover:bg-[#B8181E] transition-colors"
                        >
                            رفتن به فروشگاه
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="bg-white rounded-2xl p-4 hidden sm:block overflow-x-auto">
                            <table className="min-w-full border-separate [border-spacing:0_5px]">
                                <thead>
                                    <tr className="bg-[#D5D5D5]">
                                        {['شماره سفارش', 'تاریخ', 'وضعیت', 'مبلغ کل', 'عملیات'].map((h, i, arr) => (
                                            <th key={h} className={`px-5 py-4 text-right text-sm font-medium text-[#1F0001] uppercase tracking-wide ${i === 0 ? 'rounded-r-xl' : ''} ${i === arr.length - 1 ? 'rounded-l-xl' : ''}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map(order => (
                                        <tr key={order.id} className="bg-[#F2F2F2] hover:bg-[#EFEFEF] transition-colors">
                                            <td className="px-5 py-4 text-sm text-[#1F0001] font-medium rounded-r-xl">#{order.id}</td>
                                            <td className="px-5 py-4 text-sm text-[#1F0001] font-medium">{toJalali(order.created_at)}</td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-[#1F0001]">
                                                    {STATUS_LABEL[order.status] ?? order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-[#1F0001] font-medium">
                                                {formatPrice(orderTotal(order))}
                                            </td>
                                            <td className="px-5 py-4 rounded-l-xl">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('customer.orders.show', order.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-indigo-100 transition-colors"
                                                    >
                                                        <IconEye />
                                                        مشاهده
                                                    </Link>
                                                    <a
                                                        href={route('orders.pdf', order.id)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <IconPrint />
                                                        پرینت
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="sm:hidden divide-y divide-gray-100">
                            {orders.data.map(order => (
                                <div key={order.id} className="px-5 py-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm text-gray-700">#{order.id}</span>
                                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                            {STATUS_LABEL[order.status] ?? order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{toJalali(order.created_at)}</span>
                                        <span className="font-medium text-gray-800">{formatPrice(orderTotal(order))}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                                        >
                                            <IconEye />
                                            مشاهده
                                        </Link>
                                        <a
                                            href={route('orders.pdf', order.id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            <IconPrint />
                                            پرینت
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1 border-t border-gray-100 px-5 py-4">
                                {orders.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`min-w-[2rem] rounded-lg px-2 py-1 text-center text-sm transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-600 font-semibold text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="min-w-[2rem] rounded-lg px-2 py-1 text-center text-sm text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </CustomerLayout>
    );
}
