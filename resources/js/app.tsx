import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Component, ErrorInfo, ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';

const primaryTitle = 'پایگاه خبری نبض سلامت';
const secondaryTitle = 'تپش آگاهی و امید در مسیر سلامت جامعه';
const siteTitle = `${primaryTitle} - ${secondaryTitle}`;

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
    state = { error: null };
    static getDerivedStateFromError(error: Error) { return { error }; }
    componentDidCatch(error: Error, info: ErrorInfo) { console.error('React error:', error, info); }
    render() {
        if (this.state.error) {
            const e = this.state.error as Error;
            return (
                <div style={{ padding: 32, fontFamily: 'monospace', direction: 'ltr' }}>
                    <h2 style={{ color: 'red' }}>خطای React</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', background: '#fee', padding: 16, borderRadius: 4 }}>
                        {e.message}{'\n\n'}{e.stack}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

createInertiaApp({
    title: (title) => (!title || title === siteTitle) ? siteTitle : `${title} - ${siteTitle}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        hydrateRoot(el, <ErrorBoundary><App {...props} /></ErrorBoundary>);
    },
    progress: {
        color: '#4B5563',
    },
});
