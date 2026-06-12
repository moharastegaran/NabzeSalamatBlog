import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">
                <div className="mb-6 flex flex-col items-center">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-auto" />
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
