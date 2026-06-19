import type { AdBanner } from '@/types/models';

interface Props {
    banners: AdBanner[];
    className?: string;
}

export default function AdBannerSlot({ banners, className = '' }: Props) {
    if (!banners.length) return null;

    return (
        <div className={`space-y-3 ${className}`}>
            {banners.map(banner =>
                banner.image ? (
                    banner.external_url ? (
                        <a
                            key={banner.id}
                            href={banner.external_url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="block overflow-hidden"
                            title={banner.title}
                        >
                            <img
                                src={`/storage/${banner.image}`}
                                alt={banner.title}
                                className="w-full object-cover"
                            />
                        </a>
                    ) : (
                        <div key={banner.id} className="overflow-hidden" title={banner.title}>
                            <img
                                src={`/storage/${banner.image}`}
                                alt={banner.title}
                                className="w-full object-cover"
                            />
                        </div>
                    )
                ) : null
            )}
        </div>
    );
}
