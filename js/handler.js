const eventHandler = (event) => {
    // If we have information about the current map, then we must be in-game
    if (event.status.beatmap) {
        OverlayUI.updateBeatmap(event.status.beatmap);

        // The beatmap status object specifies the song start time, pause time
        // (if paused), and song duration. If the game is not paused, the pause
        // field is null. When the resume event is fired, the start field is
        // updated appropriately.
        ProgressUI.setProgress(event.status.beatmap.start,
            event.status.beatmap.paused,
            event.status.beatmap.length);

        // Both operations are no-ops if the timer is already in that state
        if (event.status.beatmap.paused) {
            ProgressUI.stopTimer();
        } else {
            ProgressUI.startTimer();
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
            // May already be in game upon connection
            if (event.status.beatmap && event.status.performance) {
                OverlayUI.showOverlay();
            }
            break;
        case 'menu':
            OverlayUI.hideOverlay();
            ProgressUI.stopTimer();
            ProgressUI.resetTimer();
            break;
        case 'songStart':
            OverlayUI.showOverlay();
            break;
    }
};