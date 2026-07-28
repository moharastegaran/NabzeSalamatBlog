import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route as ziggyRoute } from 'ziggy-js';
import { Config as ZiggyConfig } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'نبض سلامت';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (!title || title === appName) ? appName : `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            const ziggy = (page.props as { ziggy?: ZiggyConfig & { location: string } }).ziggy;

            // Make Ziggy's route() available during SSR (Blade @routes only exists in the browser).
            globalThis.route = ((name, params, absolute, config) =>
                ziggyRoute(name, params as never, absolute, {
                    ...(ziggy ?? {}),
                    location: new URL(ziggy?.location ?? 'http://localhost'),
                    ...config,
                })) as typeof ziggyRoute;

            return <App {...props} />;
        },
    }),
);
