export const generateUid = () => ((Math.random() + 1).toString(36).substring(3));
export const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        h = h * 31 + char;
    }
    return h.toString(36).substring(0, 6).toUpperCase();
}
