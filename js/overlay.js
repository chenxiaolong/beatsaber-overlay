const ProgressUI = (() => {
    const elems = {
        elapsedRing: document.getElementById('progress-elapsed'),
        label: document.getElementById('progress-label'),
    };

    const circleRadius = elems.elapsedRing.getAttribute('r');
    const maxDashArray = 2 * Math.PI * circleRadius;
    let timeCurrent = 0;
    let timeDuration = 0;

    const render = () => {
        const elapsed = Math.min(Math.max(0, timeCurrent), timeDuration);
        const ratio = timeDuration === 0 ? 0 : elapsed / timeDuration;
        const seconds = elapsed % 60;
        const minutes = (elapsed - seconds) / 60;

        elems.elapsedRing.setAttribute("stroke-dasharray",
            `${ratio * maxDashArray} ${maxDashArray}`);
        elems.label.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
        updateProgress(current, duration) {
            timeCurrent = current;

            if (duration !== null) {
                timeDuration = duration;
            }

            render();
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
        comboFull: document.getElementById('perf-combo-full'),
        // Beatmap container
        image: document.getElementById('song-image'),
        titleRow: document.getElementById('song-title-row'),
        title: document.getElementById('song-title'),
        subtitle: document.getElementById('song-subtitle'),
        artistRow: document.getElementById('song-artist-row'),
        artist: document.getElementById('song-artist'),
        mapper: document.getElementById('song-mapper'),
        tags: document.getElementById('song-tags'),
    };

    const setVisibility = (elem, visible) => {
        if (visible) {
            elem.classList.remove('hidden');
        } else {
            elem.classList.add('hidden');
        }
    };

    const formatNumber = (n) => {
        const pattern = /(-?\d+)(\d{3})/;
        let s = n.toString();

        while (pattern.test(s)) {
            s = s.replace(pattern, "$1,$2");
        }

        return s;
    }

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

        updatePerformance(accuracy, score, rank, combo, full_combo) {
            elems.rank.textContent = rank;
            elems.percentage.textContent = `${accuracy.toFixed(2)}%`;
            elems.score.textContent = formatNumber(score);
            elems.combo.textContent = combo;
            setVisibility(elems.comboFull, full_combo);
        },

        updateTitle(title, subtitle) {
            setVisibility(elems.titleRow, !!title || !!subtitle);
            setVisibility(elems.title, !!title);
            elems.title.textContent = title;
            setVisibility(elems.subtitle, !!subtitle);
            elems.subtitle.textContent = subtitle;
        },

        updateAuthor(artist, mapper) {
            setVisibility(elems.artistRow, !!artist || !!mapper);
            setVisibility(elems.artist, !!artist);
            elems.artist.textContent = artist;
            setVisibility(elems.mapper, !!mapper);
            elems.mapper.textContent = `[${mapper}]`;
        },

        updateImage(source) {
            elems.image.setAttribute('src', source);
        },

        updateTags(tags) {
            // OBS currently uses CEF version 75.1.16+g16a67c4+chromium-75.0.3770.100,
            // which does not support ParentNode.replaceChildren()
            while (elems.tags.lastChild) {
                elems.tags.removeChild(elems.tags.lastChild);
            }

            for (const tag of tags) {
                const textElem = document.createElement('span');
                textElem.classList.add('tag-item-text');
                textElem.textContent = tag;

                const tagElem = document.createElement('span');
                tagElem.classList.add('tag-item');
                tagElem.appendChild(textElem);
                elems.tags.appendChild(tagElem);
            }
        },
    };
})();