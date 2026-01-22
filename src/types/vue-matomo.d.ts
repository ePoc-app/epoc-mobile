// src/vue-matomo.d.ts
declare module 'vue-matomo' {
    import { Plugin } from 'vue';
    const VueMatomo: Plugin;
    export default VueMatomo;
}

// Matomo uses a global _paq array for commands
interface Window {
    _paq: any[];
}
