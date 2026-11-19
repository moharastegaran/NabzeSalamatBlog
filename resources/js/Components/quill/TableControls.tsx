import { useEffect, useRef, useState } from 'react';
import type Quill from 'quill';
import {
    applyTableStyles,
    getTableModule,
    insertStyledTable,
    type TableStyleOptions,
} from '@/Components/quill/tableTypes';

const MAX_GRID = 8;

type Props = {
    quill: Quill | null;
    open: boolean;
    inTable: boolean;
    onClose: () => void;
};

export default function TableControls({ quill, open, inTable, onClose }: Props) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState({ rows: 3, cols: 3 });
    const [styles, setStyles] = useState<TableStyleOptions>({
        header: true,
        striped: false,
    });

    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            if (!panelRef.current?.contains(e.target as Node)) onClose();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open || !quill) return null;

    const insert = (rows: number, cols: number) => {
        insertStyledTable(quill, rows, cols, styles);
        onClose();
    };

    const run = (fn: () => void) => {
        fn();
        quill.focus();
    };

    const mod = getTableModule(quill);

    return (
        <div ref={panelRef} className="rte-table-panel" dir="rtl">
            {!inTable ? (
                <>
                    <div className="rte-table-panel__title">درج جدول</div>
                    <p className="rte-table-panel__hint">
                        {hover.rows.toLocaleString('fa-IR')} × {hover.cols.toLocaleString('fa-IR')}
                    </p>
                    <div
                        className="rte-table-grid"
                        onMouseLeave={() => setHover({ rows: 3, cols: 3 })}
                    >
                        {Array.from({ length: MAX_GRID }, (_, r) => (
                            <div key={r} className="rte-table-grid__row">
                                {Array.from({ length: MAX_GRID }, (_, c) => {
                                    const active = r < hover.rows && c < hover.cols;
                                    return (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`rte-table-grid__cell${active ? ' is-active' : ''}`}
                                            onMouseEnter={() => setHover({ rows: r + 1, cols: c + 1 })}
                                            onClick={() => insert(r + 1, c + 1)}
                                            aria-label={`${r + 1} در ${c + 1}`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="rte-table-styles">
                        <label className="rte-table-styles__item">
                            <input
                                type="checkbox"
                                checked={styles.header}
                                onChange={e => setStyles(s => ({ ...s, header: e.target.checked }))}
                            />
                            <span>ردیف عنوان</span>
                        </label>
                        <label className="rte-table-styles__item">
                            <input
                                type="checkbox"
                                checked={styles.striped}
                                onChange={e => setStyles(s => ({ ...s, striped: e.target.checked }))}
                            />
                            <span>راه‌راه</span>
                        </label>
                    </div>
                </>
            ) : (
                <>
                    <div className="rte-table-panel__title">ویرایش جدول</div>
                    <div className="rte-table-actions">
                        <button type="button" className="rte-table-actions__btn" disabled={!mod} onClick={() => mod && run(() => mod.insertRowAbove())}>
                            ردیف بالا
                        </button>
                        <button type="button" className="rte-table-actions__btn" disabled={!mod} onClick={() => mod && run(() => mod.insertRowBelow())}>
                            ردیف پایین
                        </button>
                        <button type="button" className="rte-table-actions__btn" disabled={!mod} onClick={() => mod && run(() => mod.insertColumnRight())}>
                            ستون راست
                        </button>
                        <button type="button" className="rte-table-actions__btn" disabled={!mod} onClick={() => mod && run(() => mod.insertColumnLeft())}>
                            ستون چپ
                        </button>
                        <button type="button" className="rte-table-actions__btn" disabled={!mod} onClick={() => mod && run(() => mod.deleteRow())}>
                            حذف ردیف
                        </button>
                        <button type="button" className="rte-table-actions__btn" disabled={!mod} onClick={() => mod && run(() => mod.deleteColumn())}>
                            حذف ستون
                        </button>
                        <button
                            type="button"
                            className="rte-table-actions__btn"
                            disabled={!mod}
                            onClick={() =>
                                run(() =>
                                    applyTableStyles(quill, { header: true, striped: false }),
                                )
                            }
                        >
                            استایل عنوان
                        </button>
                        <button
                            type="button"
                            className="rte-table-actions__btn"
                            disabled={!mod}
                            onClick={() =>
                                run(() =>
                                    applyTableStyles(quill, { header: false, striped: true }),
                                )
                            }
                        >
                            استایل راه‌راه
                        </button>
                        <button
                            type="button"
                            className="rte-table-actions__btn rte-table-actions__btn--danger"
                            disabled={!mod}
                            onClick={() => {
                                if (!mod) return;
                                run(() => mod.deleteTable());
                                onClose();
                            }}
                        >
                            حذف جدول
                        </button>
                    </div>
                    <p className="rte-table-panel__hint">
                        برای رنگ متن/پس‌زمینه سلول از دکمه‌های رنگ نوار ابزار استفاده کنید.
                    </p>
                </>
            )}
        </div>
    );
}
