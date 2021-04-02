function startSource(options) {
    // Load mock events
    const elem = document.createElement('script');
    elem.setAttribute('src', `js/sources/mock_events.js`);
    elem.addEventListener('load', () => {
        if (!mockEvents) {
            throw '[Mock] No mock events available';
        }

        const playEvents = () => {
            for (const [i, event] of mockEvents.entries()) {
                if (options.mockLog) {
                    console.log(`[Mock] Scheduling event [${i}] at ${event.time}ms`);
                }

                // Fire off the event at approximately the right time
                setTimeout(() => {
                    if (options.mockLog) {
                        console.log(`[Mock] Current event: [${i}] = `, event.data);
                    }

                    switch (event.endpoint) {
                        case 'MapData':
                            mapEventHandler(event.data);
                            break;
                        case 'LiveData':
                            liveEventHandler(event.data);
                            break;
                        default:
                            console.error(`Unknown endpoint: ${event.endpoint}`);
                            break;
                    }
                }, event.time);
            }

            setTimeout(() => {
                if (options.mockLog) {
                    console.log('[Mock] Reached last event; Looping again');
                }
                playEvents();
            }, mockEvents[mockEvents.length - 1].time + 1000);
        }

        playEvents();
    });
    document.body.appendChild(elem);
}