export const trackEvent = (category: string, action: string, name?: string, value?: number) => {
    const _paq = (window as any)._paq || [];
    _paq.push(['trackEvent', category, action, name, value]);
};