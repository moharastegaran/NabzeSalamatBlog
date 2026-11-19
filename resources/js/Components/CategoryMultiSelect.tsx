import { useEffect, useMemo, useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
    parent_id?: number | null;
}

interface FlatItem {
    category: Category;
    depth: number;
}

interface Props {
    categories: Category[];
    selected: number[];
    onChange: (ids: number[]) => void;
    error?: string;
    /** Single-select mode (radio behavior) */
    single?: boolean;
    placeholder?: string;
    /** Hide the selected chips row under the trigger */
    hideSelectedChips?: boolean;
    className?: string;
}

function buildFlatList(categories: Category[]): FlatItem[] {
    const childrenOf = new Map<number | null, Category[]>();

    for (const cat of categories) {
        const key = cat.parent_id ?? null;
        const bucket = childrenOf.get(key) ?? [];
        bucket.push(cat);
        childrenOf.set(key, bucket);
    }

    const result: FlatItem[] = [];

    function walk(parentId: number | null, depth: number) {
        const children = childrenOf.get(parentId) ?? [];
        children.sort((a, b) => a.name.localeCompare('fa'));
        for (const cat of children) {
            result.push({ category: cat, depth });
            walk(cat.id, depth + 1);
        }
    }

    walk(null, 0);
    return result;
}

export default function CategoryMultiSelect({
    categories,
    selected,
    onChange,
    error,
    single = false,
    placeholder,
    hideSelectedChips = false,
    className = '',
}: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const flatList = useMemo(() => buildFlatList(categories), [categories]);

    const filtered = search
        ? flatList.filter(({ category }) => category.name.includes(search))
        : flatList;

    const selectedCategories = categories.filter(c => selected.includes(c.id));
    const emptyLabel = placeholder ?? (single ? 'همه دسته‌بندی‌ها' : 'بدون دسته‌بندی');

    const toggle = (id: number) => {
        if (single) {
            onChange(selected.includes(id) ? [] : [id]);
            setOpen(false);
            return;
        }
        onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
    };

    const triggerLabel = () => {
        if (selected.length === 0) return emptyLabel;
        if (single) return selectedCategories[0]?.name ?? emptyLabel;
        return `${selected.length} دسته‌بندی انتخاب شده`;
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                    error
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : selected.length > 0
                          ? 'border-indigo-300 bg-indigo-50/50 text-indigo-700 hover:border-indigo-400'
                          : 'border-gray-300 bg-white text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
                }`}
            >
                <span className="truncate">{triggerLabel()}</span>
                <svg className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {!hideSelectedChips && selectedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedCategories.map(c => (
                        <span
                            key={c.id}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200"
                        >
                            {c.name}
                            <button
                                type="button"
                                onClick={() => toggle(c.id)}
                                className="ml-0.5 rounded-full text-indigo-400 hover:text-indigo-700"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {open && (
                <div className="absolute z-20 mt-1 w-full min-w-[14rem] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-2">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="جستجوی دسته‌بندی..."
                            className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
                        />
                    </div>
                    <ul className="max-h-56 overflow-y-auto">
                        {single && (
                            <li
                                onClick={() => {
                                    onChange([]);
                                    setOpen(false);
                                }}
                                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm hover:bg-indigo-50 ${
                                    selected.length === 0 ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-600'
                                }`}
                            >
                                همه دسته‌بندی‌ها
                            </li>
                        )}
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400">دسته‌بندی‌ای یافت نشد.</li>
                        ) : (
                            filtered.map(({ category: c, depth }) => (
                                <li
                                    key={c.id}
                                    onClick={() => toggle(c.id)}
                                    className={`flex cursor-pointer items-center gap-3 py-2.5 text-sm hover:bg-indigo-50 ${
                                        selected.includes(c.id) ? 'bg-indigo-50/70 text-indigo-800' : 'text-gray-700'
                                    }`}
                                    style={{ paddingRight: `${1 + depth * 1.25}rem`, paddingLeft: '1rem' }}
                                >
                                    <input
                                        type={single ? 'radio' : 'checkbox'}
                                        readOnly
                                        checked={selected.includes(c.id)}
                                        className={`h-4 w-4 border-gray-300 accent-indigo-600 ${single ? '' : 'rounded'}`}
                                    />
                                    {depth > 0 && (
                                        <span className="text-gray-300 select-none">{'— '.repeat(depth)}</span>
                                    )}
                                    <span className={depth > 0 ? 'text-gray-600' : 'font-medium text-gray-800'}>
                                        {c.name}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
