const uid = document.currentScript.getAttribute('uid');
window.ePoc = {
    pluginId: uid,
    emit: (data) => {
        parent.postMessage({pluginId: uid, ...data}, '*');
    },
    onLoad: () => {}
}

window.addEventListener('message', (message) => {
    if (message.data.event === 'load') {
        console.log('load plugin api', message)
        parent.postMessage({pluginId: uid, event: 'loaded', config: ePoc.onLoad(message.data.context)}, '*');
    }
}, false);