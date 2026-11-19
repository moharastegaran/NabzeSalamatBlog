import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    /** Element that defines the readable content range (usually the article) */
    targetRef: RefObject<HTMLElement | null>;
};

/**
 * Thin gradient reading progress, pinned to the bottom edge of the sticky site header.
 * Filled portion = read so far; empty track = remaining content.
 */
export default function ReadingProgressBar({ targetRef }: Props) {
    const [progress, setProgress] = useState(0);
    const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setHeaderEl(document.querySelector('header'));
    }, []);

    useEffect(() => {
        let frame = 0;

        const measure = () => {
            const el = targetRef.current;
            if (!el) {
                setProgress(0);
                return;
            }

            const rect = el.getBoundingClientRect();
            const elTop = window.scrollY + rect.top;
            const elHeight = el.offsetHeight;
            const viewH = window.innerHeight;
            const scrollable = Math.max(1, elHeight - viewH);
            const scrolled = window.scrollY - elTop;
            const next = Math.min(100, Math.max(0, (scrolled / scrollable) * 100));
            setProgress(next);
        };

        const onScrollOrResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);

        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScrollOrResize) : null;
        if (targetRef.current) ro?.observe(targetRef.current);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
            ro?.disconnect();
        };
    }, [targetRef]);

    if (!headerEl) return null;

    const rounded = Math.round(progress);
    const showGlow = progress > 0.5 && progress < 99.5;

    return createPortal(
        <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-[6px] overflow-visible bg-black/10"
            role="progressbar"
            aria-label="پیشرفت مطالعه مطلب"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={rounded}
            aria-valuetext={`${rounded}٪ مطالعه شده`}
        >
            <div
                className="reading-progress-fill relative h-full origin-right transition-[width] duration-150 ease-out"
                style={{
                    width: `${progress}%`,
                    backgroundImage:
                        'linear-gradient(to left, #F24F00 0%, #F24F00 45%, #0a9b3c 70%, #075F26 100%)',
                }}
            >
                {/* Soft bloom along the fill */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-80"
                    style={{
                        boxShadow:
                            '0 0 6px 1px rgba(242, 79, 0, 0.55), 0 0 12px 2px rgba(7, 95, 38, 0.35)',
                    }}
                />

                {/* Pulsing glow tip on the progress frontier (physical left in RTL) */}
                {showGlow && (
                    <span
                        aria-hidden="true"
                        className="reading-progress-glow absolute left-0 top-1/2 h-2.5 w-2.5 rounded-full bg-[#F24F00]"
                    />
                )}
            </div>
        </div>,
        headerEl,
    );
}
