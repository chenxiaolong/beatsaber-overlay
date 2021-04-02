function startSourceWithEndpoint(options, endpoint, handler) {
    const uri = `ws://${options.address}/BSDataPuller/${endpoint}`;
    const socket = new WebSocket(uri);
    const prefix = `[WS/${endpoint}] `

    console.log(`${prefix}Connecting to ${uri}`);

    socket.addEventListener('open', (event) => {
        console.log(`${prefix}Connection opened`);
    });

    socket.addEventListener('close', (event) => {
        console.error(`${prefix}Connection closed with status: ${event.code} (${event.reason})`);
        OverlayUI.hideOverlay();

        console.log(`${prefix}Attempting reconnect in 5 seconds`);
        setTimeout(() => startSourceWithEndpoint(options, endpoint, handler), 5000);
    });

    socket.addEventListener('error', (event) => {
        console.error(`${prefix}Error: `, event);
    });

    socket.addEventListener('message', (event) => {
        console.log(`${prefix}Event: `, event);

        const bsEvent = JSON.parse(event.data);
        handler(bsEvent);
    });
}

function startSource(options) {
    startSourceWithEndpoint(options, 'MapData', mapEventHandler);
    startSourceWithEndpoint(options, 'LiveData', liveEventHandler);
}
