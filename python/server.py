import typing
import uvicorn
from starlette.websockets import WebSocket
from starlette.applications import Starlette
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from starlette.responses import HTMLResponse
from starlette.routing import Route, WebSocketRoute, Mount
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

import plotting
import captain_api

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws-echo");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

class Homepage(HTTPEndpoint):
    async def get(self, request):
        return HTMLResponse(html)

class Echo(WebSocketEndpoint):
    encoding = "text"

    async def on_receive(self, websocket, data):
        await websocket.send_text(f"Message text was: {data}")

class WS(WebSocketEndpoint):
    encoding = "json"

    async def on_receive(self, websocket: WebSocket, data: typing.Dict) -> None:
        if "type" not in data:
            await websocket.send_json({ 'type': 'error', 'message': "No 'type' in data" })
            return

        msg_type = data["type"]
        print(f"Got message with type '{msg_type}':", data, flush=True)

        if msg_type == "sim:init":
            sim_file = captain_api.init_simulated_system(**data["data"])
            await websocket.send_json({ 'type': 'sim:init', 'data': sim_file })
            print(flush=True)
            return

        if msg_type == "sim:run":
            def progress_callback(msg_type, data):
                websocket.send_json({ 'type': msg_type, 'data': data })

            captain_api.simulate_biodiv_env(progress_callback=progress_callback, **data["data"])
            await websocket.send_json({ 'type': 'sim:run', 'data': "http://localhost:8000/static/" })
            print(flush=True)
            return

        await websocket.send_json({ 'type': 'error', 'message': f"Type '{msg_type}' not recognized" })
        print(flush=True)
        return

routes = [
    Route("/", Homepage),
    WebSocketRoute("/ws-echo", Echo),
    WebSocketRoute("/ws", WS),
    Mount('/static', app=StaticFiles(directory='static'), name="static")
]

middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'])
]

app = Starlette(routes=routes, middleware=middleware)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
