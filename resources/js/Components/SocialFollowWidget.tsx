import { SOCIAL_LINKS } from '@/constants/socials';

type Props = {
    variant?: 'buttons' | 'circles';
    className?: string;
};

export default function SocialFollowWidget({ variant = 'buttons', className = '' }: Props) {
    if (variant === 'circles') {
        return (
            <div className={`flex justify-around pt-1 ${className}`}>
                {SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={social.key}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1.5 group"
                        >
                            <div className={`w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors duration-200 ${social.hoverColor}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] text-gray-500 group-hover:text-[#F24F00] transition-colors">
                                {social.label}
                            </span>
                        </a>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`flex gap-2 ${className}`}>
            {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                    <a
                        key={social.key}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-1 flex-col items-center gap-1.5 py-3 hover:opacity-90 transition-opacity ${social.buttonClass}`}
                    >
                        <Icon className="h-5 w-5" variant="onDark" />
                        <span className="text-[11px] font-medium">{social.label}</span>
                    </a>
                );
            })}
        </div>
    );
}
