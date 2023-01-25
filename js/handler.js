let resetProgress = true;

const mapEventHandler = (event) => {
    // Ignore initial startup event
    if (!event.Modifiers) {
        return;
    }

    OverlayUI.updateTitle(event.SongName, event.SongSubName);
    OverlayUI.updateAuthor(event.SongAuthor, event.Mapper);
    OverlayUI.updateImage(event.CoverImage);
    // Reset progress to 0 after overlay was hidden
    let currentTime = null;
    if (resetProgress) {
        resetProgress = false;
        currentTime = 0;
    }
    ProgressUI.updateProgress(currentTime, event.Duration, false);

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
                && event.PracticeModeModifiers.SongSpeedMul) {
            text += `: ${event.PracticeModeModifiers.SongSpeedMul.toFixed(2)}x`
        }
        tags.push(text);
    }

    const modifiers = {
        // Score-impacting modifiers
        'DA': event.Modifiers.DisappearingArrows,
        'FS': event.Modifiers.FasterSong,
        'GN': event.Modifiers.GhostNotes,
        'NA': event.Modifiers.NoArrows,
        'NB': event.Modifiers.NoBombs,
        'NW': event.Modifiers.NoWalls,
        'SFS': event.Modifiers.SuperFastSong,
        'SS': event.Modifiers.SlowerSong,
        // Sometimes score-impacting modifiers
        //'NF': event.Modifiers.NoFailOn0Energy,
        // Non-score-impacting modifiers
        '1L': event.Modifiers.OneLife,
        '4L': event.Modifiers.FourLives,
        'SA': event.Modifiers.StrictAngles,
        'SN': event.Modifiers.SmallNotes,
        'PM': event.Modifiers.ProMode,
        'ZM': event.Modifiers.ZenMode,
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
        event.Misses,
    );
    ProgressUI.updateProgress(event.TimeElapsed, null, true);
};
