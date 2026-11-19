import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import { SizeClass } from 'quill/formats/size';
import { FontClass } from 'quill/formats/font';
import { DirectionAttribute, DirectionClass } from 'quill/formats/direction';
import 'quill/dist/quill.snow.css';
import { attachImageResize } from '@/Components/quill/attachImageResize';
import TableControls from '@/Components/quill/TableControls';
import { isSelectionInTable } from '@/Components/quill/tableTypes';
import AssetPicker from '@/Components/AssetPicker';
import type { Asset } from '@/types/models';

Quill.register(SizeClass, true);
Quill.register(FontClass, true);
Quill.register(DirectionAttribute, true);
Quill.register(DirectionClass, true);

function assetPublicUrl(asset: Asset): string {
    return asset.disk === 'public' ? `/storage/${asset.path}` : asset.url;
}

const FULL_TOOLBAR = [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ align: '' }, { align: 'center' }, { align: 'left' }, { align: 'right' }],
    ['link', 'image', 'video', 'table'],
    ['clean'],
] as const;

const SIMPLE_TOOLBAR = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: '' }, { align: 'center' }, { align: 'right' }],
    ['link'],
    ['clean'],
] as const;

export interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    className?: string;
    id?: string;
    name?: string;
    dir?: 'rtl' | 'ltr';
    readOnly?: boolean;
    disabled?: boolean;
    /** Show word/character footer stats (default true) */
    showStats?: boolean;
    /** Show fullscreen toggle (default true) */
    showFullscreen?: boolean;
    /** Allow editing raw HTML source (default true) */
    showHtmlSource?: boolean;
    /** Enable click-to-resize images (default true) */
    imageResize?: boolean;
    /** Full article toolbar, or a compact set for short blurbs (default full) */
    toolbar?: 'full' | 'simple';
    /**
     * Use media library for image (and optionally video) inserts at the cursor.
     * When set, the image toolbar button opens AssetPicker instead of a URL prompt.
     */
    assetPicker?: {
        canUpload?: boolean;
        /** Also open the library for the video toolbar button (default false; URL prompt kept) */
        forVideo?: boolean;
    };
    /** Enable Quill table module + insert/edit UI (default true for full toolbar) */
    tables?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

function isEmptyHtml(html: string): boolean {
    return !html || html === '<p><br></p>' || html === '<p></p>';
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'متن مقاله را بنویسید…',
    minHeight = 320,
    maxHeight,
    className = '',
    id,
    name,
    dir = 'rtl',
    readOnly = false,
    disabled = false,
    showStats = true,
    showFullscreen = true,
    showHtmlSource = true,
    imageResize = true,
    toolbar = 'full',
    assetPicker,
    tables,
    onFocus,
    onBlur,
}: RichTextEditorProps) {
    const tablesEnabled = tables ?? toolbar === 'full';
    const wrapperRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);
    const assetPickerRef = useRef(assetPicker);
    const openMediaPickerRef = useRef<(accept: 'image' | 'video') => void>(() => {});
    const openTablePanelRef = useRef<() => void>(() => {});
    const insertIndexRef = useRef<number | null>(null);
    const lastEmittedRef = useRef(value);
    const htmlModeRef = useRef(false);
    const [focused, setFocused] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [stats, setStats] = useState({ words: 0, chars: 0 });
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaAccept, setMediaAccept] = useState<'image' | 'video'>('image');
    const [tablePanelOpen, setTablePanelOpen] = useState(false);
    const [inTable, setInTable] = useState(false);
    const [quillReady, setQuillReady] = useState(false);
    const [htmlMode, setHtmlMode] = useState(false);
    const [sourceHtml, setSourceHtml] = useState('');
    const locked = readOnly || disabled;

    useEffect(() => {
        onChangeRef.current = onChange;
        onFocusRef.current = onFocus;
        onBlurRef.current = onBlur;
        assetPickerRef.current = assetPicker;
    });

    useEffect(() => {
        openMediaPickerRef.current = (accept) => {
            const quill = quillRef.current;
            if (!quill) return;
            const range = quill.getSelection(true);
            insertIndexRef.current = range?.index ?? quill.getLength();
            setMediaAccept(accept);
            setMediaPickerOpen(true);
        };
        openTablePanelRef.current = () => {
            const quill = quillRef.current;
            if (!quill) return;
            setInTable(isSelectionInTable(quill));
            setTablePanelOpen(true);
        };
    });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || quillRef.current) return;

        const editorEl = document.createElement('div');
        if (id) editorEl.id = id;
        wrapper.appendChild(editorEl);

        const useSimple = toolbar === 'simple';
        const toolbarItems = useSimple
            ? [...SIMPLE_TOOLBAR]
            : tablesEnabled
              ? [...FULL_TOOLBAR]
              : [...FULL_TOOLBAR].map((group) =>
                    Array.isArray(group)
                        ? group.filter((item) => item !== 'table')
                        : group,
                );

        const quill = new Quill(editorEl, {
            theme: 'snow',
            placeholder,
            readOnly: locked,
            modules: {
                table: tablesEnabled && !useSimple,
                toolbar: {
                    container: toolbarItems,
                    handlers: useSimple ? {} : {
                        image() {
                            if (locked) return;
                            if (assetPickerRef.current) {
                                openMediaPickerRef.current('image');
                                return;
                            }
                            const url = window.prompt('آدرس تصویر را وارد کنید:');
                            if (!url) return;
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'image', url, 'user');
                            quill.setSelection(range.index + 1);
                        },
                        video() {
                            if (locked) return;
                            if (assetPickerRef.current?.forVideo) {
                                openMediaPickerRef.current('video');
                                return;
                            }
                            const url = window.prompt('آدرس ویدیو (YouTube / Vimeo / مستقیم) را وارد کنید:');
                            if (!url) return;
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'video', url, 'user');
                            quill.setSelection(range.index + 1);
                        },
                        table() {
                            if (locked || !tablesEnabled) return;
                            openTablePanelRef.current();
                        },
                    },
                },
                history: { delay: 400, maxStack: 200 },
            },
        });

        quill.root.setAttribute('dir', dir);
        quill.root.style.minHeight = `${minHeight}px`;
        if (maxHeight) {
            quill.root.style.maxHeight = `${maxHeight}px`;
            quill.root.style.overflowY = 'auto';
        }

        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
            lastEmittedRef.current = isEmptyHtml(quill.root.innerHTML) ? '' : quill.root.innerHTML;
        }

        const updateStats = () => {
            const text = quill.getText().trim();
            setStats({
                words: text ? text.split(/\s+/).filter(Boolean).length : 0,
                chars: text.length,
            });
        };

        quill.on('text-change', () => {
            if (htmlModeRef.current) return;
            const html = isEmptyHtml(quill.root.innerHTML) ? '' : quill.root.innerHTML;
            lastEmittedRef.current = html;
            onChangeRef.current(html);
            updateStats();
        });

        quill.on('selection-change', (range) => {
            if (htmlModeRef.current) return;
            const isFocused = !!range;
            setFocused(isFocused);
            if (isFocused) onFocusRef.current?.();
            else onBlurRef.current?.();

            if (tablesEnabled) {
                setInTable(isFocused && isSelectionInTable(quill));
            }
        });

        updateStats();
        quillRef.current = quill;
        setQuillReady(true);
        const detachImageResize = imageResize && !locked ? attachImageResize(quill) : () => {};

        return () => {
            detachImageResize();
            quillRef.current = null;
            setQuillReady(false);
            wrapper.innerHTML = '';
        };
        // Intentionally mount-once; prop sync handled in effects below
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;
        quill.enable(!locked);
    }, [locked]);

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;
        quill.root.setAttribute('dir', dir);
    }, [dir]);

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;
        quill.root.style.minHeight = `${minHeight}px`;
        if (maxHeight) {
            quill.root.style.maxHeight = `${maxHeight}px`;
            quill.root.style.overflowY = 'auto';
        } else {
            quill.root.style.maxHeight = '';
            quill.root.style.overflowY = '';
        }
    }, [minHeight, maxHeight]);

    // Sync only when parent value changes from outside the editor
    useEffect(() => {
        if (htmlMode) {
            if ((value || '') !== sourceHtml && value !== lastEmittedRef.current) {
                setSourceHtml(value || '');
            }
            return;
        }

        const quill = quillRef.current;
        if (!quill) return;
        const next = value || '';
        if (next === lastEmittedRef.current) return;
        if (isEmptyHtml(next) && isEmptyHtml(lastEmittedRef.current)) return;

        const sel = quill.getSelection();
        quill.setContents([]);
        if (next) quill.clipboard.dangerouslyPasteHTML(next);
        lastEmittedRef.current = isEmptyHtml(quill.root.innerHTML) ? '' : quill.root.innerHTML;
        if (sel) quill.setSelection(sel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, htmlMode]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && fullscreen && !htmlMode) setFullscreen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [fullscreen, htmlMode]);

    useEffect(() => {
        document.body.style.overflow = fullscreen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [fullscreen]);

    const showFooter = showStats || showFullscreen || showHtmlSource;

    const enterHtmlMode = () => {
        const quill = quillRef.current;
        const html = quill
            ? (isEmptyHtml(quill.root.innerHTML) ? '' : quill.root.innerHTML)
            : (value || '');
        setSourceHtml(html);
        htmlModeRef.current = true;
        setHtmlMode(true);
        setTablePanelOpen(false);
        setFocused(false);
        setInTable(false);
    };

    const exitHtmlMode = () => {
        const next = sourceHtml;
        const quill = quillRef.current;
        if (quill) {
            quill.setContents([]);
            if (next.trim()) quill.clipboard.dangerouslyPasteHTML(next);
            const normalized = isEmptyHtml(quill.root.innerHTML) ? '' : quill.root.innerHTML;
            lastEmittedRef.current = normalized;
            onChangeRef.current(normalized);
            const text = quill.getText().trim();
            setStats({
                words: text ? text.split(/\s+/).filter(Boolean).length : 0,
                chars: text.length,
            });
        } else {
            lastEmittedRef.current = next;
            onChangeRef.current(next);
        }
        htmlModeRef.current = false;
        setHtmlMode(false);
    };

    const handleSourceChange = (html: string) => {
        setSourceHtml(html);
        lastEmittedRef.current = html;
        onChangeRef.current(html);
    };

    const handleMediaSelect = (asset: Asset) => {
        const quill = quillRef.current;
        if (!quill) return;

        const index = insertIndexRef.current ?? quill.getLength();
        const url = assetPublicUrl(asset);

        if (asset.type === 'image') {
            quill.insertEmbed(index, 'image', url, 'user');
            quill.setSelection(index + 1, 0, 'user');
        } else if (asset.type === 'video') {
            quill.insertEmbed(index, 'video', url, 'user');
            quill.setSelection(index + 1, 0, 'user');
        } else {
            const label = asset.alt || asset.name || url;
            quill.insertText(index, label, 'link', url, 'user');
            quill.setSelection(index + label.length, 0, 'user');
        }

        insertIndexRef.current = null;
        quill.focus();
    };

    return (
        <div
            className={[
                'rte-shell',
                focused ? 'rte-shell--focused' : '',
                fullscreen ? 'rte-shell--fullscreen' : '',
                htmlMode ? 'rte-shell--html' : '',
                disabled ? 'rte-shell--disabled' : '',
                readOnly ? 'rte-shell--readonly' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {name && (
                <input type="hidden" name={name} value={value} readOnly />
            )}
            <div ref={wrapperRef} className="rte-editor" />

            {htmlMode && (
                <textarea
                    className="rte-source"
                    value={sourceHtml}
                    onChange={e => handleSourceChange(e.target.value)}
                    onFocus={() => {
                        setFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => {
                        setFocused(false);
                        onBlur?.();
                    }}
                    spellCheck={false}
                    dir="ltr"
                    disabled={locked}
                    style={{ minHeight: `${Math.max(minHeight, 240)}px` }}
                    placeholder="<!-- HTML -->"
                    aria-label="ویرایش HTML"
                />
            )}

            {showFooter && (
                <div className="rte-footer">
                    <span>
                        {htmlMode
                            ? `${sourceHtml.length.toLocaleString('fa-IR')} نویسه HTML`
                            : showStats
                              ? `${stats.words.toLocaleString('fa-IR')} واژه · ${stats.chars.toLocaleString('fa-IR')} نویسه`
                              : null}
                    </span>
                    <div className="flex items-center gap-3">
                        {tablesEnabled && inTable && !locked && !htmlMode && (
                            <button
                                type="button"
                                className="rte-action-btn"
                                onClick={() => setTablePanelOpen(true)}
                                title="ویرایش جدول"
                            >
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 12h18M3 19h18M8 5v14M16 5v14" />
                                </svg>
                                <span>جدول</span>
                            </button>
                        )}
                        {showHtmlSource && !locked && (
                            <button
                                type="button"
                                className={`rte-action-btn${htmlMode ? ' rte-action-btn--active' : ''}`}
                                onClick={() => (htmlMode ? exitHtmlMode() : enterHtmlMode())}
                                title={htmlMode ? 'بازگشت به ویرایشگر دیداری' : 'ویرایش HTML'}
                            >
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" />
                                </svg>
                                <span>{htmlMode ? 'دیداری' : 'HTML'}</span>
                            </button>
                        )}
                        {fullscreen && showFullscreen && !htmlMode && (
                            <span className="text-gray-400">Esc برای خروج</span>
                        )}
                        {showFullscreen && (
                            <button
                                type="button"
                                className="rte-action-btn"
                                onClick={() => setFullscreen((v) => !v)}
                                title={fullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
                            >
                                {fullscreen ? (
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9H4V4m11 5h5V4M9 15H4v5m11-5h5v5" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M15 4h5v5M4 15v5h5m6 0h5v-5" />
                                    </svg>
                                )}
                                <span>{fullscreen ? 'خروج' : 'تمام‌صفحه'}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {tablesEnabled && !htmlMode && (
                <TableControls
                    quill={quillReady ? quillRef.current : null}
                    open={tablePanelOpen}
                    inTable={inTable}
                    onClose={() => setTablePanelOpen(false)}
                />
            )}

            {assetPicker && (
                <AssetPicker
                    open={mediaPickerOpen}
                    onClose={() => {
                        setMediaPickerOpen(false);
                        insertIndexRef.current = null;
                    }}
                    onSelect={handleMediaSelect}
                    accept={mediaAccept}
                    canUpload={assetPicker.canUpload}
                />
            )}
        </div>
    );
}
