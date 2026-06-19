import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PersianDateTimePicker from '@/Components/PersianDateTimePicker';
import type { AdBanner } from '@/types/models';

interface Props {
    banner: AdBanner | null;
    locations: Record<string, string>;
}

type FormData = {
    title: string;
    image: File | null;
    external_url: string;
    locations: string[];
    is_active: boolean;
    active_from: string;
    active_until: string;
    sort_order: number;
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-block h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                checked ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
        >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? 'right-0.5' : 'left-0.5'}`} />
        </button>
    );
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

export default function AdBannerForm({ banner, locations }: Props) {
    const isEdit = banner !== null;

    const form = useForm<FormData>({
        title:        banner?.title        ?? '',
        image:        null,
        external_url: banner?.external_url ?? '',
        locations:    banner?.locations    ?? [],
        is_active:    banner?.is_active    ?? true,
        active_from:  banner?.active_from  ? banner.active_from.slice(0, 16).replace('T', ' ') : '',
        active_until: banner?.active_until ? banner.active_until.slice(0, 16).replace('T', ' ') : '',
        sort_order:   banner?.sort_order   ?? 0,
    });

    const [preview, setPreview] = useState<string | null>(
        banner?.image ? `/storage/${banner.image}` : null
    );

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            form.setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const toggleLocation = (loc: string) => {
        const current = form.data.locations;
        form.setData('locations',
            current.includes(loc)
                ? current.filter(l => l !== loc)
                : [...current, loc]
        );
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            form.put(route('ad-banners.update', banner.id));
        } else {
            form.post(route('ad-banners.store'));
        }
    };

    const err = (field: keyof FormData) => form.errors[field];

    return (
        <AuthenticatedLayout header={
            <h2 className="text-xl font-bold leading-tight text-gray-800">
                {isEdit ? 'ویرایش بنر تبلیغاتی' : 'افزودن بنر تبلیغاتی'}
            </h2>
        }>
            <Head title={isEdit ? 'ویرایش بنر' : 'بنر جدید'} />

            <div className="px-4 py-5 lg:px-0 lg:py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                    <form onSubmit={submit} className="space-y-6">

                        {/* ── Basic info ── */}
                        <div className="rounded-xl bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h3 className="text-sm font-semibold text-gray-700">اطلاعات بنر</h3>
                            </div>
                            <div className="space-y-4 px-5 py-4">

                                {/* Title */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                        عنوان (برای شناسایی در پنل) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.title}
                                        onChange={e => form.setData('title', e.target.value)}
                                        maxLength={200}
                                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                            err('title')
                                                ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                                        }`}
                                        placeholder="عنوان داخلی بنر..."
                                    />
                                    <FieldError msg={err('title')} />
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                        تصویر بنر {!isEdit && <span className="text-red-500">*</span>}
                                        {isEdit && <span className="text-gray-400">(برای تغییر فایل جدید انتخاب کنید)</span>}
                                    </label>

                                    {preview && (
                                        <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                            <img src={preview} alt="" className="max-h-40 w-full object-contain" />
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={`block w-full text-sm text-gray-600 file:ml-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 ${
                                            err('image') ? 'outline outline-1 outline-red-400' : ''
                                        }`}
                                    />
                                    <p className="mt-1 text-xs text-gray-400">حداکثر ۵ مگابایت — JPG، PNG، WebP</p>
                                    <FieldError msg={err('image')} />
                                </div>

                                {/* External URL */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">لینک مقصد (اختیاری)</label>
                                    <input
                                        type="url"
                                        value={form.data.external_url}
                                        onChange={e => form.setData('external_url', e.target.value)}
                                        maxLength={500}
                                        dir="ltr"
                                        placeholder="https://..."
                                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                                            err('external_url')
                                                ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
                                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                                        }`}
                                    />
                                    <FieldError msg={err('external_url')} />
                                </div>

                                {/* Sort order */}
                                <div className="w-32">
                                    <label className="mb-1 block text-xs font-medium text-gray-600">ترتیب نمایش</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={9999}
                                        value={form.data.sort_order}
                                        onChange={e => form.setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">عدد کمتر = نمایش زودتر</p>
                                </div>

                            </div>
                        </div>

                        {/* ── Locations ── */}
                        <div className="rounded-xl bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h3 className="text-sm font-semibold text-gray-700">مکان نمایش <span className="text-red-500">*</span></h3>
                                <p className="mt-0.5 text-xs text-gray-400">انتخاب حداقل یک مکان الزامی است.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-3">
                                {Object.entries(locations).map(([key, label]) => {
                                    const checked = form.data.locations.includes(key);
                                    return (
                                        <label
                                            key={key}
                                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                                                checked
                                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleLocation(key)}
                                                className="accent-indigo-600"
                                            />
                                            <span className="font-medium">{label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            <FieldError msg={err('locations')} />
                        </div>

                        {/* ── Scheduling ── */}
                        <div className="rounded-xl bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h3 className="text-sm font-semibold text-gray-700">زمان‌بندی و وضعیت</h3>
                            </div>
                            <div className="space-y-4 px-5 py-4">

                                {/* is_active */}
                                <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                                    <Toggle
                                        checked={form.data.is_active}
                                        onChange={v => form.setData('is_active', v)}
                                    />
                                    <div>
                                        <p className={`text-sm font-medium ${form.data.is_active ? 'text-indigo-700' : 'text-gray-400'}`}>
                                            {form.data.is_active ? 'فعال' : 'غیرفعال'}
                                        </p>
                                        <p className="text-xs text-gray-400">بنر غیرفعال در هیچ صفحه‌ای نمایش داده نمی‌شود.</p>
                                    </div>
                                </div>

                                {/* Date range */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">از تاریخ (اختیاری)</label>
                                        <PersianDateTimePicker
                                            value={form.data.active_from}
                                            onChange={v => form.setData('active_from', v)}
                                            placeholder="شروع نمایش..."
                                            error={err('active_from')}
                                            className="w-full"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">اگر خالی باشد، از همان لحظه فعال‌سازی نمایش داده می‌شود.</p>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">تا تاریخ (اختیاری)</label>
                                        <PersianDateTimePicker
                                            value={form.data.active_until}
                                            onChange={v => form.setData('active_until', v)}
                                            minDateTime={form.data.active_from || undefined}
                                            placeholder="پایان نمایش..."
                                            error={err('active_until')}
                                            className="w-full"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">اگر خالی باشد، تا زمان غیرفعال‌سازی دستی نمایش داده می‌شود.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex items-center justify-between gap-4 pb-6">
                            <Link
                                href={route('ad-banners.index')}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                انصراف
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {form.processing ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        در حال ذخیره...
                                    </>
                                ) : (
                                    isEdit ? 'ذخیره تغییرات' : 'ثبت بنر'
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
