function asRoleList(roles: unknown): string[] {
    if (!roles) return [];
    if (Array.isArray(roles)) return roles.map(String);
    if (typeof roles === 'object') {
        return Object.values(roles as Record<string, unknown>).map(String);
    }
    return [String(roles)];
}

/** Supadmin inherits every check that targets the admin role. */
export function hasRole(roles: unknown, role: string): boolean {
    const list = asRoleList(roles);
    if (!list.length) return false;
    if (list.includes(role)) return true;
    return role === 'admin' && list.includes('supadmin');
}

export function hasAnyRole(roles: unknown, ...wanted: string[]): boolean {
    return wanted.some((role) => hasRole(roles, role));
}
