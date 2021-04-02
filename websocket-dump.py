import argparse
import asyncio
import itertools
import json
import time
import traceback
import sys

import websockets

parser = argparse.ArgumentParser()
parser.add_argument('-a', '--address', default='localhost:2946',
                    help='Beat Saber WebSocket <host>:<port>')
parser.add_argument('-o', '--output', required=True,
                    help='Dump file output path')
args = parser.parse_args()

with open(args.output, 'w') as f:
    f.write('const mockEvents = [\n')

    try:
        time_offset = time.monotonic()
        file_lock = asyncio.Lock()

        async def dump(endpoint):
            uri = f'ws://{args.address}/BSDataPuller/{endpoint}'

            async with websockets.connect(uri) as websocket:
                for i in itertools.count():
                    message = await websocket.recv()
                    # Round to nearest millisecond
                    event_time = round((time.monotonic() - time_offset) * 1000)

                    print(f'[{endpoint}] Received message {i}')

                    data = json.loads(message)
                    event = {
                        'time': event_time,
                        'endpoint': endpoint,
                        'data': data,
                    }

                    async with file_lock:
                        json.dump(event, f)
                        f.write(',\n')

        asyncio.get_event_loop().run_until_complete(asyncio.gather(
            dump('MapData'),
            dump('LiveData'),
        ))
    except:
        traceback.print_exc()
        print('Stopping dump due to exception', file=sys.stderr)

    f.write('];')
