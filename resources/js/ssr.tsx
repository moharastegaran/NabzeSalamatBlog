import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route as ziggyRoute } from 'ziggy-js';
import { Config as ZiggyConfig } from 'ziggy-js';

const primaryTitle = 'پایگاه خبری نبض سلامت';
const secondaryTitle = 'تپش آگاهی و امید در مسیر سلامت جامعه';
const siteTitle = `${primaryTitle} - ${secondaryTitle}`;

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (!title || title === siteTitle) ? siteTitle : `${title} - ${siteTitle}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            const ziggy = (page.props as { ziggy?: ZiggyConfig & { location: string } }).ziggy;

            // Make Ziggy's route() available during SSR (Blade @routes only exists in the browser).
            // Guard missing ziggy/routes (e.g. error pages) so SSR does not throw mid-render.
            globalThis.route = ((name: string, params: unknown, absolute: boolean, config: ZiggyConfig) => {
                const merged = {
                    ...(ziggy ?? { url: '/', port: null, defaults: {}, routes: {} }),
                    ...config,
                    location: new URL(ziggy?.location ?? config?.url ?? 'http://localhost'),
                } as ZiggyConfig & { location: URL };

                if (!merged.routes) {
                    merged.routes = {};
                }

                try {
                    return ziggyRoute(name, params as never, absolute, merged);
                } catch {
                    return typeof name === 'string' ? `/${name.replace(/\./g, '/')}` : '/';
                }
            }) as typeof ziggyRoute;

            return <App {...props} />;
        },
    }),
);
