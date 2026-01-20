// src/vue-matomo.d.ts
declare module 'vue-matomo' {
    import { Plugin } from 'vue';
    const VueMatomo: Plugin;
    export default VueMatomo;
}

// This allows you to use this.$matomo in Options API
// or access it via global properties
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $matomo: any;
    }
}

// Matomo uses a global _paq array for commands
interface Window {
    _paq: any[];
}