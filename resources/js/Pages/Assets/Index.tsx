import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import type { Asset, PaginatedData } from '@/types/models';
import { FormEvent, useRef, useState } from 'react';

const TYPES = [
    { value: 'all',      label: 'همه' },
    { value: 'image',    label: 'تصویر' },
    { value: 'video',    label: 'ویدیو' },
    { value: 'audio',    label: 'صدا' },
    { value: 'document', label: 'سند' },
] as const;

function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

interface Props {
    assets: PaginatedData<Asset>;
    filters: { type?: string };
}

function AssetThumb({ asset }: { asset: Asset }) {
    if (asset.type === 'image') {
        return <img src={asset.url} alt={asset.alt ?? asset.name} className="h-full w-full object-cover" loading="lazy" />;
    }
    const cfg = {
        video:    { color: 'text-sky-400',    path: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
        audio:    { color: 'text-purple-400', path: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
        document: { color: 'text-orange-400', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    };
    const { color, path } = cfg[asset.type as 'video' | 'audio' | 'document'];
    return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <svg className={`h-10 w-10 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
        </div>
    );
}

function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const form = useForm<{ file: File | null; alt: string }>({ file: null, alt: '' });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post(route('assets.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { form.reset(); onClose(); },
        });
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">آپلود فایل</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) form.setData('file', f); }}
                        onClick={() => fileRef.current?.click()}
                        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
                            dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                    >
                        <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        {form.data.file
                            ? <p className="text-sm font-medium text-indigo-600">{(form.data.file as File).name}</p>
                            : <>
                                <p className="text-sm font-medium text-gray-600">فایل را اینجا بکشید یا کلیک کنید</p>
                                <p className="text-xs text-gray-400">تصویر ۱۰MB · ویدیو ۲۰۰MB · صدا ۵۰MB · سند ۲۰MB</p>
                              </>
                        }
                        <input
                            ref={fileRef} type="file" className="hidden"
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                            onChange={(e) => e.target.files?.[0] && form.setData('file', e.target.files[0])}
                        />
                    </div>

                    {form.errors.file && <p className="text-sm text-red-600">{form.errors.file}</p>}

                    {form.data.file && (form.data.file as File).type.startsWith('image/') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">متن جایگزین (alt)</label>
                            <input
                                type="text" value={form.data.alt}
                                onChange={(e) => form.setData('alt', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                placeholder="توضیح تصویر برای دسترسی‌پذیری"
                            />
                        </div>
                    )}

                    {form.processing && (
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full w-full bg-indigo-500 animate-pulse" />
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            انصراف
                        </button>
                        <button
                            type="submit" disabled={form.processing || !form.data.file}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {form.processing ? 'در حال آپلود...' : 'آپلود'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteModal({ asset, onClose, onConfirm }: { asset: Asset; onClose: () => void; onConfirm: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-2">حذف فایل</h2>
                <p className="text-sm text-gray-500 mb-6">
                    آیا از حذف <span className="font-medium text-gray-700">"{asset.name}"</span> مطمئن هستید؟ این عمل قابل بازگشت نیست.
                </p>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        انصراف
                    </button>
                    <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AssetsIndex({ assets, filters }: Props) {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
    const [copied, setCopied] = useState<number | null>(null);

    const activeType = filters.type ?? 'all';

    function changeType(type: string) {
        router.get(route('assets.index'), type !== 'all' ? { type } : {}, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    }

    function copyUrl(asset: Asset) {
        navigator.clipboard.writeText(asset.url);
        setCopied(asset.id);
        setTimeout(() => setCopied(null), 2000);
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(route('assets.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">مدیریت رسانه‌ها</h2>
                <button
                    type="button" onClick={() => setUploadOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    آپلود
                </button>
            </div>
        }>
            <Head title="رسانه‌ها" />

            <div className="lg:py-8 lg:px-0 px-4 py-5">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-5">

                    {/* Type tabs */}
                    <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-200 w-fit">
                        {TYPES.map(({ value, label }) => (
                            <button
                                key={value} type="button" onClick={() => changeType(value)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    activeType === value
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Count */}
                    <p className="text-sm text-gray-500">
                        {assets.total} فایل
                        {assets.last_page > 1 && ` · صفحه ${assets.current_page} از ${assets.last_page}`}
                    </p>

                    {/* Grid */}
                    {assets.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 py-20 text-gray-400 space-y-3">
                            <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">هیچ فایلی یافت نشد</p>
                            <button type="button" onClick={() => setUploadOpen(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                اولین فایل را آپلود کنید
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {assets.data.map((asset) => (
                                <div key={asset.id} className="group relative flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
                                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                                        <AssetThumb asset={asset} />
                                    </div>
                                    <div className="px-3 py-2 flex-1 min-w-0">
                                        <p className="truncate text-xs font-medium text-gray-800" title={asset.name}>{asset.name}</p>
                                        <p className="mt-0.5 text-[10px] text-gray-400">{formatSize(asset.size)}</p>
                                    </div>
                                    <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2">
                                        <button
                                            type="button" onClick={() => copyUrl(asset)} title="کپی لینک"
                                            className="flex-1 rounded-md py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                        >
                                            {copied === asset.id ? '✓ کپی شد' : 'کپی لینک'}
                                        </button>
                                        <button
                                            type="button" onClick={() => setDeleteTarget(asset)} title="حذف"
                                            className="rounded-md p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {assets.last_page > 1 && (
                        <div className="flex justify-center flex-wrap gap-1">
                            {assets.links.map((link, i) => (
                                <button
                                    key={i} type="button" disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                        link.active
                                            ? 'bg-indigo-600 text-white font-semibold'
                                            : link.url
                                                ? 'bg-white text-gray-600 hover:bg-gray-50 ring-1 ring-gray-200'
                                                : 'bg-white text-gray-300 cursor-not-allowed ring-1 ring-gray-100'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
            {deleteTarget && (
                <DeleteModal
                    asset={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AuthenticatedLayout>
    );
}
