import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { ContactMessage, PaginatedData } from '@/types/models';
import { toJalali } from '@/utils/date';
import { useState, useRef, useEffect } from 'react';

interface Props {
    messages: PaginatedData<ContactMessage>;
    unreadCount: number;
    filters: { filter: string; search: string };
}

function ExpandedMessage({ msg, onClose }: { msg: ContactMessage; onClose: () => void }) {
    const markRead = () => {
        router.patch(route('contact-messages.markRead', msg.id), {}, { preserveScroll: true });
    };

    const destroy = () => {
        if (confirm('پیام حذف شود؟')) {
            router.delete(route('contact-messages.destroy', msg.id), { preserveScroll: true });
            onClose();
        }
    };

    return (
        <tr>
            <td colSpan={6} className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                <div className="max-w-3xl space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">موضوع</p>
                            <p className="font-bold text-gray-900">{msg.subject}</p>
                        </div>
                        <button onClick={onClose} className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">متن پیام</p>
                        <p className="whitespace-pre-wrap text-sm text-gray-700 leading-7 bg-white border border-gray-200 rounded-lg p-4">
                            {msg.message}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">شماره موبایل</span>
                            <a href={`tel:${msg.phone_number}`} className="font-mono font-semibold text-gray-800 hover:text-[#F24F00]">
                                {msg.phone_number}
                            </a>
                        </div>
                        {msg.email && (
                            <div>
                                <span className="text-xs text-gray-400 block mb-0.5">ایمیل</span>
                                <a href={`mailto:${msg.email}`} className="font-mono text-gray-700 hover:text-[#F24F00]">
                                    {msg.email}
                                </a>
                            </div>
                        )}
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">تاریخ ارسال</span>
                            <span className="text-gray-700">{toJalali(msg.created_at)}</span>
                        </div>
                        {msg.attachment_path && (
                            <div>
                                <span className="text-xs text-gray-400 block mb-0.5">پیوست</span>
                                <a
                                    href={route('contact-messages.download', msg.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex  items-center gap-1.5 text-sm text-indigo-600 hover:underline"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    دانلود پیوست
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        {!msg.read_at && (
                            <button
                                onClick={markRead}
                                className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                علامت خوانده‌شده
                            </button>
                        )}
                        <button
                            onClick={destroy}
                            className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            حذف پیام
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default function ContactMessagesIndex({ messages, unreadCount, filters }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [search, setSearch]         = useState(filters.search);
    const searchTimer = useRef<ReturnType<typeof setTimeout>>();

    function handleSearch(value: string) {
        setSearch(value);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            router.get(route('contact-messages.index'), { filter: filters.filter, search: value }, { preserveState: true, replace: true });
        }, 350);
    }

    function setFilter(f: string) {
        router.get(route('contact-messages.index'), { filter: f, search }, { preserveState: true, replace: true });
    }

    function toggleExpand(id: number, unread: boolean) {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            if (unread) {
                router.patch(route('contact-messages.markRead', id), {}, { preserveScroll: true });
            }
        }
    }

    useEffect(() => {
        setExpandedId(null);
    }, [messages.current_page]);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold leading-tight text-gray-800">پیام‌های تماس</h2>
                {unreadCount > 0 && (
                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">
                        {unreadCount} خوانده‌نشده
                    </span>
                )}
            </div>
        }>
            <Head title="پیام‌های تماس" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-4">

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filter pills */}
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            {(['all', 'unread'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                                        filters.filter === f
                                            ? 'bg-rose-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {f === 'all' ? 'همه' : `خوانده‌نشده (${unreadCount})`}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 min-w-[180px]">
                            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="search"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="جستجو در موضوع، شماره، ایمیل..."
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['موضوع', 'شماره موبایل', 'ایمیل', 'تاریخ', 'وضعیت', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {messages.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                                                {filters.search || filters.filter === 'unread' ? 'پیامی یافت نشد.' : 'هنوز هیچ پیامی دریافت نشده است.'}
                                            </td>
                                        </tr>
                                    )}
                                    {messages.data.map(msg => (
                                        <>
                                            <tr
                                                key={msg.id}
                                                onClick={() => toggleExpand(msg.id, !msg.read_at)}
                                                className={`cursor-pointer transition-colors ${
                                                    expandedId === msg.id
                                                        ? 'bg-rose-50'
                                                        : !msg.read_at
                                                            ? 'bg-yellow-50/60 hover:bg-yellow-50'
                                                            : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {!msg.read_at && (
                                                            <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" title="خوانده‌نشده" />
                                                        )}
                                                        <span className={`text-sm ${!msg.read_at ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                            {msg.subject}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 pr-4">{msg.message}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-mono text-gray-600">{msg.phone_number}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{msg.email ?? '—'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{toJalali(msg.created_at)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        msg.read_at
                                                            ? 'bg-gray-100 text-gray-500'
                                                            : 'bg-yellow-50 text-yellow-700'
                                                    }`}>
                                                        {msg.read_at ? 'خوانده‌شده' : 'خوانده‌نشده'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {msg.attachment_path && (
                                                            <a
                                                                href={route('contact-messages.download', msg.id)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={e => e.stopPropagation()}
                                                                title="دانلود پیوست"
                                                                className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={e => { e.stopPropagation(); if (confirm('پیام حذف شود؟')) router.delete(route('contact-messages.destroy', msg.id), { preserveScroll: true }); }}
                                                            title="حذف"
                                                            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                        <span className={`ml-1 transition-transform duration-200 ${expandedId === msg.id ? 'rotate-180' : ''}`}>
                                                            <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === msg.id && (
                                                <ExpandedMessage
                                                    key={`exp-${msg.id}`}
                                                    msg={msg}
                                                    onClose={() => setExpandedId(null)}
                                                />
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {messages.last_page > 1 && (
                        <div className="flex justify-center gap-1">
                            {messages.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded px-3 py-1.5 text-sm ${link.active ? 'bg-rose-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    />
                                ) : (
                                    <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="rounded px-3 py-1.5 text-sm text-gray-300" />
                                )
                            ))}
                        </div>
                    )}

                    {/* Summary */}
                    {messages.total > 0 && (
                        <p className="text-center text-xs text-gray-400">
                            نمایش {messages.from}–{messages.to} از {messages.total} پیام
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
