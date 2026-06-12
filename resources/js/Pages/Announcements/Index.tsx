import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toJalali } from '@/utils/date';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface Announcement {
    id: number;
    message: string;
    sent_by: string;
    created_at: string;
    recalled_at: string | null;
    read_count: number;
}

interface User {
    id: number;
    name: string;
}

interface Props {
    announcements: Announcement[];
    users: User[];
    flash?: { success?: string };
}

function IconMegaphone() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
    );
}

function IconUndo() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function UserMultiSelect({
    users,
    selected,
    onChange,
    error,
}: {
    users: User[];
    selected: number[];
    onChange: (ids: number[]) => void;
    error?: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = users.filter((u) => u.name.includes(search));
    const selectedUsers = users.filter((u) => selected.includes(u.id));

    const toggle = (id: number) => {
        onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    };

    return (
        <div ref={containerRef} className="relative mt-2">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    error
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}
            >
                <span>
                    {selected.length === 0
                        ? 'ارسال به همه کاربران (اختیاری: محدود کنید)'
                        : `${selected.length} کاربر انتخاب شده`}
                </span>
                <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {selectedUsers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedUsers.map((u) => (
                        <span
                            key={u.id}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200"
                        >
                            {u.name}
                            <button
                                type="button"
                                onClick={() => toggle(u.id)}
                                className="ml-0.5 rounded-full text-indigo-400 hover:text-indigo-700"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {open && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی کاربر..."
                            className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400">کاربری یافت نشد.</li>
                        ) : (
                            filtered.map((u) => (
                                <li
                                    key={u.id}
                                    onClick={() => toggle(u.id)}
                                    className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50"
                                >
                                    <input
                                        type="checkbox"
                                        readOnly
                                        checked={selected.includes(u.id)}
                                        className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                                    />
                                    {u.name}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function AnnouncementRow({ item }: { item: Announcement }) {
    const recalled = item.recalled_at !== null;

    const recall = () => {
        if (!confirm('آیا مطمئن هستید؟ اطلاعیه از صندوق کاربران حذف می‌شود.')) return;
        router.patch(route('announcements.recall', item.id), {}, { preserveScroll: true });
    };

    return (
        <div className={`flex items-start gap-4 px-5 py-4 transition-colors ${recalled ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="min-w-0 flex-1">
                <p className={`text-sm leading-relaxed ${recalled ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {item.message}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span>{toJalali(item.created_at)}</span>
                    <span className="flex items-center gap-1">
                        <IconEye />
                        {item.read_count} خوانده‌شده
                    </span>
                    {recalled && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            بازگردانده‌شده
                        </span>
                    )}
                </div>
            </div>

            {!recalled && (
                <button
                    type="button"
                    onClick={recall}
                    title="بازگرداندن اطلاعیه"
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                    <IconUndo />
                    بازگرداندن
                </button>
            )}
        </div>
    );
}

export default function AnnouncementsIndex({ announcements, users, flash }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        user_ids: [] as number[],
        is_urgent: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('announcements.store'), { preserveScroll: true, onSuccess: () => reset() });
    };

    const active = announcements.filter((a) => a.recalled_at === null);
    const recalled = announcements.filter((a) => a.recalled_at !== null);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">اطلاعیه‌ها</h2>}>
            <Head title="اطلاعیه‌ها" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

                    {flash?.success && (
                        <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                            {flash.success}
                        </div>
                    )}

                    {/* Compose form */}
                    <form onSubmit={submit} className="mb-6">
                        <textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="متن اطلاعیه را اینجا بنویسید..."
                            rows={3}
                            maxLength={1000}
                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}

                        <UserMultiSelect
                            users={users}
                            selected={data.user_ids}
                            onChange={(ids) => setData('user_ids', ids)}
                            error={errors.user_ids as string | undefined}
                        />

                        <div className="mt-3 flex flex-wrap items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2 select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_urgent}
                                    onChange={(e) => setData('is_urgent', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 accent-red-600"
                                />
                                <span className="text-sm font-medium text-red-600">فوری</span>
                                <p className="text-xs text-gray-500 font-normal">انتخاب این گزینه به منظور الزام کاربران به مشاهده اعلان ا یجاد شده می‌باشد</p>
                            </label>
                            <button
                                type="submit"
                                disabled={processing || !data.message.trim()}
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <IconMegaphone />
                                ارسال اطلاعیه
                            </button>
                        </div>
                    </form>

                    {/* Active announcements */}
                    {active.length > 0 ? (
                        <div className="mb-6 overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-200">
                            <div className="divide-y divide-gray-100">
                                {active.map((a) => (
                                    <AnnouncementRow key={a.id} item={a} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        announcements.length === 0 && (
                            <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
                                <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                <p className="text-sm text-gray-500">هنوز اطلاعیه‌ای ارسال نشده است.</p>
                            </div>
                        )
                    )}

                    {/* Recalled announcements */}
                    {recalled.length > 0 && (
                        <div>
                            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                بازگردانده‌شده ({recalled.length})
                            </p>
                            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-200">
                                <div className="divide-y divide-gray-100">
                                    {recalled.map((a) => (
                                        <AnnouncementRow key={a.id} item={a} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
