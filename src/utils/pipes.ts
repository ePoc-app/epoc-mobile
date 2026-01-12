export function denormalize(value: any, record?: any): any {
    // map array of ids with corresponding object values
    if (value && record) {
        return value.map((itemId) => {
            const item = record[itemId];
            item.id = itemId;
            return item;
        });
        // map normalized array with corresponding object values
    } else if (value) {
        return Object.entries(value).map((entry: any) => {
            const item = entry[1];
            item.id = entry[0];
            return item;
        });
    }

    return [];
}

export function srcConvert(value: string, rootFolder: string): string {
    const regex = /src=['"](?!http)([^'"]*)['"]/g;
    return value.replace(/assets\/demo\//g, '').replace(regex, `src='${rootFolder}$1'`);
}

export function removeSecableSpace(value: string): string {
    if (value) {
        return value.replace(/\s([?:;!])/g, '\xa0$1');
    }
    return value;
}

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
