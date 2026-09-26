import type { BreakingNewsItem } from './models';

export interface NavCategory {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    thumbnail?: string | null;
    children: Array<{ id: number; name: string; slug: string; parent_id: number }>;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    mobile?: string;
    roles: string[];
    permissions: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    app: {
        name: string;
        url: string;
        locale: string;
    };
    ziggy?: Record<string, unknown> & { location: string };
    auth: {
        user: AuthUser;
    };
    flash: {
        success?: string;
        error?: string;
    };
    shopMaintenance: boolean;
    openTickets: number;
    contactUnread: number;
    navCategories: NavCategory[];
    breakingNews: BreakingNewsItem[];
    advertiseModal: AdvertiseModalContent;
    footerQuickLinks: FooterQuickLinksContent;
    footerBrand: FooterBrandContent;
    contactInfos: ContactInfoItem[];
};

export interface AdvertiseModalContent {
    title: string;
    subtitle: string;
    descriptions: string[];
    features: string[];
    hint: string;
    primary_button: { label: string; url: string };
    secondary_button: { label: string; url: string | null };
}

export interface FooterQuickLink {
    label: string;
    href: string;
}

export interface FooterQuickLinksContent {
    section_title: string;
    links: FooterQuickLink[];
}

export interface FooterBrandContent {
    html: string;
}

export type ContactInfoType = 'email' | 'whatsapp' | 'phone' | 'address';
export type ContactInfoIcon = 'building' | 'phone' | 'whatsapp' | 'email';

export interface ContactInfoItem {
    type: ContactInfoType;
    label: string;
    value: string;
    description?: string | null;
    icon?: ContactInfoIcon | null;
}
