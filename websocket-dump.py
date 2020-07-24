import argparse
import asyncio
import itertools
import json
import traceback
import sys

import websockets

parser = argparse.ArgumentParser()
parser.add_argument('-a', '--address', default='localhost:6557',
                    help='Beat Saber WebSocket <host>:<port>')
parser.add_argument('-o', '--output', required=True,
                    help='Dump file output path')
args = parser.parse_args()

with open(args.output, 'w') as f:
    f.write('const mockEvents = [')

    try:
        async def dump():
            uri = f'ws://{args.address}/socket'

            async with websockets.connect(uri) as websocket:
                for i in itertools.count():
                    message = await websocket.recv()

                    print(f'Received message {i}')

                    data = json.loads(message)

                    if i > 0:
                        f.write(',')
                    json.dump(data, f)

        asyncio.get_event_loop().run_until_complete(dump())
    except:
        traceback.print_exc()
        print('Stopping dump due to exception', file=sys.stderr)

    f.write('];')
