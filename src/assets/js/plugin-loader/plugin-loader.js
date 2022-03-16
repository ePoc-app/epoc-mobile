const pluginLoader = (function () {
    return {
        load: async function (src) {
            return await import(src)
        }
    }
})();