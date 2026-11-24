type TelegramTag = {
    offset: number;
    length: number;
    id: string;
};

const escapable = new Set(['\\', '_', '*', '[', ']', '`', '(', ')', '#', '!', '-', '.', '>']);

/**
 * Turn the broadcast markdown into the visible caption plus text-link ranges.
 * Offsets are UTF-16 code units, which is what Telegram Desktop stores.
 */
export function markdownToTelegramField(markdown: string): { text: string; tags: TelegramTag[] } {
    let text = '';
    const tags: TelegramTag[] = [];
    let i = 0;

    while (i < markdown.length) {
        const ch = markdown[i];

        if (ch === '\\' && i + 1 < markdown.length && escapable.has(markdown[i + 1])) {
            text += markdown[i + 1];
            i += 2;
            continue;
        }

        if (ch === '[') {
            const closeBracket = markdown.indexOf('](', i + 1);
            const closeParen = closeBracket > i ? findLinkClose(markdown, closeBracket + 2) : -1;

            if (closeParen > closeBracket + 2) {
                const label = markdown.slice(i + 1, closeBracket);
                const url = markdown.slice(closeBracket + 2, closeParen).trim();

                if (label && (url.includes('://') || url.startsWith('mailto:'))) {
                    const offset = text.length;
                    text += label;
                    tags.push({ offset, length: label.length, id: url });
                    i = closeParen + 1;
                    continue;
                }
            }
        }

        text += ch;
        i += 1;
    }

    return { text, tags };
}

function findLinkClose(text: string, from: number): number {
    let depth = 0;

    for (let i = from; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === '\\') {
            i += 1;
        } else if (ch === '(') {
            depth += 1;
        } else if (ch === ')') {
            if (depth === 0) return i;
            depth -= 1;
        }
    }

    return -1;
}

/** QDataStream (Qt 5, big-endian) encoding of Telegram's text-link tags. */
export function serializeTelegramTags(tags: TelegramTag[]): Uint8Array {
    const bytes: number[] = [];
    writeU32(bytes, tags.length);

    for (const tag of tags) {
        writeU32(bytes, tag.offset);
        writeU32(bytes, tag.length);
        writeQtString(bytes, tag.id);
    }

    return Uint8Array.from(bytes);
}

function writeU32(out: number[], value: number) {
    out.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
}

function writeQtString(out: number[], value: string) {
    writeU32(out, value.length * 2);
    for (let i = 0; i < value.length; i += 1) {
        const code = value.charCodeAt(i);
        out.push((code >> 8) & 0xff, code & 0xff);
    }
}
