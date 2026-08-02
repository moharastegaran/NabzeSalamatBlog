import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Tag {
    id: number;
    name: string;
}

interface Props {
    tags: Tag[];
    selected: number[];
    onChange: (ids: number[]) => void;
    canCreate?: boolean;
    error?: string;
}

export default function TagMultiSelect({
    tags: initialTags,
    selected,
    onChange,
    canCreate = true,
    error,
}: Props) {
    const [options, setOptions] = useState<Tag[]>(initialTags);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [highlight, setHighlight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setOptions(prev => {
            const byId = new Map(prev.map(t => [t.id, t]));
            for (const t of initialTags) byId.set(t.id, t);
            return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        });
    }, [initialTags]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectedTags = useMemo(
        () => options.filter(t => selected.includes(t.id)),
        [options, selected],
    );

    const normalizedQuery = query.trim();

    const filtered = useMemo(() => {
        if (!normalizedQuery) return options;
        return options.filter(t => t.name.includes(normalizedQuery));
    }, [options, normalizedQuery]);

    const exactMatch = useMemo(
        () => options.some(t => t.name === normalizedQuery),
        [options, normalizedQuery],
    );

    const showCreate = canCreate && normalizedQuery.length > 0 && !exactMatch;

    const menuItems = useMemo(() => {
        const items: Array<{ type: 'tag'; tag: Tag } | { type: 'create'; name: string }> = filtered.map(tag => ({
            type: 'tag' as const,
            tag,
        }));
        if (showCreate) items.push({ type: 'create', name: normalizedQuery });
        return items;
    }, [filtered, showCreate, normalizedQuery]);

    useEffect(() => {
        setHighlight(0);
    }, [normalizedQuery, open]);

    const toggle = (id: number) => {
        onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
    };

    const remove = (id: number) => {
        onChange(selected.filter(x => x !== id));
    };

    const createTag = async (name: string) => {
        if (!canCreate || creating) return;
        setCreating(true);
        setCreateError(null);
        try {
            const { data } = await axios.post<Tag>(route('blog.tags.store'), { name }, {
                headers: { Accept: 'application/json' },
            });
            setOptions(prev =>
                [...prev, data].sort((a, b) => a.name.localeCompare(b.name, 'fa')),
            );
            if (!selected.includes(data.id)) {
                onChange([...selected, data.id]);
            }
            setQuery('');
            setOpen(true);
            inputRef.current?.focus();
        } catch (err: unknown) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.errors?.name?.[0]
                    ? String(err.response.data.errors.name[0])
                    : 'ایجاد برچسب ناموفق بود.';
            setCreateError(message);
        } finally {
            setCreating(false);
        }
    };

    const activateItem = (index: number) => {
        const item = menuItems[index];
        if (!item) return;
        if (item.type === 'tag') {
            toggle(item.tag.id);
            setQuery('');
            inputRef.current?.focus();
            return;
        }
        void createTag(item.name);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && query === '' && selectedTags.length > 0) {
            remove(selectedTags[selectedTags.length - 1].id);
            return;
        }

        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            setOpen(true);
            return;
        }

        if (e.key === 'Escape') {
            setOpen(false);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlight(h => (menuItems.length === 0 ? 0 : (h + 1) % menuItems.length));
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight(h => (menuItems.length === 0 ? 0 : (h - 1 + menuItems.length) % menuItems.length));
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            if (menuItems.length > 0) activateItem(highlight);
        }
    };

    return (
        <div ref={containerRef} className="relative mt-1">
            <div
                className={`flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 transition-colors ${
                    error
                        ? 'border-red-300 ring-1 ring-red-200'
                        : open
                          ? 'border-indigo-400 ring-1 ring-indigo-200'
                          : 'border-gray-300 hover:border-indigo-400'
                }`}
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {selectedTags.map(tag => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200"
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={e => {
                                e.stopPropagation();
                                remove(tag.id);
                            }}
                            className="rounded-full text-indigo-400 hover:text-indigo-700"
                            aria-label={`حذف ${tag.name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setCreateError(null);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    placeholder={selectedTags.length === 0 ? 'جستجو یا افزودن برچسب…' : 'افزودن برچسب…'}
                    className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
                />
            </div>

            {open && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {menuItems.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400">
                                {canCreate
                                    ? 'نامی تایپ کنید تا برچسب جدید ساخته شود.'
                                    : 'برچسبی یافت نشد.'}
                            </li>
                        ) : (
                            menuItems.map((item, index) => {
                                const active = index === highlight;
                                if (item.type === 'create') {
                                    return (
                                        <li key="__create">
                                            <button
                                                type="button"
                                                disabled={creating}
                                                onMouseEnter={() => setHighlight(index)}
                                                onClick={() => activateItem(index)}
                                                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm ${
                                                    active ? 'bg-indigo-50 text-indigo-700' : 'text-indigo-600 hover:bg-indigo-50'
                                                } disabled:opacity-60`}
                                            >
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                    +
                                                </span>
                                                <span>
                                                    ایجاد برچسب «{item.name}»
                                                    {creating ? '…' : ''}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                }

                                const checked = selected.includes(item.tag.id);
                                return (
                                    <li key={item.tag.id}>
                                        <button
                                            type="button"
                                            onMouseEnter={() => setHighlight(index)}
                                            onClick={() => activateItem(index)}
                                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${
                                                active ? 'bg-indigo-50 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                    checked
                                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                                        : 'border-gray-300 bg-white'
                                                }`}
                                            >
                                                {checked && (
                                                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M2.5 6.5 5 9l4.5-6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className={checked ? 'font-medium text-indigo-700' : ''}>{item.tag.name}</span>
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}

            {(error || createError) && (
                <p className="mt-1 text-xs text-red-500">{error || createError}</p>
            )}
        </div>
    );
}
