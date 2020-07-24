window.addEventListener('load', () => {
    var address = 'localhost:6557';
    var source = 'game';

    function handleQueryParams() {
        const queryParams = new URLSearchParams(location.search);

        for (const [key, value] of queryParams) {
            switch (key) {
                case 'address':
                    address = value;
                    break;
                case 'scaleFactor':
                    const overlay = document.getElementById('overlay');

                    var scaleFactor = Number(value);
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
                default:
                    console.error(`Unknown query param: ${key}=${value}`);
                    break;
            }
        }
    }

    handleQueryParams();

    // Load event source
    const elem = document.createElement('script');
    elem.setAttribute('src', `js/sources/${source}.js`);
    elem.addEventListener('load', () => connectToSource(address));
    document.body.appendChild(elem);
});