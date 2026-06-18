import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { GalleryItem, PaginatedData, Province } from '@/types/models';
import { FormEventHandler, useEffect, useState } from 'react';

const PERSIAN_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const EVENT_LABELS: Record<string, string> = { seminar: 'سمینار', exhibition: 'نمایشگاه' };

interface Props {
    items: PaginatedData<GalleryItem>;
    provinces: Province[];
}

function IconTrash() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

const selectCls = 'w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F24F00] appearance-none';
const inputCls  = 'w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F24F00]';
const labelCls  = 'block text-sm font-medium text-gray-700 mb-1';

export default function GalleryIndex({ items, provinces }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredCities, setFilteredCities] = useState<{ id: number; name: string }[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<{
        event: string;
        province_id: string;
        city_id: string;
        img: File | null;
        year: string;
        month: string;
    }>({
        event: '',
        province_id: '',
        city_id: '',
        img: null,
        year: '',
        month: '',
    });

    useEffect(() => {
        if (wasSuccessful) {
            setModalOpen(false);
            reset();
            setPreviewUrl(null);
        }
    }, [wasSuccessful]);

    function handleProvinceChange(provinceId: string) {
        setData(prev => ({ ...prev, province_id: provinceId, city_id: '' }));
        const province = provinces.find(p => p.id === Number(provinceId));
        setFilteredCities(province?.cities ?? []);
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('gallery.store'), { forceFormData: true });
    };

    function destroy(id: number) {
        if (!confirm('آیا از حذف این تصویر اطمینان دارید؟')) return;
        router.delete(route('gallery.destroy', id), { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout>
            <Head title="گالری تصاویر" />

            <div className="lg:py-8 px-4 sm:px-6 lg:px-8 py-5 mx-auto max-w-7xl space-y-4" dir="rtl">

                {/* Header */}
                <div className="flex items-center justify-between mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-[#F24F00]">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">گالری تصاویر</h1>
                            <p className="text-sm text-gray-500">مجموع {items.total} تصویر</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#F24F00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C24000] transition-colors"
                    >
                        <IconPlus />
                        افزودن تصویر
                    </button>
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 text-right">تصویر</th>
                                    <th className="px-4 py-3 text-right">نوع رویداد</th>
                                    <th className="px-4 py-3 text-right">شهر</th>
                                    <th className="px-4 py-3 text-right">تاریخ</th>
                                    <th className="px-4 py-3 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                                            هیچ تصویری ثبت نشده است.
                                        </td>
                                    </tr>
                                )}
                                {items.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <img
                                                src={`/storage/${item.img}`}
                                                alt=""
                                                className="h-14 w-20 object-cover rounded-lg border border-gray-100"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                item.event === 'seminar'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {EVENT_LABELS[item.event] ?? item.event}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{item.city?.name ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                            {PERSIAN_MONTHS[item.month - 1]} {item.year}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => destroy(item.id)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <IconTrash /> حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {items.last_page > 1 && (
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-sm text-gray-500">
                            <span>{items.from}–{items.to} از {items.total}</span>
                            <div className="flex gap-1">
                                {items.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-lg text-xs border transition-colors ${
                                            link.active
                                                ? 'bg-[#F24F00] text-white border-[#F24F00]'
                                                : link.url
                                                ? 'border-gray-200 hover:bg-gray-50'
                                                : 'border-gray-100 text-gray-300 cursor-default'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Add Image Modal ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl" dir="rtl">
                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-base font-bold text-gray-900">افزودن تصویر جدید</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal body */}
                        <form onSubmit={submit} className="p-6 space-y-4">

                            {/* Event */}
                            <div>
                                <label className={labelCls}>نوع رویداد</label>
                                <div className="relative">
                                    <select
                                        value={data.event}
                                        onChange={e => setData('event', e.target.value)}
                                        className={selectCls}
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="">-- انتخاب کنید --</option>
                                        <option value="seminar">سمینار</option>
                                        <option value="exhibition">نمایشگاه</option>
                                    </select>
                                    <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {errors.event && <p className="mt-1 text-xs text-red-600">{errors.event}</p>}
                            </div>

                            {/* Province → City */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>استان</label>
                                    <div className="relative">
                                        <select
                                            value={data.province_id}
                                            onChange={e => handleProvinceChange(e.target.value)}
                                            className={selectCls}
                                            style={{ backgroundImage: 'none' }}
                                        >
                                            <option value="">انتخاب استان</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>شهر</label>
                                    <div className="relative">
                                        <select
                                            value={data.city_id}
                                            onChange={e => setData('city_id', e.target.value)}
                                            disabled={!data.province_id}
                                            className={`${selectCls} disabled:opacity-50`}
                                            style={{ backgroundImage: 'none' }}
                                        >
                                            <option value="">انتخاب شهر</option>
                                            {filteredCities.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {errors.city_id && <p className="mt-1 text-xs text-red-600">{errors.city_id}</p>}
                                </div>
                            </div>

                            {/* Year + Month */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>سال (شمسی)</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={e => setData('year', e.target.value)}
                                        placeholder="مثال: ۱۴۰۳"
                                        min={1380}
                                        max={1450}
                                        className={inputCls}
                                    />
                                    {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
                                </div>
                                <div>
                                    <label className={labelCls}>ماه</label>
                                    <div className="relative">
                                        <select
                                            value={data.month}
                                            onChange={e => setData('month', e.target.value)}
                                            className={selectCls}
                                            style={{ backgroundImage: 'none' }}
                                        >
                                            <option value="">انتخاب ماه</option>
                                            {PERSIAN_MONTHS.map((m, i) => (
                                                <option key={i + 1} value={i + 1}>{m}</option>
                                            ))}
                                        </select>
                                        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {errors.month && <p className="mt-1 text-xs text-red-600">{errors.month}</p>}
                                </div>
                            </div>

                            {/* Image upload */}
                            <div>
                                <label className={labelCls}>تصویر</label>
                                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-6 hover:border-[#F24F00] hover:bg-red-50 transition-colors">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="h-28 w-full object-contain rounded-lg" alt="preview" />
                                    ) : (
                                        <>
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-500">کلیک کنید یا فایل را بکشید</span>
                                            <span className="text-xs text-gray-400">JPG، PNG، WEBP — حداکثر ۵ مگابایت</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        name="img"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="sr-only"
                                        onChange={e => {
                                            const file = e.target.files?.[0] ?? null;
                                            setData('img', file);
                                            setPreviewUrl(file ? URL.createObjectURL(file) : null);
                                        }}
                                    />
                                </label>
                                {errors.img && <p className="mt-1 text-xs text-red-600">{errors.img}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#F24F00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#C24000] disabled:opacity-60 transition-colors"
                                >
                                    {processing && (
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    ذخیره
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
