import { useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';

export interface SelectOption {
    value: number | string;
    label: string;
    image?: string;
}

interface Props {
    options: SelectOption[];
    value: number | string | '';
    onChange: (value: number | string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SelectInput({
    options,
    value,
    onChange,
    placeholder = '-- Select --',
    disabled = false,
    className = '',
}: Props) {
    const [query, setQuery] = useState('');

    const hasImages = options.some((o) => o.image !== undefined);
    const selected = value !== '' ? (options.find((o) => o.value === value) ?? null) : null;
    const showThumb = hasImages && !!selected?.image && query === '';

    const filtered =
        query === ''
            ? options
            : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox
            value={selected}
            onChange={(opt) => {
                setQuery('');
                if (opt) onChange(opt.value);
            }}
            disabled={disabled}
        >
            {/* Trigger */}
            <div className={`relative w-full ${className}`}>
                {showThumb && (
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <img src={selected!.image} alt="" className="h-6 w-6 rounded object-cover" />
                    </div>
                )}
                <ComboboxInput
                    className={`block w-full rounded-md border border-gray-200 bg-white py-1.5 pl-9 text-sm text-gray-800 shadow-sm placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${showThumb ? 'pr-10' : 'pr-3'} py-2`}
                    displayValue={(opt: SelectOption | null) => opt?.label ?? ''}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => setQuery('')}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <ComboboxButton className="absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500 hover:text-gray-500 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </ComboboxButton>
            </div>

            {/* Dropdown */}
            <ComboboxOptions
                anchor="bottom start"
                className="z-50 max-h-72 w-[var(--input-width)] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none empty:hidden"
            >
                {filtered.length === 0 ? (
                    <div className="px-4 py-2 italic text-gray-500">نتیجه‌ای برای "{query}" یافت نشد.</div>
                ) : (
                    filtered.map((opt) => (
                        <ComboboxOption
                            key={opt.value}
                            value={opt}
                            className="group flex cursor-default select-none items-center gap-2.5 px-3 py-2 text-gray-800 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                        >
                            {/* Checkmark — always reserves space; visible only when selected */}
                            <span className="flex h-4 w-4 flex-none items-center justify-center text-indigo-600 group-data-[focus]:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="hidden h-4 w-4 group-data-[selected]:block"
                                    aria-hidden="true"
                                >
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                            </span>

                            {/* Thumbnail — only rendered when options carry images */}
                            {hasImages && (
                                <div className="h-20 w-20 flex-none overflow-hidden rounded bg-gray-50">
                                    {opt.image ? (
                                        <img src={opt.image} alt="" className="h-full w-full object-contain" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-300" aria-hidden="true">
                                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Label */}
                            <span className="min-w-0 flex-1 group-data-[selected]:font-semibold">
                                {opt.label}
                            </span>
                        </ComboboxOption>
                    ))
                )}
            </ComboboxOptions>
        </Combobox>
    );
}
