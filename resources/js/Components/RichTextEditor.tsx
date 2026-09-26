import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import { SizeClass } from 'quill/formats/size';
import { FontClass } from 'quill/formats/font';
import { DirectionAttribute, DirectionClass } from 'quill/formats/direction';
import 'quill/dist/quill.snow.css';
import { attachImageResize } from '@/Components/quill/attachImageResize';

Quill.register(SizeClass, true);
Quill.register(FontClass, true);
Quill.register(DirectionAttribute, true);
Quill.register(DirectionClass, true);

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
    ['link', 'image', 'video'],
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
    /** Enable click-to-resize images (default true) */
    imageResize?: boolean;
    /** Full article toolbar, or a compact set for short blurbs (default full) */
    toolbar?: 'full' | 'simple';
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
    imageResize = true,
    toolbar = 'full',
    onFocus,
    onBlur,
}: RichTextEditorProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);
    const lastEmittedRef = useRef(value);
    const [focused, setFocused] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [stats, setStats] = useState({ words: 0, chars: 0 });
    const locked = readOnly || disabled;

    useEffect(() => {
        onChangeRef.current = onChange;
        onFocusRef.current = onFocus;
        onBlurRef.current = onBlur;
    });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || quillRef.current) return;

        const editorEl = document.createElement('div');
        if (id) editorEl.id = id;
        wrapper.appendChild(editorEl);

        const useSimple = toolbar === 'simple';
        const quill = new Quill(editorEl, {
            theme: 'snow',
            placeholder,
            readOnly: locked,
            modules: {
                toolbar: {
                    container: [...(useSimple ? SIMPLE_TOOLBAR : FULL_TOOLBAR)],
                    handlers: useSimple ? {} : {
                        image() {
                            if (locked) return;
                            const url = window.prompt('آدرس تصویر را وارد کنید:');
                            if (!url) return;
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'image', url, 'user');
                            quill.setSelection(range.index + 1);
                        },
                        video() {
                            if (locked) return;
                            const url = window.prompt('آدرس ویدیو (YouTube / Vimeo / مستقیم) را وارد کنید:');
                            if (!url) return;
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'video', url, 'user');
                            quill.setSelection(range.index + 1);
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
            const html = isEmptyHtml(quill.root.innerHTML) ? '' : quill.root.innerHTML;
            lastEmittedRef.current = html;
            onChangeRef.current(html);
            updateStats();
        });

        quill.on('selection-change', (range) => {
            const isFocused = !!range;
            setFocused(isFocused);
            if (isFocused) onFocusRef.current?.();
            else onBlurRef.current?.();
        });

        updateStats();
        quillRef.current = quill;
        const detachImageResize = imageResize && !locked ? attachImageResize(quill) : () => {};

        return () => {
            detachImageResize();
            quillRef.current = null;
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
    }, [value]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && fullscreen) setFullscreen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [fullscreen]);

    useEffect(() => {
        document.body.style.overflow = fullscreen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [fullscreen]);

    const showFooter = showStats || showFullscreen;

    return (
        <div
            className={[
                'rte-shell',
                focused ? 'rte-shell--focused' : '',
                fullscreen ? 'rte-shell--fullscreen' : '',
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

            {showFooter && (
                <div className="rte-footer">
                    <span>
                        {showStats
                            ? `${stats.words.toLocaleString('fa-IR')} واژه · ${stats.chars.toLocaleString('fa-IR')} نویسه`
                            : null}
                    </span>
                    <div className="flex items-center gap-3">
                        {fullscreen && showFullscreen && (
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
        </div>
    );
}
