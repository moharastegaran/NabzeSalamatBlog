import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toJalali } from '@/utils/date';
import type { AdBanner } from '@/types/models';

interface Props {
    banners: AdBanner[];
    locations: Record<string, string>;
}

function StatusBadge({ active }: { active: boolean }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            active
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
        }`}>
            {active ? 'فعال' : 'غیرفعال'}
        </span>
    );
}

export default function AdBannersIndex({ banners, locations }: Props) {

    const handleToggle = (banner: AdBanner) => {
        router.patch(route('ad-banners.toggle', banner.id), {}, { preserveScroll: true });
    };

    const handleDelete = (banner: AdBanner) => {
        if (!confirm(`آیا از حذف بنر «${banner.title}» اطمینان دارید؟`)) return;
        router.delete(route('ad-banners.destroy', banner.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">بنرهای تبلیغاتی</h2>}>
            <Head title="بنرهای تبلیغاتی" />

            <div className="px-4 py-5 lg:px-0 lg:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Header row */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            {banners.length > 0 ? `${banners.length} بنر ثبت‌شده` : 'هیچ بنری ثبت نشده است.'}
                        </span>
                        <Link
                            href={route('ad-banners.create')}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            افزودن بنر
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                        {banners.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                                <svg className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-400">بنری ثبت نشده است.</p>
                                <Link href={route('ad-banners.create')} className="text-sm font-medium text-indigo-600 hover:underline">
                                    اولین بنر را بسازید
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['تصویر', 'عنوان', 'مکان‌ها', 'وضعیت', 'از', 'تا', 'ترتیب', 'عملیات'].map(h => (
                                                <th key={h} className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-gray-500">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {banners.map(banner => (
                                            <tr key={banner.id} className="hover:bg-gray-50/60 transition-colors">
                                                {/* Image */}
                                                <td className="px-4 py-3">
                                                    {banner.image ? (
                                                        <img
                                                            src={`/storage/${banner.image}`}
                                                            alt={banner.title}
                                                            className="h-10 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-16 rounded bg-gray-100 flex items-center justify-center">
                                                            <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </td>
                                                {/* Title + URL */}
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-800 max-w-[180px] truncate">{banner.title}</p>
                                                    {banner.external_url && (
                                                        <a
                                                            href={banner.external_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block max-w-[180px] truncate text-xs text-indigo-500 hover:underline"
                                                            dir="ltr"
                                                        >
                                                            {banner.external_url}
                                                        </a>
                                                    )}
                                                </td>
                                                {/* Locations */}
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {banner.locations.map(loc => (
                                                            <span key={loc} className="inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                                                                {locations[loc] ?? loc}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(banner)}
                                                        title="تغییر وضعیت"
                                                        className="focus:outline-none"
                                                    >
                                                        <StatusBadge active={banner.is_active} />
                                                    </button>
                                                </td>
                                                {/* active_from */}
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {banner.active_from ? toJalali(banner.active_from, true) : <span className="text-gray-400">—</span>}
                                                </td>
                                                {/* active_until */}
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {banner.active_until ? toJalali(banner.active_until, true) : <span className="text-gray-400">—</span>}
                                                </td>
                                                {/* sort_order */}
                                                <td className="px-4 py-3 text-sm text-gray-500 text-center tabular-nums">
                                                    {banner.sort_order}
                                                </td>
                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={route('ad-banners.edit', banner.id)}
                                                            className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                            title="ویرایش"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(banner)}
                                                            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            title="حذف"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
