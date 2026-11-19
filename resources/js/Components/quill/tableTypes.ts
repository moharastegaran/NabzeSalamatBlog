import type Quill from 'quill';

export type QuillTableModule = {
    insertTable: (rows: number, columns: number) => void;
    insertRowAbove: () => void;
    insertRowBelow: () => void;
    insertColumnLeft: () => void;
    insertColumnRight: () => void;
    deleteRow: () => void;
    deleteColumn: () => void;
    deleteTable: () => void;
    getTable: (
        range?: { index: number; length: number } | null,
    ) => [unknown, unknown, unknown, number] | [null, null, null, -1];
};

export type TableStyleOptions = {
    header: boolean;
    striped: boolean;
};

type TableRowBlot = {
    children: {
        head: TableCellBlot | null;
    };
};

type TableCellBlot = {
    length: () => number;
    next: TableCellBlot | null;
};

type TableBlot = {
    rows: () => TableRowBlot[];
};

export function getTableModule(quill: Quill): QuillTableModule | null {
    const mod = quill.getModule('table');
    return mod ? (mod as QuillTableModule) : null;
}

export function isSelectionInTable(quill: Quill): boolean {
    const mod = getTableModule(quill);
    if (!mod) return false;
    const [table] = mod.getTable();
    return table != null;
}

/** Apply header / striped look via Quill formats so styles survive save/reload. */
export function applyTableStyles(quill: Quill, options: TableStyleOptions): void {
    const mod = getTableModule(quill);
    if (!mod) return;
    const [table] = mod.getTable() as [TableBlot | null, unknown, unknown, number];
    if (!table) return;

    const rows = table.rows();
    rows.forEach((row, rowIndex) => {
        let cell = row.children.head;
        while (cell) {
            const index = quill.getIndex(cell as Parameters<Quill['getIndex']>[0]);
            const length = cell.length();
            if (length > 0) {
                if (options.header && rowIndex === 0) {
                    quill.formatText(index, length, {
                        bold: true,
                        background: '#EEF2FF',
                        color: '#312E81',
                    }, 'user');
                } else if (options.striped && rowIndex % 2 === 1) {
                    quill.formatText(index, length, 'background', '#F9FAFB', 'user');
                }
            }
            cell = cell.next;
        }
    });
}

export function insertStyledTable(
    quill: Quill,
    rows: number,
    columns: number,
    styles: TableStyleOptions,
): void {
    const mod = getTableModule(quill);
    if (!mod) return;

    if (!quill.getSelection()) {
        quill.setSelection(quill.getLength(), 0, 'silent');
    }

    mod.insertTable(rows, columns);

    if (styles.header || styles.striped) {
        // Selection lands in first cell after insert
        requestAnimationFrame(() => applyTableStyles(quill, styles));
    }
}
