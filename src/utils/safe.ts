export type SafeType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';

export function safe(value: any, type: SafeType, prefix: string = ''): string {
    value = !value || value.startsWith('http') || value.startsWith('capacitor') ? value : prefix + value;

    switch (type) {
        case 'html':
            return value;
        case 'style':
            return value;
        case 'script':
            return value;
        case 'url':
            return value;
        case 'resourceUrl':
            return value;
        default:
            throw new Error(`Invalid safe type specified: ${type}`);
    }
}
