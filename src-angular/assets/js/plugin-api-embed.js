window.plugin = {
    pluginId,
    embedId,
    emit: (event, payload) => {
        parent.postMessage({pluginId, embedId, event, payload}, '*');
    },
    receive: () => {}
}

window.addEventListener('load', () =>  {
    parent.postMessage({pluginId, embedId, event: 'embed-loaded'}, '*');

    // Get the height of the iframe content
    var iframeHeight = document.documentElement.scrollHeight;

    // Send a message to the parent window with the height
    parent.postMessage({ pluginId, embedId, event: 'setIframeHeight', height: iframeHeight }, '*');
})

const resizeObserver = new ResizeObserver(() => {
    // Get the height of the iframe content
    var iframeHeight = document.documentElement.scrollHeight;

    // Send a message to the parent window with the height
    parent.postMessage({pluginId, embedId, event: 'setIframeHeight', height: iframeHeight}, '*')
})

resizeObserver.observe(document.documentElement)

window.addEventListener('message', (message) => {
    plugin.receive(message.data);
}, false);