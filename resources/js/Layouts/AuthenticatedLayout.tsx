import logo from '../../images/gsun-texten-logo.png';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import NotificationBell, { type NotificationItem } from '@/Components/NotificationBell';

function IconDashboard() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );
}

function IconUsers() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconNotes() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    );
}

function IconReport() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M4 19h16a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
        </svg>
    );
}

function IconProfile() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function IconLogout() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}
function IconBreakingNews() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}

function IconAnnouncements() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
    );
}

function IconBlog() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    );
}

function IconGallery() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function IconAssets() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
        </svg>
    );
}

function IconTickets() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
    );
}

function IconChevron({ open }: { open: boolean }) {
    return (
        <svg
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function IconChevronsLeft() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
        </svg>
    );
}

function IconChevronsRight() {
    return (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
    );
}

function NavItem({
    href,
    active,
    icon,
    children,
    collapsed,
}: {
    href: string;
    active: boolean;
    icon?: ReactNode;
    children: ReactNode;
    collapsed?: boolean;
}) {
    return (
        <Link
            href={href}
            title={collapsed ? String(children) : undefined}
            className={`relative flex items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            } ${
                active
                    ? 'bg-rose-100 text-rose-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {active && !collapsed && (
                <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-sm bg-rose-800" />
            )}
            {icon}
            {!collapsed && children}
        </Link>
    );
}

function SubNavItem({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                    ? 'bg-rose-100 font-medium text-rose-900'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
        >
            <span className={`h-2 w-2 shrink-0 rounded-full border-2 transition-colors ${
                active ? 'border-rose-600 bg-rose-600' : 'border-gray-300 bg-transparent'
            }`} />
            {children}
        </Link>
    );
}

function SidebarNav({
    canViewUsers, usersOpen, setUsersOpen, canCreateUser,
    canAnnounce,
    canBreakingNews,
    canGallery,
    canAdmin,
    canAssets,
    canViewReports,
    canBlog, blogOpen, setBlogOpen,
    openTickets,
    shopMaintenance,
    ticketsOpen, setTicketsOpen,
    canWithdrawal,
    collapsed, setCollapsed,
}: {
    canViewUsers: boolean;
    usersOpen: boolean;
    setUsersOpen: (v: boolean) => void;
    canCreateUser: boolean;
    canAnnounce: boolean;
    canBreakingNews: boolean;
    canGallery: boolean;
    canAdmin: boolean;
    canAssets: boolean;
    canViewReports: boolean;
    canBlog: boolean;
    blogOpen: boolean;
    setBlogOpen: (v: boolean) => void;
    openTickets: number;
    shopMaintenance: boolean;
    ticketsOpen: boolean;
    setTicketsOpen: (v: boolean) => void;
    canWithdrawal: boolean;
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}) {
    function expandAndOpen(setter: (v: boolean) => void) {
        setCollapsed(false);
        setter(true);
    }

    return (
        <nav className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
                <NavItem
                    href={route('dashboard')}
                    active={!!route().current('dashboard')}
                    icon={<IconDashboard />}
                    collapsed={collapsed}
                >
                    داشبورد
                </NavItem>

                {canViewReports && (
                    <NavItem
                        href={route('reports.index')}
                        active={!!route().current('reports.*')}
                        icon={<IconReport />}
                        collapsed={collapsed}
                    >
                        گزارش گیری
                    </NavItem>
                )}

                {/* Users group */}
                {canViewUsers && (
                    <div>
                        <button
                            type="button"
                            aria-expanded={!collapsed && usersOpen}
                            aria-controls="users-submenu"
                            onClick={() => collapsed ? expandAndOpen(setUsersOpen) : setUsersOpen(!usersOpen)}
                            title={collapsed ? 'کاربران' : undefined}
                            className={`relative flex w-full items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors ${
                                collapsed ? 'justify-center px-2' : 'justify-between px-3'
                            } ${
                                route().current('users.*')
                                    ? 'bg-rose-100 text-rose-900'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            {!collapsed && route().current('users.*') && (
                                <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-sm bg-rose-800" />
                            )}
                            <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                                <IconUsers />
                                {!collapsed && 'کاربران'}
                            </span>
                            {!collapsed && <IconChevron open={usersOpen} />}
                        </button>

                        {!collapsed && (
                            <div id="users-submenu" className={`grid transition-all duration-200 ease-in-out ${usersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className="mt-1 ml-5 mr-3 space-y-0.5 border-l border-gray-200 pl-3">
                                        <SubNavItem href={route('users.index')} active={!!route().current('users.index')}>
                                            همه کاربران
                                        </SubNavItem>
                                        {canCreateUser && (
                                            <SubNavItem href={route('users.create')} active={!!route().current('users.create')}>
                                                افزودن کاربر
                                            </SubNavItem>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <NavItem
                    href={route('notes.index')}
                    active={!!route().current('notes.*')}
                    icon={<IconNotes />}
                    collapsed={collapsed}
                >
                    یادداشت‌ها
                </NavItem>

                {/* Tickets group */}
                <div>
                    <button
                        type="button"
                        onClick={() => collapsed ? expandAndOpen(setTicketsOpen) : setTicketsOpen(!ticketsOpen)}
                        title={collapsed ? 'درخواست‌های پشتیبانی' : undefined}
                        className={`relative flex w-full items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors ${
                            collapsed ? 'justify-center px-2' : 'justify-between px-3'
                        } ${
                            route().current('tickets.*')
                                ? 'bg-rose-100 text-rose-900'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        {!collapsed && route().current('tickets.*') && (
                            <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-sm bg-rose-800" />
                        )}
                        <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                            <span className="relative shrink-0">
                                <IconTickets />
                                {openTickets > 0 && collapsed && (
                                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none">
                                        {openTickets > 9 ? '9+' : openTickets}
                                    </span>
                                )}
                            </span>
                            {!collapsed && 'همه درخواست‌ها'}
                        </span>
                        {!collapsed && (
                            <span className="flex items-center gap-2">
                                {openTickets > 0 && (
                                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                        {openTickets > 99 ? '99+' : openTickets}
                                    </span>
                                )}
                                <IconChevron open={ticketsOpen} />
                            </span>
                        )}
                    </button>

                    {!collapsed && (
                        <div className={`grid transition-all duration-200 ease-in-out ${ticketsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                                <div className="mt-1 ml-5 mr-3 space-y-0.5 border-l border-gray-200 pl-3">
                                    <SubNavItem href={route('tickets.index')} active={!!route().current('tickets.index') || !!route().current('tickets.show')}>
                                        همه درخواست‌ها
                                    </SubNavItem>
                                    <SubNavItem href={route('tickets.create')} active={!!route().current('tickets.create')}>
                                        ثبت درخواست جدید
                                    </SubNavItem>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Blog group */}
                {canBlog && (
                    <div>
                        <button
                            type="button"
                            onClick={() => collapsed ? expandAndOpen(setBlogOpen) : setBlogOpen(!blogOpen)}
                            title={collapsed ? 'وبلاگ' : undefined}
                            className={`relative flex w-full items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors ${
                                collapsed ? 'justify-center px-2' : 'justify-between px-3'
                            } ${
                                route().current('blog.*') || route().current('blog.tags.*')
                                    ? 'bg-rose-100 text-rose-900'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            {!collapsed && (route().current('blog.*') || route().current('blog.tags.*')) && (
                                <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-sm bg-rose-800" />
                            )}
                            <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                                <IconBlog />
                                {!collapsed && 'وبلاگ'}
                            </span>
                            {!collapsed && <IconChevron open={blogOpen} />}
                        </button>

                        {!collapsed && (
                            <div className={`grid transition-all duration-200 ease-in-out ${blogOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className="mt-1 ml-5 mr-3 space-y-0.5 border-l border-gray-200 pl-3">
                                        <SubNavItem href={route('blog.index')} active={!!route().current('blog.index') || !!route().current('blog.create') || !!route().current('blog.edit')}>
                                            مقالات
                                        </SubNavItem>
                                        <SubNavItem href={route('blog.categories.index')} active={!!route().current('blog.categories.*')}>
                                            دسته‌بندی‌ها
                                        </SubNavItem>
                                        <SubNavItem href={route('blog.tags.index')} active={!!route().current('blog.tags.*')}>
                                            برچسب‌ها
                                        </SubNavItem>
                                        <SubNavItem href={route('blog.comments.index')} active={!!route().current('blog.comments.*')}>
                                            نظرات
                                        </SubNavItem>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {canAnnounce && (
                    <NavItem
                        href={route('announcements.index')}
                        active={!!route().current('announcements.*')}
                        icon={<IconAnnouncements />}
                        collapsed={collapsed}
                    >
                        اطلاعیه‌ها
                    </NavItem>
                )}

                {canBreakingNews && (
                    <NavItem
                        href={route('breaking-news.index')}
                        active={!!route().current('breaking-news.*')}
                        icon={<IconBreakingNews />}
                        collapsed={collapsed}
                    >
                        اخبار فوری
                    </NavItem>
                )}

                {canGallery && (
                    <NavItem
                        href={route('gallery.index')}
                        active={!!route().current('gallery.*')}
                        icon={<IconGallery />}
                        collapsed={collapsed}
                    >
                        گالری تصاویر
                    </NavItem>
                )}

                {canAssets && (
                    <NavItem
                        href={route('assets.index')}
                        active={!!route().current('assets.*')}
                        icon={<IconAssets />}
                        collapsed={collapsed}
                    >
                        رسانه‌ها
                    </NavItem>
                )}

                {canAdmin && (
                    <NavItem
                        href={route('roles.index')}
                        active={!!route().current('roles.*')}
                        icon={<></>}
                        collapsed={collapsed}
                    >
                        مدیریت نقش‌ها
                    </NavItem>
                )}

                {/* Maintenance toggle — admin only */}
                {canAdmin && (
                    <button
                        type="button"
                        title={collapsed ? (shopMaintenance ? 'غیرفعال کردن تعمیر' : 'حالت تعمیر') : undefined}
                        onClick={() => router.post(route('maintenance.toggle'), {}, { preserveScroll: true })}
                        className={`relative flex w-full items-center overflow-hidden rounded-lg py-2.5 text-sm font-medium transition-colors ${
                            collapsed ? 'justify-center px-2' : 'justify-between px-3'
                        } ${
                            shopMaintenance
                                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {!collapsed && 'حالت تعمیر'}
                        </span>
                        {!collapsed && (
                            <span className={`relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${shopMaintenance ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${shopMaintenance ? 'right-0.5' : 'left-0.5'}`} />
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* Credit card withdrawal shortcut — only for sales_retail/sales_manager with is_withdrawal enabled */}
            {canWithdrawal && (
                <div className="shrink-0 border-t border-gray-200 px-3 py-3">
                    <Link
                        href={route('shop.show', 149)}
                        title={collapsed ? 'برداشت اعتبار کارت' : undefined}
                        className={`flex items-center rounded-lg py-2.5 text-sm font-medium text-indigo-600 hover:bg-gray-100 hover:text-indigo-700 transition-colors ${
                            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                        }`}
                    >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {!collapsed && 'برداشت اعتبار کارت'}
                    </Link>
                </div>
            )}

            {/* Collapse toggle */}
            <div className="hidden lg:block shrink-0 border-t border-gray-200 px-3 py-3">
                <button
                    type="button"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'باز کردن منو' : 'بستن منو'}
                    className={`flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                        collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                    }`}
                >
                    {collapsed ? <IconChevronsLeft /> : <><IconChevronsRight /><span>بستن منو</span></>}
                </button>
            </div>
        </nav>
    );
}

function ShopDropdown() {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const openMenu = () => {
        if (btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
        }
        setOpen(true);
    };

    useEffect(() => {
        if (!open) return;
        function onOutside(e: MouseEvent) {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                btnRef.current  && !btnRef.current.contains(e.target as Node)
            ) setOpen(false);
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [open]);

    return (
        <div ref={btnRef} className="relative ml-auto">
            <div className="inline-flex rounded-md border border-[#E31F25] overflow-hidden shadow-sm">
                <Link
                    href={route('shop.index')}
                    className="inline-flex items-center gap-1.5 bg-[#E31F25]/10 px-3 py-1.5 text-sm font-medium text-[#E31F25] hover:bg-[#E31F25]/20 transition-colors"
                >
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="hidden sm:inline">فروشگاه</span>
                </Link>
                <button
                    type="button"
                    onClick={openMenu}
                    className="border-r border-[#E31F25] bg-[#E31F25]/10 px-2 py-1.5 text-[#E31F25] hover:bg-[#E31F25]/20 transition-colors"
                >
                    <svg className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {open && (
                <div
                    ref={menuRef}
                    style={{ top: pos.top, right: pos.right }}
                    className="fixed w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-[200]"
                >
                    <Link
                        href={route('shop.index')}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        فروشگاه
                    </Link>
                    <Link
                        href={route('shop.landing')}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        صفحه اصلی
                    </Link>
                </div>
            )}
        </div>
    );
}

function UserMenu({ user, displayRole }: { user: { name: string }; displayRole: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-800 text-xs font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-gray-800 leading-none">{user.name}</p>
                    {displayRole && <p className="mt-0.5 text-xs text-gray-400">{displayRole}</p>}
                </div>
                <svg className="hidden h-4 w-4 shrink-0 text-gray-400 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute end-0 top-full mt-1.5 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-50">
                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                    >
                        <IconProfile />
                        پروفایل
                    </Link>
                    <div className="my-1 h-px bg-gray-100" />
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => setOpen(false)}
                    >
                        <IconLogout />
                        خروج
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, shopMaintenance, openTickets } = usePage().props as any;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed]     = useState(false);
    const canAdmin       = !!user.roles?.includes('admin');
    const canViewReports = user.roles?.includes('admin') || user.roles?.includes('cfo');
    const canBlog        = user.roles?.includes('admin') || user.roles?.includes('writer');
    const canAssets      = canAdmin;
    const canWithdrawal  = !!user.is_withdrawal && (user.roles?.includes('sales_retail') || user.roles?.includes('sales_manager'));

    const [usersOpen, setUsersOpen]     = useState(!!route().current('users.*'));
    const [blogOpen, setBlogOpen]       = useState(!!route().current('blog.*'));
    const [ticketsOpen, setTicketsOpen] = useState(!!route().current('tickets.*'));

    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    async function fetchNotifications() {
        try {
            const { data } = await axios.get<{ unread_count: number; notifications: NotificationItem[] }>('/notifications');
            setUnreadCount(data.unread_count);
            setNotifications(data.notifications);
        } catch {}
    }

    async function markOneRead(id: string) {
        try {
            await axios.patch(`/notifications/${id}/mark-read`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    }

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30_000);
        return () => clearInterval(interval);
    }, []);

    const canViewUsers =
        user.roles?.includes('admin') || user.roles?.includes('sales_manager') || user.roles?.includes('cfo');

    const canCreateUser =
        user.roles?.includes('admin') || user.roles?.includes('cfo') || user.roles?.includes('sales_manager');

    const canAnnounce =
        user.roles?.includes('admin') || user.roles?.includes('cfo');

    const canBreakingNews = canAdmin;

    const canGallery =
        user.roles?.includes('admin') || user.roles?.includes('cfo');

    const roleLabel: Record<string, string> = {
        admin: 'مدیر کل',
        sales_manager: 'مدیر منطقه',
        sales_retail: 'نماینده',
        cfo: 'مدیر مالی',
        writer: 'نویسنده',
    };

    const displayRole = user.roles?.[0] ? (roleLabel[user.roles[0]] ?? user.roles[0]) : '';

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">

            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white border-l border-gray-200 transition-all duration-300 lg:static lg:z-auto lg:translate-x-0 ${
                    sidebarOpen ? 'w-64 translate-x-0' : 'w-64 translate-x-full'
                } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
            >
                {/* Logo */}
                <div className={`flex h-16 shrink-0 items-center border-b border-gray-200 px-4 ${collapsed ? 'justify-center' : ''}`}>
                    <Link href={route('dashboard')} className="flex items-center gap-3">
                        <img src={logo} alt="Company Logo" className="h-8 w-auto shrink-0" />
                        {!collapsed && (
                            <span className="text-lg font-bold text-gray-900">پنل فروش اعتباری</span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <SidebarNav
                    canViewUsers={canViewUsers}
                    usersOpen={usersOpen}
                    setUsersOpen={setUsersOpen}
                    canCreateUser={canCreateUser}
                    canAnnounce={canAnnounce}
                    canBreakingNews={canBreakingNews}
                    canGallery={canGallery}
                    canAdmin={canAdmin}
                    canAssets={canAssets}
                    canViewReports={canViewReports}
                    canBlog={canBlog}
                    blogOpen={blogOpen}
                    setBlogOpen={setBlogOpen}
                    openTickets={openTickets ?? 0}
                    shopMaintenance={shopMaintenance}
                    ticketsOpen={ticketsOpen}
                    setTicketsOpen={setTicketsOpen}
                    canWithdrawal={canWithdrawal}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

            </aside>

            {/* ── Main area ── */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

                {/* Top bar */}
                <div className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <ShopDropdown />
                    <div className="flex-1" />
                    <NotificationBell
                        unreadCount={unreadCount}
                        notifications={notifications}
                        onMarkOneRead={markOneRead}
                        light
                    />
                    <UserMenu user={user} displayRole={displayRole} />
                </div>

                {/* Page header */}
                {header && (
                    <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                        {header}
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-[#F5F5F5] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
                    {children}
                </main>
            </div>
        </div>
    );
}
