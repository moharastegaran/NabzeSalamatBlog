import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import type { Asset } from '@/types/models';

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

function TypeIcon({ type }: { type: string }) {
    const cfg = {
        video:    { color: 'text-sky-400',    path: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
        audio:    { color: 'text-purple-400', path: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
        document: { color: 'text-orange-400', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    } as Record<string, { color: string; path: string }>;
    const { color, path } = cfg[type] ?? cfg.document;
    return (
        <svg className={`h-10 w-10 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}

interface AssetPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (asset: Asset) => void;
    /** Pre-filter to a specific type (also hides other type tabs) */
    accept?: 'image' | 'video' | 'audio' | 'document';
    /** Show upload panel — only for users with assets.store permission */
    canUpload?: boolean;
}

export default function AssetPicker({ open, onClose, onSelect, accept, canUpload = false }: AssetPickerProps) {
    const [assets, setAssets]           = useState<Asset[]>([]);
    const [loading, setLoading]         = useState(false);
    const [typeFilter, setTypeFilter]   = useState<string>(accept ?? 'all');
    const [search, setSearch]           = useState('');
    const [uploadOpen, setUploadOpen]   = useState(false);
    const [uploadFile, setUploadFile]   = useState<File | null>(null);
    const [uploadAlt, setUploadAlt]     = useState('');
    const [uploading, setUploading]     = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const [dragging, setDragging]       = useState(false);
    const fileRef  = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchAssets = useCallback(async (type: string, q: string) => {
        setLoading(true);
        try {
            const { data } = await axios.get<Asset[]>(route('assets.data'), {
                params: {
                    ...(type !== 'all' && { type }),
                    ...(q && { search: q }),
                },
            });
            setAssets(data);
        } catch {
            //
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on open or type change immediately
    useEffect(() => {
        if (!open) return;
        fetchAssets(typeFilter, search);
    }, [open, typeFilter]);

    // Debounce search
    useEffect(() => {
        if (!open) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => fetchAssets(typeFilter, search), 300);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [search]);

    async function handleUpload() {
        if (!uploadFile) return;
        setUploading(true);
        setUploadError('');
        setUploadProgress(0);
        const fd = new FormData();
        fd.append('file', uploadFile);
        if (uploadAlt) fd.append('alt', uploadAlt);
        try {
            await axios.post(route('assets.store'), fd, {
                onUploadProgress: (e) => {
                    if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
                },
            });
            setUploadFile(null);
            setUploadAlt('');
            setUploadOpen(false);
            setUploadProgress(0);
            await fetchAssets(typeFilter, search);
        } catch (err: any) {
            setUploadError(err?.response?.data?.errors?.file?.[0] ?? 'خطا در آپلود فایل');
        } finally {
            setUploading(false);
        }
    }

    function handleSelect(asset: Asset) {
        onSelect(asset);
        onClose();
    }

    if (!open) return null;

    const visibleTypes = accept
        ? TYPES.filter((t) => t.value === 'all' || t.value === accept)
        : TYPES;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
                    <h2 className="text-base font-semibold text-gray-900">انتخاب رسانه</h2>
                    <div className="flex items-center gap-2">
                        {canUpload && (
                            <button
                                type="button"
                                onClick={() => setUploadOpen((v) => !v)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                آپلود جدید
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Upload panel ── */}
                {canUpload && uploadOpen && (
                    <div className="shrink-0 border-b border-gray-100 bg-gray-50 px-6 py-4 space-y-3">
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setUploadFile(f); }}
                            onClick={() => fileRef.current?.click()}
                            className={`flex items-center justify-center gap-3 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-colors ${
                                dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                            }`}
                        >
                            <svg className="h-6 w-6 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-sm text-gray-500">
                                {uploadFile ? uploadFile.name : 'کلیک کنید یا فایل را بکشید'}
                            </span>
                            <input
                                ref={fileRef} type="file" className="hidden"
                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                onChange={(e) => e.target.files?.[0] && setUploadFile(e.target.files[0])}
                            />
                        </div>

                        {uploadFile?.type.startsWith('image/') && (
                            <input
                                type="text" value={uploadAlt} onChange={(e) => setUploadAlt(e.target.value)}
                                placeholder="متن جایگزین (alt) برای دسترسی‌پذیری"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        )}

                        {uploading && (
                            <div className="relative h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                        )}

                        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => { setUploadOpen(false); setUploadFile(null); setUploadError(''); }}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                انصراف
                            </button>
                            <button
                                type="button" onClick={handleUpload} disabled={uploading || !uploadFile}
                                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {uploading ? `${uploadProgress}%` : 'آپلود'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Filter + search ── */}
                <div className="flex items-center gap-3 shrink-0 border-b border-gray-100 px-6 py-3">
                    <div className="flex gap-1">
                        {visibleTypes.map(({ value, label }) => (
                            <button
                                key={value} type="button" onClick={() => setTypeFilter(value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                    typeFilter === value ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجو در نام فایل..."
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* ── Asset grid ── */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-gray-400">
                            <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-2">
                            <svg className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">هیچ فایلی یافت نشد</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {assets.map((asset) => (
                                <button
                                    key={asset.id} type="button" onClick={() => handleSelect(asset)}
                                    className="group relative flex flex-col rounded-xl ring-1 ring-gray-200 overflow-hidden hover:ring-indigo-400 hover:shadow-md transition-all text-right"
                                >
                                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                                        {asset.type === 'image' ? (
                                            <img
                                                src={asset.disk === 'public' ? `/storage/${asset.path}` : asset.url} alt={asset.alt ?? asset.name} loading="lazy"
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <TypeIcon type={asset.type} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white px-2 py-1.5 min-w-0">
                                        <p className="truncate text-[11px] font-medium text-gray-700">{asset.name}</p>
                                        <p className="text-[10px] text-gray-400">{formatSize(asset.size)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
