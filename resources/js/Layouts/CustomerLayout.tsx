import BlogLayout from '@/Layouts/BlogLayout';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { PageProps } from '@/types';
import fadedLogo from '../../images/faded-logo.png'

// ── Icons ──────────────────────────────────────────────────────────────────

function IconActivities() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

function IconOrders() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 2.0498H4.0498L6.7098 14.4698C6.80738 14.9247 7.06048 15.3313 7.42552 15.6197C7.79056 15.908 8.24471 16.0602 8.7098 16.0498H18.4898C18.945 16.0491 19.3863 15.8931 19.7408 15.6076C20.0954 15.3222 20.3419 14.9243 20.4398 14.4798L22.0898 7.0498H5.1198" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
    );
}

function IconAddress() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function IconUserInfo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
    );
}

function IconLogout() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M16 17L21 12L16 7" stroke="#075F26" stroke-width="2" stroke-linejoin="round"/>
            <path d="M21 12H9" stroke="#075F26" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#075F26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

// ── Sidebar nav item ───────────────────────────────────────────────────────

function NavItem({
    href,
    icon,
    active = false,
    danger = false,
    isPost = false,
    children,
}: {
    href: string;
    icon: ReactNode;
    active?: boolean;
    danger?: boolean;
    isPost?: boolean;
    children: ReactNode;
}) {
    const base = 'flex items-center gap-4 px-5 py-3.5 text-sm font-medium transition-colors w-full rounded-2xl';

    if (danger) {
        return (
            <Link
                href={href}
                method="post"
                as="button"
                className={`${base} text-[#0b1a10] hover:bg-red-50 hover:text-red-600`}
            >
                <span className="text-[#075F26] shrink-0 text-base font-normal">{icon}</span>
                {children}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className={`${base} relative ${active ? 'bg-[#075F26] text-white font-semibold' : 'text-[#0b1a10] hover:bg-gray-50'}`}
        >
            <span className={`shrink-0 ${active ? 'text-white' : 'text-[#075F26]'}`}>{icon}</span>
            {children}
        </Link>
    );
}

// ── Layout ─────────────────────────────────────────────────────────────────

export default function CustomerLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <BlogLayout>
            <div className="max-w-shop mx-auto px-4 sm:px-6 lg:px-0 py-8">

                <div className="flex ml-auto mb-12 mt-0">
                    <div className="flex flex-row items-center gap-0 lg:mr-20 mr-0" dir="ltr">
                        <img src={fadedLogo} alt="جی سان" className="h-16 w-16 rounded-full shrink-0 object-contain" />
                        <div className="flex flex-col justify-end gap-1" dir="rtl">
                            <p className="text-base font-medium text-[#0B1A10] text-right">خوش آمدید</p>
                            <p className="text-xl font-bold text-[#0B1A10] text-right" dir="ltr">
                                حساب کاربری
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ── Sidebar (right in RTL) ── */}
                    <aside className="w-full lg:w-72 shrink-0 rounded-3xl bg-[#F2F2F2] shadow-sm ring-1 ring-gray-100 p-6 mb-4">

                        {/* User card — image left, content right */}
                        <div className="bg-white rounded-t-2xl border-b-2 border-[#D5D5D5] mb-5 px-5 py-3">
                            <div className="flex flex-row justify-end items-center gap-3" dir="ltr">
                                <div className="flex flex-col gap-1" dir="rtl">
                                    <p className="text-right text-base font-bold text-[#0B1A10]">{user.name}</p>
                                    {user.mobile && (
                                        <p className="text-right text-sm font-normal text-[#0B1A10]" dir="ltr">
                                            {user.mobile}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="overflow-hidden">
                            <NavItem
                                href={route('customer.activities')}
                                icon={<IconActivities />}
                                active={route().current('customer.activities')}
                            >
                                فعالیت‌ها
                            </NavItem>
                            <NavItem
                                href={route('customer.panel')}
                                icon={<IconOrders />}
                                active={route().current('customer.panel')}
                            >
                                سفارش‌ها
                            </NavItem>
                            <NavItem
                                href={route('customer.address')}
                                icon={<IconAddress />}
                                active={route().current('customer.address')}
                            >
                                آدرس
                            </NavItem>
                            <NavItem
                                href={route('customer.profile')}
                                icon={<IconUserInfo />}
                                active={route().current('customer.profile')}
                            >
                                جزئیات حساب
                            </NavItem>
                            <NavItem href={route('logout')} icon={<IconLogout />} danger>
                                خروج
                            </NavItem>
                        </nav>
                    </aside>

                    {/* ── Main content (left in RTL) ── */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>

                </div>
            </div>
        </BlogLayout>
    );
}
