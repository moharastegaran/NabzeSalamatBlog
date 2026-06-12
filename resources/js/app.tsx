import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<ErrorBoundary><App {...props} /></ErrorBoundary>);
    },
    progress: {
        color: '#4B5563',
    },
});
