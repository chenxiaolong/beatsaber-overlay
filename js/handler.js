let resetProgress = true;

const mapEventHandler = (event) => {
    OverlayUI.updateTitle(event.SongName, event.SongSubName);
    OverlayUI.updateAuthor(event.SongAuthor, event.Mapper);
    OverlayUI.updateImage(event.coverImage);
    // Reset progress to 0 after overlay was hidden
    let currentTime = null;
    if (resetProgress) {
        resetProgress = false;
        currentTime = 0;
    }
    ProgressUI.updateProgress(currentTime, event.Length, false);

    const tags = [];

    if (event.MapType !== 'Standard') {
        tags.push(event.MapType);
    }

    let difficulty = event.Difficulty;
    if (difficulty === 'ExpertPlus') {
        difficulty = 'Expert+';
    }
    if (event.CustomDifficultyLabel
            && event.CustomDifficultyLabel != event.Difficulty
            && event.CustomDifficultyLabel != difficulty) {
        difficulty += `: ${event.CustomDifficultyLabel}`
    }
    tags.push(difficulty);

    if (event.PracticeMode) {
        let text = 'Practice';
        if (event.PracticeModeModifiers
                && event.PracticeModeModifiers.songSpeedMul) {
            text += `: ${event.PracticeModeModifiers.songSpeedMul.toFixed(2)}x`
        }
        tags.push(text);
    }

    const modifiers = {
        // Score-impacting modifiers
        'DA': event.Modifiers.disappearingArrows,
        'FS': event.Modifiers.fasterSong,
        'GN': event.Modifiers.ghostNotes,
        'NA': event.Modifiers.noArrows,
        'NB': event.Modifiers.noBombs,
        'NW': event.Modifiers.noWalls,
        'SFS': event.Modifiers.superFastSong,
        'SS': event.Modifiers.slowerSong,
        // Sometimes score-impacting modifiers
        //'NF': event.Modifiers.noFailOn0Energy,
        // Non-score-impacting modifiers
        '1L': event.Modifiers.oneLife,
        '4L': event.Modifiers.fourLives,
        'SA': event.Modifiers.strictAngles,
        'SN': event.Modifiers.smallNotes,
        'PM': event.Modifiers.proMode,
        'ZM': event.Modifiers.zenMode,
        // Player settings (not supported by BSDataPuller yet)
        //'LH': <left handed mode>
        //'SL': <static lights>
    };
    for (const key of Object.keys(modifiers).sort()) {
        if (modifiers[key]) {
            tags.push(key);
        }
    }

    if (event.BSRKey) {
        tags.push(`BSR: ${event.BSRKey}`);
    }

    OverlayUI.updateTags(tags);

    if (event.InLevel) {
        OverlayUI.showOverlay();
    } else {
        OverlayUI.hideOverlay();
        resetProgress = true;
    }
};

const liveEventHandler = (event) => {
    OverlayUI.updatePerformance(
        event.Accuracy,
        event.ScoreWithMultipliers,
        event.Rank,
        event.Combo,
        event.FullCombo,
    );
    ProgressUI.updateProgress(event.TimeElapsed, null, true);
};
