import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
}

export default function WysiwygEditor({ value, onChange, placeholder, minHeight = 160 }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const quillRef  = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => { onChangeRef.current = onChange; });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper || quillRef.current) return;

        const editorEl = document.createElement('div');
        wrapper.appendChild(editorEl);

        const quill = new Quill(editorEl, {
            theme: 'snow',
            placeholder: placeholder ?? '',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['image', 'code-block'],
                    [{ header: [2, 3, 4, false] }, 'blockquote'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }],
                    ['link', 'clean'],
                ],
                history: { delay: 400, maxStack: 100 },
            },
        });

        quill.root.setAttribute('dir', 'rtl');
        quill.root.style.minHeight  = `${minHeight}px`;
        quill.root.style.fontFamily = 'inherit';

        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            onChangeRef.current(html === '<p><br></p>' ? '' : html);
        });

        quillRef.current = quill;

        return () => {
            quillRef.current = null;
            wrapper.innerHTML = '';
        };
    }, []);

    return (
        <div className="wysiwyg-wrap rounded-md border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden bg-white">
            <div ref={wrapperRef} />
        </div>
    );
}
