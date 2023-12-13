const uid = document.currentScript.getAttribute('uid') || location.hash.substring(1);
const pluginId = uid.split('-')[0];
const embedId = uid.split('-')[1];
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
})

window.addEventListener('message', (message) => {
    plugin.receive(message.data);
}, false);