// https://stackoverflow.com/a/57888548
const fetchTimeout = (url, ms, { signal, ...options } = {}) => {
    if (!ms || ms < 0) {
        return fetch(url, { signal, ...options });
    }

    const controller = new AbortController();
    const promise = fetch(url, { signal: controller.signal, ...options });

    if (signal) {
        signal.addEventListener('abort', () => controller.abort());
    }

    const timeout = setTimeout(() => controller.abort(), ms);
    return promise.finally(() => clearTimeout(timeout));
};

const getBsrFromHash = async (hash, signal, timeout) => {
    const url = `https://beatsaver.com/api/maps/by-hash/${hash}`;
    const options = {signal, cache: 'force-cache'};
    const response = await fetchTimeout(url, timeout, options);
    if (!response.ok) {
        throw new Error(`BeatSaver API returned HTTP ${response.status} when searching for hash ${hash}`);
    }

    const data = await response.json();
    return data.key;
};

let lastHash = null;
const bsrController = new AbortController();
bsrController.signal.addEventListener('abort', () => lastHash = null);

const eventHandler = (event) => {
    // If we have information about the current map, then we must be in-game
    if (event.status.beatmap) {
        OverlayUI.updateBeatmap(event.status.beatmap);

        // The beatmap status object specifies the song start time, pause time
        // (if paused), and song duration. If the game is not paused, the pause
        // field is null. When the resume event is fired, the start field is
        // updated appropriately.
        //
        // Note that the time displayed in the overlay may not match the time
        // displayed in game:
        // - When a song starts and the scene changes to GameCore, the startSong
        //   event is fired off before FadeInOutController is done.
        // - When unpausing the game, ResumeFromPause.anim completes before the
        //   resume event is fired off.
        ProgressUI.setProgress(event.status.beatmap.start,
            event.status.beatmap.paused,
            event.status.beatmap.length);

        // Both operations are no-ops if the timer is already in that state
        if (event.status.beatmap.paused) {
            ProgressUI.stopTimer();
        } else {
            ProgressUI.startTimer();
        }

        // Query for bsr code
        if (lastHash != event.status.beatmap.songHash) {
            lastHash = event.status.beatmap.songHash;

            // Clear the BSR ID before showing the overlay so we don't have
            // to use a callback that fires at the end of hideOverlay's
            // animation.
            OverlayUI.updateBsrId(null);

            getBsrFromHash(event.status.beatmap.songHash, bsrController.signal, 5000)
                .then((bsrId) => {
                    console.log(`[Handler] BSR ID for ${event.status.beatmap.songHash} is ${bsrId}`);
                    OverlayUI.updateBsrId(bsrId);
                })
                .catch((error) => console.error(`[Handler] Error when querying BeatSaver:`, error));
        }
    }
    if (event.status.performance) {
        OverlayUI.updatePerformance(event.status.performance);
    }
    if (event.status.mod && event.status.playerSettings) {
        OverlayUI.updateModifiersAndSettings(event.status.mod, event.status.playerSettings);
    }

    switch (event.event) {
        case 'hello':
        case 'songStart':
            // For hello, we might already be in game upon connection
            if (event.status.beatmap && event.status.performance) {
                OverlayUI.showOverlay();
            }
            break;
        case 'menu':
            bsrController.abort();
            OverlayUI.hideOverlay();
            ProgressUI.stopTimer();
            ProgressUI.resetTimer();
            break;
    }
};