import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import type { PageProps } from '@/types';

function FlashWatcher() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) toast.error(flash.error);
    }, [flash.error]);

    return null;
}

export default function FlashToast() {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                    },
                }}
            />
            <FlashWatcher />
        </>
    );
}
