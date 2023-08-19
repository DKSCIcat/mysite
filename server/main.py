from fastapi import FastAPI
from fastapi.websockets import WebSocket, WebSocketDisconnect
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from Router import routers
from typing import Dict
from mongodb import *
from dependence import *


app = FastAPI()
app.include_router(routers.router)

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD", "OPTION"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str,  WebSocket] = {}

    async def connect(self, client: str, websocket: WebSocket):
        if USERS.find({'username': client}) is not None:
            await websocket.accept()
            self.active_connections.update({client:  websocket})
        else:
            raise HTTPException(status_code=400, detail="错误信息")

    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id)

    async def send_one_message(self, client_id: str, data: forward_data):  # 此处使用依赖
        target_client = data['receiver']
        print(data)
        if target_client in user_opt.get_user(client_id)['friends']:
            pubRecord = get_public_record(client_id, target_client)
            record_col.add_record(pubRecord, data)
            send_info = jsonable_encoder(
                forward_data(**data).dict())
            if target_client in self.active_connections:
                await self.active_connections[target_client].send_json(send_info)


manager = ConnectionManager()


@app.websocket("/chat/ws/{client_id}/")
async def websocket_endpoint(client_id: str, websocket: WebSocket):
    await manager.connect(client_id, websocket)
    try:
        while True:
            data: forward_data = await websocket.receive_json()
            await manager.send_one_message(client_id, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
