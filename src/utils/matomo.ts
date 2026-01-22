const isDev = import.meta.env.DEV || import.meta.env.VITE_APP_MODE === 'preview';

// Track a Page View
export const trackPageView = (url?: string, title?: string) => {
    if (isDev) {
        console.log('Matomo tracking disabled in dev mode, logging instead');
        console.log('trackPageView', url, title);
        return;
    }
    if (window._paq) {
        if (url) window._paq.push(['setCustomUrl', url]);
        if (title) window._paq.push(['setDocumentTitle', title]);
        window._paq.push(['trackPageView']);
    }
};

// Track a Custom Event
export const trackEvent = (category: string, action: string, name?: string, value?: number) => {
    if (isDev) {
        console.log('Matomo tracking disabled in dev mode, logging instead');
        console.log('trackEvent', category, action, name, value);
        return;
    }
    if (window._paq) {
        console.log('trackEvent', category, action, name, value);
        window._paq.push(['trackEvent', category, action, name, value]);
    }
};