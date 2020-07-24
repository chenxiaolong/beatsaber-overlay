function startSource(options) {
    // Load mock events
    const elem = document.createElement('script');
    elem.setAttribute('src', `js/sources/mock_events.js`);
    elem.addEventListener('load', () => {
        if (!mockEvents) {
            throw '[Mock] No mock events available';
        }

        const playEvents = () => {
            // Easiest deep copy
            const events = JSON.parse(JSON.stringify(mockEvents));

            // Compute offset for all timestamps
            const offset = Date.now() - events[0].time;

            for (const [i, event] of events.entries()) {
                // Apply offsets to all timestamps
                event.time += offset;

                if (event.status.beatmap) {
                    event.status.beatmap.start += offset;

                    if (event.status.beatmap.paused) {
                        event.status.beatmap.paused += offset;
                    }
                }

                const diff = event.time - events[0].time;
                if (options.mockLog) {
                    console.log(`[Mock] Scheduling event [${i}] at ${diff}ms`);
                }

                // Fire off the event at approximately the right time
                setTimeout(() => {
                    if (options.mockLog) {
                        console.log(`[Mock] Current event: [${i}] = ${event.event}`);
                    }
                    eventHandler(event);
                }, diff);
            }

            setTimeout(() => {
                if (options.mockLog) {
                    console.log('[Mock] Reached last event; Looping again');
                }
                playEvents();
            }, events[events.length - 1].time - events[0].time + 1000);
        }

        playEvents();
    });
    document.body.appendChild(elem);
}