import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve('resources/js'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5175,
        watch: {
            usePolling: true,
            interval: 500,
            ignored: ['**/vendor/**', '**/storage/**', '**/public/build/**'],
        },
        hmr: {
            host: 'localhost',
            // Host-mapped port (Windows Hyper-V often blocks 5175)
            clientPort: 5210,
            port: 5175,
        },
    },
    define: {
        'process.env': {},
        global: {},
    },
});
