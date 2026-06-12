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
    auth: {
        user: AuthUser;
    };
    flash: {
        success?: string;
        error?: string;
    };
    shopMaintenance: boolean;
    openTickets: number;
};
