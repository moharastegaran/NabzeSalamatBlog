import { Head } from '@inertiajs/react';
import ShopLayout from '@/Layouts/ShopLayout';

export default function BlogShow() {
    return (
        <ShopLayout>
            <Head title="مقاله | به زودی" />
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
                <h1 className="text-4xl font-bold text-gray-800">به زودی</h1>
                <p className="text-lg text-gray-500">این بخش به زودی راه‌اندازی می‌شود.</p>
            </div>
        </ShopLayout>
    );
}
