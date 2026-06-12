export interface User {
    id: number;
    name: string;
    email: string;
    mobile?: string;
    melli_code?: string;
    city_id?: number;
    city?: City;
    is_suspended: boolean;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface Banking {
    id: number;
    parent_id?: number;
    name: string;
    description?: string;
    img?: string;
    impact_factor?: number;
    period?: number;
    ship_after_days?: number;
    is_active: boolean;
    parent?: Banking;
    payment_plans?: Banking[];
}

export interface Province {
    id: number;
    name: string;
    cities: City[];
}

export interface City {
    id: number;
    name: string;
    province_id: number;
}

export interface Asset {
    id: number;
    name: string;
    file_name: string;
    path: string;
    disk: string;
    mime_type: string;
    size: number;
    type: 'image' | 'video' | 'audio' | 'document';
    alt: string | null;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface BlogCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number;
    icon?: string | null;
    thumbnail?: string | null;
    parent?: BlogCategory;
    children?: BlogCategory[];
    posts_count?: number;
    children_count?: number;
}

export interface BlogTag {
    id: number;
    name: string;
    slug: string;
}

export interface BlogComment {
    id: number;
    blog_post_id: number;
    name: string;
    email: string;
    body: string;
    is_approved: boolean;
    created_at: string;
    post?: Pick<BlogPost, 'id' | 'title' | 'slug'>;
}

export interface BlogPost {
    id: number;
    author_id: number;
    blog_category_id?: number;
    title: string;
    slug: string;
    excerpt?: string;
    body: string;
    featured_image?: string;
    status: 'draft' | 'published';
    published_at?: string;
    views: number;
    created_at: string;
    updated_at: string;
    author?: Pick<User, 'id' | 'name'>;
    category?: Pick<BlogCategory, 'id' | 'name' | 'slug'>;
    categories?: Pick<BlogCategory, 'id' | 'name'>[];
    tags?: BlogTag[];
    approved_comments?: BlogComment[];
    comments_count?: number;
    approved_comments_count?: number;
}

export type GalleryEvent = 'seminar' | 'exhibition';

export interface GalleryItem {
    id: number;
    event: GalleryEvent;
    city_id: number;
    img: string;
    year: number;
    month: number;
    created_at: string;
    city?: Pick<City, 'id' | 'name'>;
}

export type TicketStatus     = 'open' | 'in_progress' | 'closed';
export type TicketDepartment = 'technical' | 'financial' | 'support';

export interface TicketMessage {
    id: number;
    ticket_id: number;
    user_id: number;
    body: string;
    is_staff: boolean;
    created_at: string;
    user?: Pick<User, 'id' | 'name'>;
}

export interface TicketAttachment {
    id: number;
    ticket_id: number;
    user_id: number;
    original_name: string;
    path: string;
    mime_type: string;
    size: number;
    created_at: string;
}

export interface Ticket {
    id: number;
    user_id: number;
    to_user_id?: number;
    assigned_to?: number;
    title: string;
    department: TicketDepartment;
    status: TicketStatus;
    closed_at?: string;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name'>;
    to_user?: Pick<User, 'id' | 'name'>;
    assignee?: Pick<User, 'id' | 'name'>;
    messages?: TicketMessage[];
    attachments?: TicketAttachment[];
    messages_count?: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url?: string; label: string; active: boolean }[];
    from: number;
    to: number;
}
