import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { User, PaginatedData } from '@/types/models';
import { useState, useEffect, useRef } from 'react';
import type { PageProps } from '@/types';

interface RoleOption { slug: string; name: string; }

interface Props {
    users: PaginatedData<User>;
    filters: { search?: string; city_id?: string };
    active_city?: string;

    roles: RoleOption[];
    can: { create: boolean };
}

const ROLE_COLOR_PALETTE = [
    'bg-red-100 text-red-700',
    'bg-indigo-100 text-indigo-700',
    'bg-sky-100 text-sky-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-orange-100 text-orange-700',
];

interface ResetResult { userName: string; password: string; }

export default function UsersIndex({ users, filters, active_city, roles, can }: Props) {
    const { auth } = usePage<PageProps>().props;

    const roleLabel = Object.fromEntries(roles.map(r => [r.slug, r.name]));
    const roleColor = Object.fromEntries(
        roles.map((r, i) => [r.slug, ROLE_COLOR_PALETTE[i % ROLE_COLOR_PALETTE.length]])
    );
    const canEdit   = auth.user.permissions.includes('users.edit');
    const canDelete = auth.user.permissions.includes('users.delete');

    const [resetResult, setResetResult] = useState<ResetResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) { isMounted.current = true; return; }
        const timer = setTimeout(() => {
            router.get(
                route('users.index'),
                { ...filters, search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const suspend = (user: User) => {
        const action = user.is_suspended ? 'reactivate' : 'suspend';
        if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user "${user.name}"?`)) {
            router.post(route('users.suspend', user.id));
        }
    };

    const resetPassword = (user: User) => {
        if (!confirm(`آیا از بازنشانی رمز عبور کاربر "${user.name}" اطمینان دارید؟`)) return;
        router.post(route('users.resetPassword', user.id), {}, {
            onSuccess: (page) => {
                const pw = (page.props.flash as { password?: string }).password ?? '';
                setResetResult({ userName: user.name, password: pw });
            },
        });
    };

    const copyResetResult = () => {
        if (!resetResult) return;
        navigator.clipboard.writeText(`نام کاربر: ${resetResult.userName}\nرمز عبور جدید: ${resetResult.password}`)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
    };

    const destroy = (user: User) => {
        if (confirm(`Permanently delete user "${user.name}"? This cannot be undone.`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">کاربران</h2>}>
            <Head title="کاربران" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

                    {active_city && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-500">فیلتر بر اساس شهر:</span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-indigo-600">
                                {active_city}
                                <button
                                    type="button"
                                    onClick={() => router.get(route('users.index'), { search: filters.search }, { preserveState: true })}
                                    className="ml-0.5 rounded-full hover:text-indigo-900"
                                    aria-label="Clear city filter"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        </div>
                    )}

                    <div className="flex lg:flex-row flex-col-reverse gap-2 items-center justify-between">
                        <div className="relative">
                            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="جستجوی کاربران..."
                                className="rounded-md border-gray-200 py-2 pr-9 pl-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {can.create && (
                            <Link
                                href={route('users.create')}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                + کاربر جدید
                            </Link>
                        )}
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['نام کاربر', 'شماره موبایل', 'کد ملی', 'نقش', 'شهر', 'وضعیت کاربر', 'عملیات'].map((h) => (
                                            <th key={h} className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className={`hover:bg-gray-50 ${user.is_suspended ? 'opacity-60' : ''}`}>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-800">{user.name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{user.mobile ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{user.melli_code ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span key={role.id} title={role.name} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleColor[role.name] ?? 'bg-gray-50 text-gray-800'}`}>
                                                            {roleLabel[role.name] ?? role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {user.city ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => router.get(route('users.index'), { ...filters, city_id: user.city_id }, { preserveState: true })}
                                                        className="text-indigo-600 hover:text-indigo-500 hover:underline"
                                                    >
                                                        {user.city.name}
                                                    </button>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${user.is_suspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {user.is_suspended ? 'معلق' : 'فعال'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    {canEdit && (
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            title="ویرایش"
                                                            className="rounded p-1 text-indigo-600 hover:bg-gray-50 hover:text-gray-700"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L18 8.625" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => suspend(user)}
                                                            title={user.is_suspended ? 'فعال‌سازی' : 'تعلیق'}
                                                            className={`rounded p-1 ${user.is_suspended ? 'text-green-600 hover:bg-green-50 hover:text-green-800' : 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-800'}`}
                                                        >
                                                            {user.is_suspended ? (
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => resetPassword(user)}
                                                            title="بازنشانی رمز عبور"
                                                            className="rounded p-1 text-orange-500 hover:bg-orange-50 hover:text-orange-700"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => destroy(user)}
                                                            title="حذف"
                                                            className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">کاربری یافت نشد.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-800">
                                نمایش <strong>{users.from ?? 0}</strong>–<strong>{users.to ?? 0}</strong> از <strong>{users.total}</strong>
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1 text-sm rounded border ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : link.url ? 'text-gray-800 border-gray-200 hover:bg-gray-50' : 'text-gray-500 border-gray-200 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {resetResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
                        <div className="px-6 py-5 space-y-3">
                            <h3 className="text-base font-semibold text-gray-800">رمز عبور بازنشانی شد</h3>
                            <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm text-gray-800">
                                <div className="flex justify-between gap-2">
                                    <span className="text-gray-500">نام کاربر</span>
                                    <span className="font-medium">{resetResult.userName}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-gray-500">رمز عبور جدید</span>
                                    <span className="font-mono font-semibold tracking-widest text-indigo-600">{resetResult.password}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-t border-gray-200">
                            <button
                                onClick={copyResetResult}
                                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium rounded-bl-xl transition-colors ${copied ? 'text-green-600 hover:bg-green-50' : 'text-gray-800 hover:bg-gray-50'}`}
                            >
                                {copied ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        کپی شد
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                        </svg>
                                        کپی
                                    </>
                                )}
                            </button>
                            <div className="w-px bg-gray-50" />
                            <button
                                onClick={() => { setResetResult(null); setCopied(false); }}
                                className="flex flex-1 items-center justify-center py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-br-xl"
                            >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
