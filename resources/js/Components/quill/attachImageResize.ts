import Quill from 'quill';

type ImageBlot = {
    format?: (name: string, value: unknown) => void;
};

function findBlot(node: Node): ImageBlot | null {
    const found = Quill.find(node);
    if (!found || found instanceof Quill) return null;
    return found as unknown as ImageBlot;
}

function blotIndex(quill: Quill, node: Node): number | null {
    const found = Quill.find(node);
    if (!found || found instanceof Quill) return null;
    try {
        return quill.getIndex(found as Parameters<Quill['getIndex']>[0]);
    } catch {
        return null;
    }
}

/**
 * Click an image in the body editor to resize, change URL, or delete it.
 * Overlay is position:fixed on document.body so Quill overflow cannot clip it.
 */
export function attachImageResize(quill: Quill): () => void {
    const root = quill.root;

    const overlay = document.createElement('div');
    overlay.className = 'rte-img-resize';
    overlay.hidden = true;
    overlay.innerHTML = `
        <div class="rte-img-resize__box"></div>
        <div class="rte-img-resize__handle rte-img-resize__handle--nw" data-dir="nw"></div>
        <div class="rte-img-resize__handle rte-img-resize__handle--ne" data-dir="ne"></div>
        <div class="rte-img-resize__handle rte-img-resize__handle--sw" data-dir="sw"></div>
        <div class="rte-img-resize__handle rte-img-resize__handle--se" data-dir="se"></div>
        <div class="rte-img-resize__toolbar" dir="rtl">
            <button type="button" data-pct="25">۲۵٪</button>
            <button type="button" data-pct="50">۵۰٪</button>
            <button type="button" data-pct="75">۷۵٪</button>
            <button type="button" data-pct="100">۱۰۰٪</button>
            <span class="rte-img-resize__sep"></span>
            <button type="button" data-action="replace">آدرس</button>
            <button type="button" data-action="delete" class="rte-img-resize__danger">حذف</button>
        </div>
    `;
    document.body.appendChild(overlay);

    let activeImg: HTMLImageElement | null = null;
    let dragging = false;
    let startX = 0;
    let startWidth = 0;
    let dragDir = 'se';
    let raf = 0;

    const editorWidth = () => Math.max(root.clientWidth - 16, 80);

    const hide = () => {
        activeImg = null;
        dragging = false;
        overlay.hidden = true;
    };

    const placeOverlay = () => {
        if (!activeImg || overlay.hidden) return;
        if (!root.contains(activeImg)) {
            hide();
            return;
        }
        const r = activeImg.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        overlay.style.left = `${r.left}px`;
        overlay.style.top = `${r.top}px`;
        overlay.style.width = `${r.width}px`;
        overlay.style.height = `${r.height}px`;
    };

    const schedulePlace = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(placeOverlay);
    };

    const show = (img: HTMLImageElement) => {
        activeImg = img;
        overlay.hidden = false;
        placeOverlay();
    };

    const applyDomWidth = (widthPx: number) => {
        if (!activeImg) return 0;
        const next = Math.max(40, Math.min(Math.round(widthPx), Math.round(editorWidth())));
        activeImg.setAttribute('width', String(next));
        activeImg.style.width = `${next}px`;
        activeImg.style.maxWidth = '100%';
        activeImg.style.height = 'auto';
        activeImg.removeAttribute('height');
        placeOverlay();
        return next;
    };

    const commitWidth = (widthPx: number) => {
        const next = applyDomWidth(widthPx);
        if (!activeImg || !next) return;

        const blot = findBlot(activeImg);
        blot?.format?.('width', String(next));

        const index = blotIndex(quill, activeImg);
        if (index !== null) {
            quill.formatText(index, 1, 'width', String(next), 'user');
        } else {
            quill.update('user');
        }
    };

    const deleteActive = () => {
        if (!activeImg) return;
        const index = blotIndex(quill, activeImg);
        if (index !== null) {
            quill.deleteText(index, 1, 'user');
        } else {
            activeImg.remove();
            quill.update('user');
        }
        hide();
    };

    const replaceActive = () => {
        if (!activeImg) return;
        const current = activeImg.getAttribute('src') || '';
        const url = window.prompt('آدرس جدید تصویر را وارد کنید:', current)?.trim();
        if (!url || url === current) return;

        const width = activeImg.getAttribute('width');
        const index = blotIndex(quill, activeImg);
        if (index === null) {
            activeImg.setAttribute('src', url);
            quill.update('user');
            return;
        }

        quill.deleteText(index, 1, 'silent');
        quill.insertEmbed(index, 'image', url, 'user');
        if (width) {
            quill.formatText(index, 1, 'width', width, 'user');
        }
        // Reselect the new image node
        const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
        const next = imgs.find((img) => img.getAttribute('src') === url) ?? null;
        if (next) {
            if (width) {
                next.setAttribute('width', width);
                next.style.width = `${width}px`;
                next.style.height = 'auto';
            }
            show(next);
        } else {
            hide();
        }
    };

    const onPointerDownCapture = (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        if (overlay.contains(target)) {
            const handle = target.closest('.rte-img-resize__handle') as HTMLElement | null;
            if (handle && activeImg) {
                e.preventDefault();
                e.stopPropagation();
                dragging = true;
                dragDir = handle.dataset.dir || 'se';
                startX = e.clientX;
                startWidth = activeImg.getBoundingClientRect().width;
                handle.setPointerCapture(e.pointerId);
            }
            return;
        }

        if (!root.contains(target)) {
            if (!overlay.hidden) hide();
            return;
        }

        if (target.closest('img') && root.contains(target.closest('img'))) {
            show(target.closest('img') as HTMLImageElement);
            return;
        }

        hide();
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!dragging || !activeImg) return;
        e.preventDefault();
        const delta = e.clientX - startX;
        const sign = dragDir.includes('w') ? -1 : 1;
        applyDomWidth(startWidth + sign * delta);
    };

    const onPointerUp = () => {
        if (!dragging || !activeImg) {
            dragging = false;
            return;
        }
        dragging = false;
        commitWidth(activeImg.getBoundingClientRect().width);
    };

    const onToolbarClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const btn = (e.target as HTMLElement | null)?.closest('button') as HTMLButtonElement | null;
        if (!btn || !activeImg) return;

        if (btn.dataset.pct) {
            commitWidth((editorWidth() * Number(btn.dataset.pct)) / 100);
            return;
        }
        if (btn.dataset.action === 'replace') {
            replaceActive();
            return;
        }
        if (btn.dataset.action === 'delete') {
            deleteActive();
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (!activeImg) return;
        if (e.key === 'Escape') {
            hide();
            return;
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
            // Only if focus is not inside an input/prompt
            const tag = (e.target as HTMLElement | null)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            e.preventDefault();
            deleteActive();
        }
    };

    document.addEventListener('pointerdown', onPointerDownCapture, true);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    overlay.querySelector('.rte-img-resize__toolbar')?.addEventListener('click', onToolbarClick as EventListener);
    document.addEventListener('keydown', onKeyDown);
    root.addEventListener('scroll', schedulePlace, true);
    window.addEventListener('scroll', schedulePlace, true);
    window.addEventListener('resize', schedulePlace);
    quill.on('text-change', schedulePlace);
    quill.on('selection-change', schedulePlace);

    return () => {
        hide();
        cancelAnimationFrame(raf);
        document.removeEventListener('pointerdown', onPointerDownCapture, true);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
        document.removeEventListener('keydown', onKeyDown);
        root.removeEventListener('scroll', schedulePlace, true);
        window.removeEventListener('scroll', schedulePlace, true);
        window.removeEventListener('resize', schedulePlace);
        quill.off('text-change', schedulePlace);
        quill.off('selection-change', schedulePlace);
        overlay.remove();
    };
}
