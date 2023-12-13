const uid = document.currentScript.getAttribute('uid') || location.hash.substring(1);

window.ePoc = {
    pluginId: uid,
    emit: (event, payload) => {
        parent.postMessage({pluginId: uid, event, payload}, '*');
    },
    emitToEmbeds: (payload) => {
        parent.postMessage({pluginId: uid, event: 'to-embed', payload}, '*');
    },
    onLoad: () => {},
    onEmbed: () => {},
    receive: () => {}
}

window.addEventListener('message', (message) => {
    if (message.data.event === 'load') {
        const config = ePoc.onLoad(message.data.context);
        parent.postMessage({pluginId: uid, event: 'loaded', config }, '*');
    } else if (message.data.event === 'embed') {
        ePoc.onEmbed(message.data);
    } else {
        ePoc.receive(message.data);
    }
}, false);