import { useEffect, useMemo, useRef, useState } from 'react';

interface Option {
    id: number;
    name: string;
    parent_id?: number | null;
}

interface FlatItem {
    option: Option;
    depth: number;
}

interface Props {
    options: Option[];
    selected: number[];
    onChange: (ids: number[]) => void;
    isMultiSelect?: boolean;
    placeholder?: string;
    error?: string;
}

function buildFlatList(options: Option[]): FlatItem[] {
    const childrenOf = new Map<number | null, Option[]>();
    for (const opt of options) {
        const key = opt.parent_id ?? null;
        const bucket = childrenOf.get(key) ?? [];
        bucket.push(opt);
        childrenOf.set(key, bucket);
    }
    const result: FlatItem[] = [];
    function walk(parentId: number | null, depth: number) {
        for (const opt of childrenOf.get(parentId) ?? []) {
            result.push({ option: opt, depth });
            walk(opt.id, depth + 1);
        }
    }
    walk(null, 0);
    return result;
}

export default function MultiSelect({
    options,
    selected,
    onChange,
    isMultiSelect = true,
    placeholder = 'انتخاب کنید...',
    error,
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

    const flatList = useMemo(() => buildFlatList(options), [options]);
    const filtered = search ? flatList.filter(({ option }) => option.name.includes(search)) : flatList;
    const selectedOptions = options.filter(o => selected.includes(o.id));

    const handleSelect = (id: number) => {
        if (isMultiSelect) {
            onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
        } else {
            onChange(selected[0] === id ? [] : [id]);
            setOpen(false);
        }
    };

    const buttonLabel =
        selected.length === 0
            ? placeholder
            : isMultiSelect
            ? `${selected.length} مورد انتخاب شده`
            : (selectedOptions[0]?.name ?? placeholder);

    return (
        <div ref={containerRef} className="relative mt-1">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${
                    error
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white hover:border-indigo-400'
                }`}
            >
                <span className={selected.length === 0 ? 'text-gray-400' : 'text-gray-700'}>{buttonLabel}</span>
                <svg
                    className={`h-4 w-4 flex-none text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isMultiSelect && selectedOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedOptions.map(o => (
                        <span key={o.id} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                            {o.name}
                            <button
                                type="button"
                                onClick={() => handleSelect(o.id)}
                                className="ml-0.5 rounded-full text-indigo-400 hover:text-indigo-700"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {open && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-2">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="جستجو..."
                            className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
                        />
                    </div>

                    {!isMultiSelect && (
                        <button
                            type="button"
                            onClick={() => { onChange([]); setOpen(false); }}
                            className="w-full px-4 py-2.5 text-right text-sm text-gray-400 hover:bg-indigo-50"
                        >
                            — بدون والد (دسته اصلی) —
                        </button>
                    )}

                    <ul className="max-h-56 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400">موردی یافت نشد.</li>
                        ) : (
                            filtered.map(({ option: o, depth }) => (
                                <li
                                    key={o.id}
                                    onClick={() => handleSelect(o.id)}
                                    className="flex cursor-pointer items-center gap-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50"
                                    style={{ paddingRight: `${1 + depth * 1.25}rem`, paddingLeft: '1rem' }}
                                >
                                    {isMultiSelect ? (
                                        <input
                                            type="checkbox"
                                            readOnly
                                            checked={selected.includes(o.id)}
                                            className="h-4 w-4 flex-none rounded border-gray-300 accent-indigo-600"
                                        />
                                    ) : (
                                        <span className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 ${selected.includes(o.id) ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                                            {selected.includes(o.id) && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                                        </span>
                                    )}
                                    {depth > 0 && (
                                        <span className="select-none text-gray-300">{'— '.repeat(depth)}</span>
                                    )}
                                    <span className={depth > 0 ? 'text-gray-600' : 'font-medium text-gray-800'}>
                                        {o.name}
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
