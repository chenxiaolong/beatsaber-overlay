# Beat Saber Overlay

A very simple overlay for displaying the current Beat Saber song and player performance information. Requires the Beat Saber HTTP Status plugin.

## Setup

1. Install the [Beat Saber HTTP Status](https://github.com/opl-/beatsaber-http-status) plugin.

2. Clone this git repo:

    ```powershell
    git clone https://github.com/chenxiaolong/beatsaber-overlay.git
    ```

3. Get the path to `index.html` as a `file://` URI:

    ```powershell
    cd beatsaber-overlay
    ([System.Uri] (ls index.html).FullName).AbsoluteUri
    ```

4. Add a browser source to OBS and paste the `file://` URI into the URL field.

5. Set the width and height to match the canvas size.

6. That's it!

## Configuration

There are a few URI query parameters available to configuring the overlay.

| Parameter     | Deacription                                                    |
|---------------|----------------------------------------------------------------|
| `address`     | Address to Beat Saber websocket (defaults to `localhost:6557`) |
| `scaleFactor` | Scale factor of the overlay (defaults to `1.0`)                |
| `debug`       | Make the page background black for testing                     |
| `mock`        | Process mock events instead of connecting to Beat Saber        |

For example, to use a scale factor of 1.5 and connect to a Beat Saber instance running on another machine (`10.10.10.10:1234`), the URI would be:

```
file:///C:/.../beatsaber-overlay/index.html?scaleFactor=1.5&address=10.10.10.10:1234
```

## Debugging

To debug the overlay, open `index.html?debug&mock` in a browser. It will display a black background for visibility and use `js\sources\mock_events.js` as the source of events instead of a real websocket connection. The mock event source will automatically apply a proper offset to all the timestamps in the dump so that they appear to happen in real-time.

A new event dump can be created with the included `websocket-dump.py` python script.

```powershell
python -m venv venv
. venv\Scripts\activate.ps1
pip install -r requirements.txt
python websocket-dump.py -o js\sources\mock_events.js
# Play the game and then ^C out of the script
```

## Credits

Inspired by [Reselim/beat-saber-overlay](https://github.com/Reselim/beat-saber-overlay).