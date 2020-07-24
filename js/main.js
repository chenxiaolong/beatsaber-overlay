window.addEventListener('load', () => {
    let source = 'game';
    const sourceOptions = {
        address: 'localhost:6557',
    };

    // Parse query params
    const queryParams = new URLSearchParams(location.search);

    for (const [key, value] of queryParams) {
        switch (key) {
            case 'address':
                sourceOptions.address = value;
                break;
            case 'scaleFactor':
                const overlay = document.getElementById('overlay');

                const scaleFactor = Number(value);
                if (Number.isNaN(scaleFactor) || scaleFactor < 0) {
                    scaleFactor = 1.0;
                }

                overlay.style.transformOrigin = 'bottom left';
                overlay.style.transform = `scale(${scaleFactor})`;

                break;
            case 'debug':
                console.log("[Debug] Making background black");
                document.body.style.background = 'black';
                break;
            case 'mock':
                source = 'mock';
                break;
            case 'mockLog':
                sourceOptions.mockLog = true;
                break;
            default:
                console.error(`Unknown query param: ${key}=${value}`);
                break;
        }
    }

    // Load event source
    const elem = document.createElement('script');
    elem.setAttribute('src', `js/sources/${source}.js`);
    elem.addEventListener('load', () => startSource(sourceOptions));
    document.body.appendChild(elem);
});