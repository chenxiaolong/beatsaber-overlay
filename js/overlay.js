const ProgressUI = (() => {
    const elems = {
        elapsedRing: document.getElementById('progress-elapsed'),
        label: document.getElementById('progress-label'),
    };

    const circleRadius = elems.elapsedRing.getAttribute('r');
    const maxDashArray = 2 * Math.PI * circleRadius;
    let timeInitial = 0;
    let timeCurrent = 0;
    let timeLast = null;
    let timeDuration = 0;
    let loopActive = false;

    const render = () => {
        if (timeCurrent === timeLast) {
            return;
        }

        const elapsed = Math.max(0, timeCurrent - timeInitial);
        const ratio = Math.min(1, timeDuration === 0 ? 0 : elapsed / timeDuration);
        const elapsedSeconds = Math.floor(elapsed / 1000);
        const seconds = elapsedSeconds % 60;
        const minutes = (elapsedSeconds - seconds) / 60;

        elems.elapsedRing.setAttribute("stroke-dasharray",
            `${ratio * maxDashArray} ${maxDashArray}`);
        elems.label.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        timeLast = timeCurrent;
    };

    const animationLoop = () => {
        if (loopActive) {
            timeCurrent = Date.now();
            render();

            requestAnimationFrame(animationLoop);
        }
    };

    render();

    return {
        setProgress(initial, current, duration) {
            if (initial !== null) {
                timeInitial = initial;
            }

            timeCurrent = current === null ? Date.now() : current;

            if (duration !== null) {
                timeDuration = duration;
            }

            render();
        },

        startTimer() {
            if (!loopActive) {
                loopActive = true;
                animationLoop();
            }
        },

        stopTimer() {
            loopActive = false;
        },

        resetTimer() {
            if (loopActive) {
                console.error('[Timer] Reset while timer is active')
            }

            timeInitial = 0;
            timeCurrent = 0;
            timeLast = null;
            timeDuration = 0;
        },
    };
})();

const OverlayUI = (() => {
    const elems = {
        // Entire overlay container
        overlay: document.getElementById('overlay'),
        // Performance container
        rank: document.getElementById('perf-rank'),
        percentage: document.getElementById('perf-percentage'),
        score: document.getElementById('perf-score'),
        combo: document.getElementById('perf-combo'),
        // Beatmap container
        image: document.getElementById('song-image'),
        titleRow: document.getElementById('song-title-row'),
        title: document.getElementById('song-title'),
        subtitle: document.getElementById('song-subtitle'),
        artistRow: document.getElementById('song-artist-row'),
        artist: document.getElementById('song-artist'),
        mapper: document.getElementById('song-mapper'),
        difficulty: document.getElementById('song-difficulty'),
        tags: document.getElementById('song-tags'),
        tagItems: {},
        bsrId: document.getElementById('song-bsr-id'),
    };

    // Create elements for all tags
    const validTags = ['BE', 'DA', 'FS', 'GN', 'IF', 'LH', 'NA', 'NB', 'NF', 'NO', 'SL', 'SS'];
    for (tag of validTags) {
        const elem = document.createElement('span');
        elem.classList.add('tag-item');
        elem.innerText = tag;
        elems.tags.appendChild(elem);
        elems.tagItems[tag] = elem;
    }

    const setVisibility = (elem, visible) => {
        if (visible) {
            elem.classList.remove('hidden');
        } else {
            elem.classList.add('hidden');
        }
    };

    return {
        showOverlay() {
            setVisibility(elems.overlay, true);
        },

        hideOverlay() {
            setVisibility(elems.overlay, false);
        },

        setScaleFactor(factor) {
            elems.overlay.style.transformOrigin = 'bottom left';
            elems.overlay.style.transform = `scale(${factor})`;
        },

        updatePerformance(data) {
            let percentage = 0;

            if (data.currentMaxScore > 0) {
                percentage = data.score / data.currentMaxScore * 100;
            }

            elems.rank.innerText = data.rank;
            elems.percentage.innerText = `${percentage.toFixed(2)}%`;
            elems.score.innerText = data.score; // add commas
            elems.combo.innerText = data.combo;
        },

        updateBeatmap(data) {
            let difficulty = data.difficulty;
            if (difficulty === 'ExpertPlus') {
                difficulty = 'Expert+';
            }

            elems.image.setAttribute('src', data.songCover
                ? `data:image/png;base64,${data.songCover}` : '');

            setVisibility(elems.titleRow, !!data.songName || !!data.songSubName);
            setVisibility(elems.title, !!data.songName);
            elems.title.innerText = data.songName;
            setVisibility(elems.subtitle, !!data.songSubName);
            elems.subtitle.innerText = data.songSubName;

            setVisibility(elems.artistRow, !!data.songAuthorName || !!data.levelAuthorName);
            setVisibility(elems.artist, !!data.songAuthorName);
            elems.artist.innerText = data.songAuthorName;
            setVisibility(elems.mapper, !!data.levelAuthorName);
            elems.mapper.innerText = `[${data.levelAuthorName}]`;

            elems.difficulty.innerText = difficulty;
        },

        updateModifiersAndSettings(mods, settings) {
            const items = [];

            // Score-impacting modifiers
            setVisibility(elems.tagItems.DA, mods.disappearingArrows);
            setVisibility(elems.tagItems.SS, mods.songSpeed === 'Slower');
            setVisibility(elems.tagItems.FS, mods.songSpeed === 'Faster');
            setVisibility(elems.tagItems.GN, mods.ghostNotes);
            setVisibility(elems.tagItems.NA, mods.noArrows);
            setVisibility(elems.tagItems.NB, mods.noBombs);
            setVisibility(elems.tagItems.NF, mods.noFail);
            setVisibility(elems.tagItems.NO, !mods.obstacles);

            // Non-score-impacting modifiers:
            setVisibility(elems.tagItems.BE, mods.batteryEnergy);
            setVisibility(elems.tagItems.IF, mods.instaFail);

            // Player settings:
            setVisibility(elems.tagItems.LH, settings.leftHanded);
            setVisibility(elems.tagItems.SL, settings.staticLights);
        },

        updateBsrId(bsrId) {
            setVisibility(elems.bsrId, !!bsrId);
            elems.bsrId.innerText = `BSR: ${bsrId}`;
        },
    };
})();