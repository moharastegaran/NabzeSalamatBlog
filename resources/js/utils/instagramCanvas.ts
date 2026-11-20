export const IG_POST_SIZE = { width: 1080, height: 1350 } as const;
export const IG_STORY_SIZE = { width: 1080, height: 1920 } as const;

export type InstagramFormat = 'post' | 'story';

export type InstagramContent = {
    title: string;
    /** Phrase inside `title` rendered in accent green */
    highlightedTitle: string;
    description: string;
    /** Phrase inside `description` rendered in highlight color */
    highlightedDescription: string;
    category: string;
    url: string;
    /** Site base URL for post footer (globe + host) */
    appUrl: string;
    /** Primary accent (title highlight, accent bar, CTA) */
    color: string;
    /** Description highlight (peach in the reference) */
    highlightColor: string;
    /** Story page background */
    backgroundColor: string;
    featuredImageUrl: string | null;
    logoUrl: string;
};

const BRAND_GREEN = '#042F10';
const PUBLICATION_NAME = 'نبض خبر';
const PUBLICATION_TAGLINE = 'پایگاه خبری و تحلیلی در حوزه سلامت و دارو';
const CTA_LABEL = 'مشاهده کامل خبر';

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

function hexToRgba(hex: string, alpha: number): string {
    const raw = hex.replace('#', '');
    const full = raw.length === 3
        ? raw.split('').map((c) => c + c).join('')
        : raw.padEnd(6, '0').slice(0, 6);
    const n = Number.parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawCoverImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
): void {
    const scale = Math.max(width / img.width, height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const dx = x + (width - w) / 2;
    const dy = y + (height - h) / 2;
    ctx.drawImage(img, dx, dy, w, h);
}

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
): string[] {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) return [];

    const words = normalized.split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (ctx.measureText(next).width <= maxWidth) {
            current = next;
            continue;
        }
        if (current) lines.push(current);
        current = word;
    }
    if (current) lines.push(current);
    return lines;
}

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
): void {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}

type TextSegment = { text: string; highlighted: boolean };

function splitHighlighted(text: string, highlight: string): TextSegment[] {
    const needle = highlight.trim();
    if (!needle || !text.includes(needle)) {
        return [{ text, highlighted: false }];
    }
    const parts = text.split(needle);
    const segments: TextSegment[] = [];
    parts.forEach((part, i) => {
        if (part) segments.push({ text: part, highlighted: false });
        if (i < parts.length - 1) segments.push({ text: needle, highlighted: true });
    });
    return segments.length ? segments : [{ text, highlighted: false }];
}

/** Mark words whose glyph range overlaps the highlight substring inside `line`. */
function wordHighlightFlags(line: string, highlight: string): boolean[] {
    const words = line.split(/\s+/).filter(Boolean);
    const flags = words.map(() => false);
    const needle = highlight.trim();
    if (!needle) return flags;

    const idx = line.indexOf(needle);
    if (idx < 0) return flags;

    const hiEnd = idx + needle.length;
    let searchFrom = 0;
    for (let i = 0; i < words.length; i++) {
        const start = line.indexOf(words[i], searchFrom);
        if (start < 0) continue;
        const end = start + words[i].length;
        searchFrom = end;
        if (end > idx && start < hiEnd) flags[i] = true;
    }
    return flags;
}

/**
 * Draw RTL paragraph with optional inline highlight color.
 * `align: 'justify'` stretches word gaps on every line except the last.
 */
function drawHighlightedParagraph(
    ctx: CanvasRenderingContext2D,
    opts: {
        text: string;
        highlight: string;
        xRight: number;
        y: number;
        maxWidth: number;
        lineHeight: number;
        font: string;
        color: string;
        highlightColor: string;
        maxLines?: number;
        align?: 'right' | 'justify';
    },
): { bottom: number; top: number; lineCount: number } {
    const {
        text,
        highlight,
        xRight,
        y,
        maxWidth,
        lineHeight,
        font,
        color,
        highlightColor,
        maxLines = 8,
        align = 'right',
    } = opts;

    ctx.font = font;
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.textBaseline = 'alphabetic';

    let lines = wrapText(ctx, text, maxWidth);
    if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        const last = lines[maxLines - 1];
        lines[maxLines - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : '…';
    }

    const top = y - lineHeight * 0.75;
    let cursorY = y;
    const naturalSpace = ctx.measureText(' ').width;

    lines.forEach((line, lineIndex) => {
        const words = line.split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            cursorY += lineHeight;
            return;
        }

        const flags = wordHighlightFlags(line, highlight);
        const isLast = lineIndex === lines.length - 1;
        const wordsWidth = words.reduce((sum, w) => sum + ctx.measureText(w).width, 0);

        let gap = naturalSpace;
        if (align === 'justify' && !isLast && words.length > 1) {
            gap = Math.max(naturalSpace, (maxWidth - wordsWidth) / (words.length - 1));
        }

        if (align !== 'justify' || words.length === 1) {
            const segments = splitHighlighted(line, highlight);
            let x = xRight;
            for (const seg of segments) {
                ctx.fillStyle = seg.highlighted ? highlightColor : color;
                ctx.fillText(seg.text, x, cursorY);
                x -= ctx.measureText(seg.text).width;
            }
        } else {
            let x = xRight;
            for (let i = 0; i < words.length; i++) {
                ctx.fillStyle = flags[i] ? highlightColor : color;
                ctx.fillText(words[i], x, cursorY);
                x -= ctx.measureText(words[i]).width;
                if (i < words.length - 1) x -= gap;
            }
        }

        cursorY += lineHeight;
    });

    return { bottom: cursorY, top, lineCount: lines.length };
}

/** Split a line into segments using one or more highlight phrases (`|`-separated). */
function splitMultiHighlighted(line: string, highlight: string): TextSegment[] {
    const needles = highlight
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);

    if (!needles.length) return [{ text: line, highlighted: false }];

    type Hit = { start: number; end: number };
    const hits: Hit[] = [];
    for (const needle of needles) {
        let from = 0;
        while (from < line.length) {
            const idx = line.indexOf(needle, from);
            if (idx < 0) break;
            const end = idx + needle.length;
            const overlaps = hits.some((h) => idx < h.end && end > h.start);
            if (!overlaps) hits.push({ start: idx, end });
            from = idx + needle.length;
        }
    }
    hits.sort((a, b) => a.start - b.start);

    if (!hits.length) return [{ text: line, highlighted: false }];

    const segments: TextSegment[] = [];
    let cursor = 0;
    for (const hit of hits) {
        if (hit.start > cursor) {
            segments.push({ text: line.slice(cursor, hit.start), highlighted: false });
        }
        segments.push({ text: line.slice(hit.start, hit.end), highlighted: true });
        cursor = hit.end;
    }
    if (cursor < line.length) {
        segments.push({ text: line.slice(cursor), highlighted: false });
    }
    return segments;
}

/**
 * RTL headline with orange rounded “highlight boxes” (white text on accent pills).
 */
function drawBoxedHighlightParagraph(
    ctx: CanvasRenderingContext2D,
    opts: {
        text: string;
        highlight: string;
        xRight: number;
        y: number;
        maxWidth: number;
        lineHeight: number;
        font: string;
        color: string;
        boxColor: string;
        maxLines?: number;
    },
): { bottom: number; top: number; lineCount: number } {
    const {
        text,
        highlight,
        xRight,
        y,
        maxWidth,
        lineHeight,
        font,
        color,
        boxColor,
        maxLines = 4,
    } = opts;

    ctx.font = font;
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.textBaseline = 'alphabetic';

    let lines = wrapText(ctx, text, maxWidth);
    if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        const last = lines[maxLines - 1];
        lines[maxLines - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : '…';
    }

    const top = y - lineHeight * 0.78;
    let cursorY = y;
    const boxPadX = 12;
    const boxPadBottom = 2;
    const boxGap = 10; // clear space so the pill does not cover neighboring title glyphs

    for (const line of lines) {
        const segments = splitMultiHighlighted(line, highlight);
        let x = xRight;
        for (const seg of segments) {
            if (!seg.text) continue;
            const w = ctx.measureText(seg.text).width;
            if (seg.highlighted) {
                // Keep the whole pill to the left of the cursor (no overlap into prior text)
                const boxW = w + boxPadX * 2;
                const boxX = x - boxW;
                const boxY = cursorY - lineHeight * 0.72;
                const boxH = lineHeight + boxPadBottom;
                ctx.fillStyle = boxColor;
                drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 9);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.fillText(seg.text, x - boxPadX, cursorY);
                x = boxX - boxGap;
            } else {
                ctx.fillStyle = color;
                ctx.fillText(seg.text, x, cursorY);
                x -= w;
            }
        }
        cursorY += lineHeight;
    }

    return { bottom: cursorY, top, lineCount: lines.length };
}

/* ─── Post template (editorial white reference) ─────────────────────────── */

async function paintPost(
    canvas: HTMLCanvasElement,
    content: InstagramContent,
): Promise<void> {
    const { width, height } = IG_POST_SIZE;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unavailable');

    const bg = content.backgroundColor || '#FFFFFF';
    const titleGreen = content.color || BRAND_GREEN;
    const boxOrange = '#F24F00';

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const padX = 64;
    const contentRight = width - padX;
    const maxTextWidth = width - padX * 2;

    // ── Header ────────────────────────────────────────────────────────────
    const headerTop = 48;
    let headerBottom = headerTop + 80;

    const categoryLabel = content.category.trim() || PUBLICATION_NAME;

    try {
        const logo = await loadImage(content.logoUrl);
        const logoH = 72;
        const logoW = (logo.width / logo.height) * logoH;
        ctx.drawImage(logo, padX, headerTop, logoW, logoH);
        headerBottom = headerTop + logoH;
    } catch {
        ctx.font = '800 36px PeydaWebFaNum, Tahoma, sans-serif';
        ctx.fillStyle = titleGreen;
        ctx.textAlign = 'left';
        ctx.fillText(categoryLabel, padX, headerTop + 44);
    }

    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#374151';
    ctx.font = '700 26px PeydaWebFaNum, Tahoma, sans-serif';
    ctx.fillText(categoryLabel, contentRight, headerTop + 34);
    ctx.font = '500 18px PeydaWebFaNum, Tahoma, sans-serif';
    ctx.fillStyle = '#6b7280';
    const tagLines = wrapText(ctx, PUBLICATION_TAGLINE, 380);
    let tagY = headerTop + 62;
    for (const line of tagLines.slice(0, 2)) {
        ctx.fillText(line, contentRight, tagY);
        tagY += 24;
    }
    headerBottom = Math.max(headerBottom, tagY);

    // ── Headline (green + orange highlight boxes) ─────────────────────────
    let y = headerBottom + 48;
    const titleSize = 50;
    const titleLH = 79;
    const titleRightInset = 0; // extra space from the right wrapper edge
    const titleBlock = drawBoxedHighlightParagraph(ctx, {
        text: content.title || 'عنوان خبر',
        highlight: content.highlightedTitle,
        xRight: contentRight - titleRightInset,
        y: y + titleSize,
        maxWidth: maxTextWidth - titleRightInset,
        lineHeight: titleLH,
        font: `800 ${titleSize}px PeydaWebFaNum, Tahoma, sans-serif`,
        color: titleGreen,
        boxColor: boxOrange,
        maxLines: 3,
    });
    y = titleBlock.bottom + 28;

    // ── Featured image (inset, rounded) ───────────────────────────────────
    const footerReserve = 110;
    const imgPad = padX;
    const imgX = imgPad;
    const imgY = y;
    const imgW = width - imgPad * 2;
    const imgH = Math.max(280, height - imgY - footerReserve);
    const imgRadius = 28;

    ctx.save();
    drawRoundedRect(ctx, imgX, imgY, imgW, imgH, imgRadius);
    ctx.clip();

    if (content.featuredImageUrl) {
        try {
            const img = await loadImage(content.featuredImageUrl);
            drawCoverImage(ctx, img, imgX, imgY, imgW, imgH);
        } catch {
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(imgX, imgY, imgW, imgH);
        }
    } else {
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(imgX, imgY, imgW, imgH);
    }
    ctx.restore();

    // Soft inner edge so rounded crop feels clean
    ctx.save();
    drawRoundedRect(ctx, imgX, imgY, imgW, imgH, imgRadius);
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // ── Footer: globe + app_url | line → secondary circle at end ──────────
    const footerMidY = height - 52;
    const footerEndX = width - padX;
    const circleR = 6;

    let appHost = 'www.nabzsn.ir';
    try {
        const raw = (content.appUrl || content.url || '').trim();
        if (raw) {
            const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
            appHost = new URL(withProto).host || appHost;
        }
    } catch {
        appHost = (content.appUrl || '').replace(/^https?:\/\//, '').split('/')[0] || appHost;
    }

    ctx.font = '600 22px PeydaWebFaNum, Tahoma, sans-serif';
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    ctx.textBaseline = 'middle';

    const globeR = 11;
    const globeX = padX;
    const globeCx = globeX + globeR;

    // Worldwide / globe icon
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(globeCx, footerMidY, globeR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(globeCx, footerMidY, globeR * 0.45, globeR, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(globeX, footerMidY);
    ctx.lineTo(globeX + globeR * 2, footerMidY);
    ctx.stroke();

    // app_url host
    const urlX = globeX + globeR * 2 + 12;
    ctx.fillStyle = '#4b5563';
    ctx.fillText(appHost, urlX, footerMidY + 1);
    const urlW = ctx.measureText(appHost).width;

    // Line from after URL to the far end of the wrapper, circle centered on the tip
    const lineStartX = urlX + urlW + 18;
    const lineEndX = footerEndX - circleR;
    if (lineEndX > lineStartX) {
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lineStartX, footerMidY);
        ctx.lineTo(lineEndX, footerMidY);
        ctx.stroke();
    }

    // Secondary accent circle at the middle-end of the line
    ctx.fillStyle = boxOrange;
    ctx.beginPath();
    ctx.arc(footerEndX - circleR, footerMidY, circleR, 0, Math.PI * 2);
    ctx.fill();

    ctx.textBaseline = 'alphabetic';
}

/* ─── Story template (editorial white reference) ────────────────────────── */

async function paintStory(
    canvas: HTMLCanvasElement,
    content: InstagramContent,
): Promise<void> {
    const { width, height } = IG_STORY_SIZE;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unavailable');

    const bg = content.backgroundColor || '#FFFFFF';
    const accent = content.color || BRAND_GREEN;
    const descHighlight = content.highlightColor || '#E8A88A';

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const padX = 72;
    const contentRight = width - padX;
    const maxTextWidth = width - padX * 2;

    // ── Header ────────────────────────────────────────────────────────────
    const headerTop = 64;
    let logoBottom = headerTop + 90;

    try {
        const logo = await loadImage(content.logoUrl);
        const logoH = 88;
        const logoW = (logo.width / logo.height) * logoH;
        ctx.drawImage(logo, padX, headerTop, logoW, logoH);
        logoBottom = headerTop + logoH;
    } catch {
        ctx.font = '900 40px PeydaWebFaNum, Tahoma, sans-serif';
        ctx.fillStyle = accent;
        ctx.textAlign = 'left';
        ctx.direction = 'rtl';
        ctx.fillText('نبض سلامت', padX, headerTop + 48);
    }

    // Publication name + tagline (upper-right)
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#5b6270';
    ctx.font = '600 26px PeydaWebFaNum, Tahoma, sans-serif';
    ctx.fillText(PUBLICATION_NAME, contentRight, headerTop + 38);

    ctx.font = '600 26px PeydaWebFaNum, Tahoma, sans-serif';
    ctx.fillStyle = '#5b6270';
    const tagLines = wrapText(ctx, PUBLICATION_TAGLINE, 420);
    let tagY = headerTop + 72;
    for (const line of tagLines.slice(0, 2)) {
        ctx.fillText(line, contentRight, tagY);
        tagY += 30;
    }

    // Thin vertical separator near the right header block
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(contentRight + 12, headerTop + 12);
    ctx.lineTo(contentRight + 12, headerTop + 96);
    ctx.stroke();

    // ── Headline ──────────────────────────────────────────────────────────
    let y = Math.max(logoBottom, tagY) + 72;
    const titleFontSize = 52;
    const titleLH = 70;

    const titleBlock = drawHighlightedParagraph(ctx, {
        text: content.title || 'عنوان خبر',
        highlight: content.highlightedTitle,
        xRight: contentRight,
        y: y + titleFontSize,
        maxWidth: maxTextWidth,
        lineHeight: titleLH,
        font: `800 ${titleFontSize}px PeydaWebFaNum, Tahoma, sans-serif`,
        color: '#111827',
        highlightColor: accent,
        maxLines: 4,
        align: 'justify',
    });
    y = titleBlock.bottom + 36;

    // ── Description + vertical accent ─────────────────────────────────────
    const descFontSize = 30;
    const descLH = 48;
    const descMaxWidth = maxTextWidth - 28;
    const descRight = contentRight - 28;

    if (content.description.trim()) {
        const descStartBaseline = y + descFontSize;
        const descBlock = drawHighlightedParagraph(ctx, {
            text: content.description,
            highlight: content.highlightedDescription,
            xRight: descRight,
            y: descStartBaseline,
            maxWidth: descMaxWidth,
            lineHeight: descLH,
            font: `600 ${descFontSize}px PeydaWebFaNum, Tahoma, sans-serif`,
            color: '#374151',
            highlightColor: descHighlight,
            maxLines: 6,
            align: 'justify',
        });

        // Vertical green accent on the right of the description
        const lineTop = descBlock.top;
        const lineBottom = descBlock.bottom - descLH * 0.35;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(contentRight - 4, lineTop);
        ctx.lineTo(contentRight - 4, lineBottom);
        ctx.stroke();

        y = descBlock.bottom + 40;
    }

    // ── CTA button ────────────────────────────────────────────────────────
    ctx.font = '700 28px PeydaWebFaNum, Tahoma, sans-serif';
    ctx.direction = 'rtl';
    const ctaText = CTA_LABEL;
    const ctaTextW = ctx.measureText(ctaText).width;
    const iconGap = 16;
    const iconSize = 26;
    const ctaPadX = 36;
    const ctaH = 64;
    const ctaW = ctaTextW + iconSize + iconGap + ctaPadX * 2;
    const ctaX = padX;
    const ctaY = y;

    ctx.fillStyle = accent;
    drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, 14);
    ctx.fill();

    // External-link icon (left side of button content in LTR box = visual left)
    const iconX = ctaX + ctaPadX;
    const iconY = ctaY + (ctaH - iconSize) / 2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.strokeRect(iconX + 4, iconY + 8, iconSize - 12, iconSize - 12);
    ctx.beginPath();
    ctx.moveTo(iconX + iconSize - 6, iconY + 6);
    ctx.lineTo(iconX + iconSize - 6, iconY + 14);
    ctx.moveTo(iconX + iconSize - 6, iconY + 6);
    ctx.lineTo(iconX + iconSize - 14, iconY + 6);
    ctx.moveTo(iconX + 10, iconY + iconSize - 10);
    ctx.lineTo(iconX + iconSize - 6, iconY + 6);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(ctaText, ctaX + ctaW - ctaPadX, ctaY + ctaH / 2 + 1);
    ctx.textBaseline = 'alphabetic';

    // ── Featured image + Instagram safe-zone bottom padding ───────────────
    // Meta Story boxing: keep chrome margins; image continues into safeBottom
    // with a gradient that fades the page background into the photo.
    const safeTop = Math.round(height * 0.1);
    const safeBottom = Math.round(height * 0.1);
    // Start image 3% higher → +3% featured_image height; shrink top gradient by 3%
    const imageTop = Math.max(height * 0.52, safeTop + height * 0.25);
    const imageBottom = height - safeBottom;
    const imageHeight = Math.max(120, height - imageTop);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, imageTop, width, imageHeight);
    ctx.clip();

    if (content.featuredImageUrl) {
        try {
            const img = await loadImage(content.featuredImageUrl);
            drawCoverImage(ctx, img, 0, imageTop, width, imageHeight);
        } catch {
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(0, imageTop, width, imageHeight);
        }
    } else {
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, imageTop, width, imageHeight);
    }
    ctx.restore();

    // Hide the hard top edge of the image under opaque bg, then soft-fade downward
    const edgeCover = Math.max(28, Math.round(height * 0.018));
    ctx.fillStyle = bg;
    ctx.fillRect(0, imageTop - 1, width, edgeCover + 2);

    const fadeH = Math.max(120, Math.min(360, imageHeight * 0.62) - height * 0.03);
    const fadeStart = imageTop + edgeCover * 0.35;
    const topFade = ctx.createLinearGradient(0, fadeStart, 0, imageTop + fadeH);
    topFade.addColorStop(0, bg);
    topFade.addColorStop(0.18, hexToRgba(bg, 0.94));
    topFade.addColorStop(0.36, hexToRgba(bg, 0.72));
    topFade.addColorStop(0.55, hexToRgba(bg, 0.45));
    topFade.addColorStop(0.75, hexToRgba(bg, 0.2));
    topFade.addColorStop(0.9, hexToRgba(bg, 0.06));
    topFade.addColorStop(1, hexToRgba(bg, 0));
    ctx.fillStyle = topFade;
    ctx.fillRect(0, fadeStart, width, imageTop + fadeH - fadeStart);

    // safeBottom: longer blurry fade bottom → top (solid 4% pad, then soft ease into image)
    if (safeBottom > 0) {
        const solidPad = height * 0.04;
        const blurExtra = Math.min(280, imageHeight * 0.4);
        const fadeTop = Math.max(imageTop, imageBottom - blurExtra);
        const fadeSpan = height - fadeTop;
        const solidStop = Math.min(0.9, solidPad / fadeSpan);

        const safeFade = ctx.createLinearGradient(0, height, 0, fadeTop);
        safeFade.addColorStop(0, bg);
        safeFade.addColorStop(solidStop, bg);
        safeFade.addColorStop(solidStop + (1 - solidStop) * 0.18, hexToRgba(bg, 0.88));
        safeFade.addColorStop(solidStop + (1 - solidStop) * 0.38, hexToRgba(bg, 0.62));
        safeFade.addColorStop(solidStop + (1 - solidStop) * 0.58, hexToRgba(bg, 0.38));
        safeFade.addColorStop(solidStop + (1 - solidStop) * 0.78, hexToRgba(bg, 0.16));
        safeFade.addColorStop(1, hexToRgba(bg, 0));
        ctx.fillStyle = safeFade;
        ctx.fillRect(0, fadeTop, width, fadeSpan);
    }
}

export async function renderInstagramCanvas(
    canvas: HTMLCanvasElement,
    format: InstagramFormat,
    content: InstagramContent,
): Promise<void> {
    if (format === 'story') {
        await paintStory(canvas, content);
    } else {
        await paintPost(canvas, content);
    }
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) reject(new Error('Canvas export failed'));
            else resolve(blob);
        }, type);
    });
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function slugifyFilename(value: string): string {
    return value
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]+/g, '')
        .slice(0, 48) || 'instagram';
}
