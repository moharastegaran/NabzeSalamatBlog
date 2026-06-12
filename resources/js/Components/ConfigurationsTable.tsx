export interface ConfigRow { key: string; value: string; }

export function parseConfigRows(configurations: Record<string, unknown> | null | undefined): ConfigRow[] {
    if (!configurations || typeof configurations !== 'object' || Array.isArray(configurations)) {
        return [{ key: '', value: '' }];
    }
    const entries = Object.entries(configurations);
    return entries.length > 0
        ? entries.map(([key, value]) => ({ key, value: String(value ?? '') }))
        : [{ key: '', value: '' }];
}

export function serializeConfigRows(rows: ConfigRow[]): string | null {
    const filled = rows.filter(r => r.key.trim() !== '');
    if (filled.length === 0) return null;
    const obj = Object.fromEntries(filled.map(r => [r.key.trim(), r.value]));
    return JSON.stringify(obj);
}

const CELL_INPUT = 'w-full rounded border border-gray-200 py-1.5 px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono';

export default function ConfigurationsTable({
    rows,
    onChange,
    error,
}: {
    rows: ConfigRow[];
    onChange: (rows: ConfigRow[]) => void;
    error?: string;
}) {
    const update = (index: number, field: 'key' | 'value', val: string) =>
        onChange(rows.map((r, i) => (i === index ? { ...r, [field]: val } : r)));

    const remove = (index: number) => {
        const next = rows.filter((_, i) => i !== index);
        onChange(next.length > 0 ? next : [{ key: '', value: '' }]);
    };

    const add = () => onChange([...rows, { key: '', value: '' }]);

    return (
        <div>
            <div className="overflow-hidden rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-5/12 px-3 py-2 text-right text-xs font-medium text-gray-500">کلید</th>
                            <th className="w-6/12 px-3 py-2 text-right text-xs font-medium text-gray-500">مقدار</th>
                            <th className="w-1/12 px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {rows.map((row, i) => (
                            <tr key={i}>
                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={row.key}
                                        onChange={e => update(i, 'key', e.target.value)}
                                        placeholder="merchant_id"
                                        className={CELL_INPUT}
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={row.value}
                                        onChange={e => update(i, 'value', e.target.value)}
                                        placeholder="value..."
                                        className={CELL_INPUT}
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => remove(i)}
                                        disabled={rows.length === 1 && row.key === '' && row.value === ''}
                                        className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-30 transition-colors"
                                        title="حذف ردیف"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                type="button"
                onClick={add}
                className="mt-2 flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                افزودن ردیف
            </button>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
