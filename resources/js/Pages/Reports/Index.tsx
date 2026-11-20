import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { hasAnyRole } from '@/utils/roles';

interface ColumnDef {
    key: string;
    label: string;
}

const USERS_COLUMNS: ColumnDef[] = [
    { key: 'id', label: 'شناسه' },
    { key: 'name', label: 'نام' },
    { key: 'email', label: 'ایمیل' },
    { key: 'mobile', label: 'موبایل' },
    { key: 'melli_code', label: 'کد ملی' },
    { key: 'user_role', label: 'نقش کاربری' },
    { key: 'is_suspended', label: 'وضعیت' },
    { key: 'province_name', label: 'استان' },
    { key: 'city_name', label: 'شهر' },
    { key: 'created_at', label: 'تاریخ ثبت در سایت' },
];

function IconDownload() {
    return (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );
}

function IconPdf() {
    return (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h1.5a1 1 0 010 2H10v-2zm0 0V10m4 2v4m0-4h1a1 1 0 010 2h-1" />
        </svg>
    );
}

function IconUsers() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function ExportCard({
    title,
    description,
    icon,
    accentColor,
    baseHref,
    basePdfHref,
    columns,
}: {
    title: string;
    description: string;
    icon: ReactNode;
    accentColor: string;
    baseHref: string;
    basePdfHref: string;
    columns: ColumnDef[];
}) {
    const [selected, setSelected] = useState<Set<string>>(() => new Set(columns.map((c) => c.key)));

    const allChecked = selected.size === columns.length;
    const noneChecked = selected.size === 0;

    const toggleColumn = (key: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const toggleAll = () => {
        setSelected(allChecked ? new Set() : new Set(columns.map((c) => c.key)));
    };

    const queryString = Array.from(selected).map((k) => `columns[]=${k}`).join('&');
    const downloadHref = noneChecked ? undefined : `${baseHref}?${queryString}`;
    const pdfHref = noneChecked ? undefined : `${basePdfHref}?${queryString}`;

    return (
        <div className="flex flex-1 flex-col gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentColor}`}>{icon}</div>
                <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            </div>

            <p className="text-sm leading-relaxed text-gray-500">{description}</p>

            {/* Column selector */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 grow">
                {/* Select all */}
                <label className="mb-3 flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => {
                            if (el) el.indeterminate = !allChecked && !noneChecked;
                        }}
                        onChange={toggleAll}
                        className="h-4 w-4 rounded border-gray-200 text-indigo-600 focus:ring-indigo-500"
                    />
                    انتخاب همه ستون‌ها
                </label>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {columns.map((col) => (
                        <label key={col.key} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                            <input
                                type="checkbox"
                                checked={selected.has(col.key)}
                                onChange={() => toggleColumn(col.key)}
                                className="h-4 w-4 rounded border-gray-200 text-indigo-600 focus:ring-indigo-500"
                            />
                            {col.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Download buttons */}
            <div className="flex gap-2">
                {noneChecked ? (
                    <>
                        <button
                            disabled
                            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500"
                        >
                            <IconDownload />
                            خروجی اکسل
                        </button>
                        <button
                            disabled
                            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500"
                        >
                            <IconPdf />
                            خروجی PDF
                        </button>
                    </>
                ) : (
                    <>
                        <a
                            href={downloadHref}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                            <IconDownload />
                            خروجی اکسل
                        </a>
                        <a
                            href={pdfHref}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-700"
                        >
                            <IconPdf />
                            خروجی PDF
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ReportsIndex() {
    const { auth } = usePage<PageProps>().props;
    const isAuthorized = hasAnyRole(auth.user.roles, 'admin', 'cfo');

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">گزارش‌ساز</h2>}>
            <Head title="گزارش‌ساز" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {!isAuthorized ? (
                        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-red-200 bg-red-50 px-6 py-24 text-center">
                            <svg
                                className="h-12 w-12 text-red-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                />
                            </svg>
                            <p className="text-lg font-semibold text-red-400">دسترسی محدود</p>
                            <p className="text-sm text-red-400">این بخش فقط برای مدیر کل و مدیر مالی در دسترس است.</p>
                        </div>
                    ) : (
                        <div className="max-w-md">
                            <ExportCard
                                title="کاربران"
                                description="خروجی از لیست کاربران ثبت‌شده در سیستم"
                                icon={<IconUsers />}
                                accentColor="bg-violet-50 text-violet-600"
                                baseHref={route('reports.export.users')}
                                basePdfHref={route('reports.export.users.pdf')}
                                columns={USERS_COLUMNS}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
