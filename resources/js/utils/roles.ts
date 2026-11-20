/** Supadmin inherits every check that targets the admin role. */
export function hasRole(roles: string[] | undefined | null, role: string): boolean {
    if (!roles?.length) return false;
    if (roles.includes(role)) return true;
    return role === 'admin' && roles.includes('supadmin');
}

export function hasAnyRole(roles: string[] | undefined | null, ...wanted: string[]): boolean {
    return wanted.some((role) => hasRole(roles, role));
}
