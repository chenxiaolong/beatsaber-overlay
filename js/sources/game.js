function startSource(options) {
    const socket = new WebSocket(`ws://${options.address}/socket`);

    socket.addEventListener('open', (event) => {
        console.log('[WS] Connection opened');
    });

    socket.addEventListener('close', (event) => {
        console.error(`[WS] Connection closed with status: ${event.code} (${event.reason})`);
        OverlayUI.hideOverlay();

        console.log('[WS] Attempting reconnect in 5 seconds');
        setTimeout(() => startSource(options), 5000);
    })

    socket.addEventListener('error', (event) => {
        console.error(`[WS] Error: ${event})`);
    })

    socket.addEventListener('message', (event) => {
        console.log(`Event: ${event}`)

        const bsEvent = JSON.parse(event.data);
        eventHandler(bsEvent);
    })
}