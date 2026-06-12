import { toRelative } from '@/utils/date';
import { useEffect, useRef, useState } from 'react';

interface NotificationItem {
    id: string;
    data: { message?: string; rule_name?: string };
    created_at: string;
}

interface Props {
    unreadCount: number;
    notifications: NotificationItem[];
    onMarkOneRead: (id: string) => void;
    collapsed?: boolean;
    light?: boolean;
}

export type { NotificationItem };

export default function NotificationBell({ unreadCount, notifications, onMarkOneRead, collapsed = false, light = false }: Props) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [open]);

    function handleOpen() {
        setOpen(v => !v);
    }

    const buttonBase = light
        ? 'relative flex items-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors'
        : `relative flex items-center rounded-lg py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'}`;

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={handleOpen}
                title="اعلان‌ها"
                className={buttonBase}
            >
                <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {!light && !collapsed && <span>اعلان‌ها</span>}
                {unreadCount > 0 && (
                    <span className={`absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ${
                        light ? 'top-0.5 right-0.5' : (collapsed ? 'top-1.5 right-1.5' : 'top-1.5 left-1.5')
                    }`}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className={`absolute z-50 w-64 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white shadow-xl ${light ? 'top-full left-0 mt-2' : 'bottom-full left-0 mb-2'}`}>
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
                        <span className="text-sm font-semibold text-gray-800">اعلان‌ها</span>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                                <strong className="pl-1">{unreadCount}</strong>   اعلان جدید
                            </span>
                        )}
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb:hover]:bg-gray-300">
                        {notifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-gray-400">اعلانی وجود ندارد</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="group flex items-start gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {n.data.message ?? n.data.rule_name ?? '—'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">{toRelative(n.created_at)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onMarkOneRead(n.id)}
                                        title="علامت‌گذاری به عنوان خوانده‌شده"
                                        className="mt-0.5 shrink-0 rounded p-0.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-500"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
