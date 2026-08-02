import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
}

function isEmptyHtml(html: string): boolean {
    return !html || html === '<p><br></p>' || html === '<p></p>';
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'متن مقاله را بنویسید…',
    minHeight = 320,
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    const lastEmittedRef = useRef(value);
    const [focused, setFocused] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [stats, setStats] = useState({ words: 0, chars: 0 });

    useEffect(() => {
        onChangeRef.current = onChange;
    });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || quillRef.current) return;

        const editorEl = document.createElement('div');
        wrapper.appendChild(editorEl);

        const quill = new Quill(editorEl, {
            theme: 'snow',
            placeholder,
            modules: {
                toolbar: {
                    container: [
                        [{ header: [1, 2, 3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ script: 'sub' }, { script: 'super' }],
                        ['blockquote', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        [{ align: '' }, { align: 'center' }, { align: 'left' }, { align: 'right' }],
                        ['link', 'image', 'video'],
                        ['clean'],
                    ],
                    handlers: {
                        image() {
                            const url = window.prompt('آدرس تصویر را وارد کنید:');
                            if (!url) return;
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'image', url, 'user');
                            quill.setSelection(range.index + 1);
                        },
                        video() {
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

        quill.root.setAttribute('dir', 'rtl');
        quill.root.style.minHeight = `${minHeight}px`;

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
            setFocused(!!range);
        });

        updateStats();
        quillRef.current = quill;

        return () => {
            quillRef.current = null;
            wrapper.innerHTML = '';
        };
    }, []);

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

    return (
        <div
            className={[
                'rte-shell',
                focused ? 'rte-shell--focused' : '',
                fullscreen ? 'rte-shell--fullscreen' : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div ref={wrapperRef} className="rte-editor" />

            <div className="rte-footer">
                <span>
                    {stats.words.toLocaleString('fa-IR')} واژه · {stats.chars.toLocaleString('fa-IR')} نویسه
                </span>
                <div className="flex items-center gap-3">
                    {fullscreen && <span className="text-gray-400">Esc برای خروج</span>}
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
                </div>
            </div>
        </div>
    );
}
