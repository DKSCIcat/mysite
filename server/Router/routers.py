from fastapi import APIRouter, Depends, File, Form, UploadFile, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from .clientRouter import *
from mongodb import *
from dependence import *

router = APIRouter()


@router.get(
    "/login/",
    tags=["login"],
    summary="登录页面"
)
async def login():
    return FileResponse(getFilePath("login.html"), media_type="html")


@router.get(
    "/login/{filePath}",
    tags=["login"],
    description="响应登陆页面的相关的静态文件")
async def get_login(filePath: str):
    return FileResponse(getFilePath(filePath))


class user_login_data(BaseModel):
    uuid: str = Field(default=None, min_length=1, max_length=20)
    passwd: str = Field(default=None, min_length=1, max_length=20)


@router.post(
    "/login/",
    tags=['login'])
async def post_login(user_login: user_login_data = Depends(verify_current_user)):
    hashed_value = get_hashed_value(user_login.uuid)  # 加密
    # users[user_login.uuid].update({'token': hashed_value})
    friends = USERS.find_one({"username": user_login.uuid})['friends']
    print(friends)
    return JSONResponse({
        "uuid": user_login.uuid,
        "access_token": hashed_value,
        "friends": friends,
    })


class application_from(BaseModel):
    myname: str = Field(min_length=1, max_length=20)
    username: str = Field(min_length=1, max_length=20)
    pwd: str = Field(min_length=8, max_length=20)
    confirm_pwd: str = Field(min_length=8, max_length=20)


@router.get("/login/register/",
            tags=['register'])
async def register():
    return FileResponse(getFilePath("register.html"), media_type="html")


@router.get("/login/register/{filepath}",
            tags=['register'],)
async def get_register(filepath: str):
    return FileResponse(getFilePath(filepath))


class form_data(BaseModel):
    myname: str = Field(min_length=0, max_length=20)
    username: str = Field(min_length=1, max_length=20)
    pwd: str = Field(min_length=8, max_length=20)
    confirm_pwd: str = Field(min_length=8, max_length=20)


@router.post(
    "/login/register/",
    tags=['register'],)
async def form_handle(form_data: form_data):
    user = user_opt.get_user(form_data.username)
    if user == False and form_data.myname == "马聪健" and form_data.pwd == form_data.confirm_pwd:
        USERS.insert_one({
            "username": form_data.username,
            "passwd": form_data.pwd,
            "chatRecord": [],
            "friends": [],
        })
        return jsonable_encoder({"ok": "success"})
    else:
        raise HTTPException(422)

# --------------------------------------


@ router.get("/chat/", tags=["chat"])
async def chat():
    # 聊天界面响应
    return FileResponse(getFilePath("chatIndex.html"), media_type="html")


@ router.get("/chat/{filePath}", tags=["chat"])
async def get_login(filePath: str):
    return FileResponse(getFilePath(filePath))


class uname(BaseModel):
    login_name: str = Field(min_length=1, max_length=20)
    add_name: str = Field(min_length=1, max_length=20)


class uRecord(BaseModel):
    userself: str
    user_friend: str


def add_user(login_name, add_name):
    if user_opt.add_friend(login_name, add_name):
        return jsonable_encoder({"success": f"{add_name} added"})
    return jsonable_encoder({"failed": f"{add_name} inexistence or added"})


def get_record(userself, user_friend):
    pub_col = get_public_record(userself, user_friend)
    if pub_col is not False:
        return record_col.get_record(pub_col)
    else:
        return{"error": "no public col"}


@router.post("/chat/",
             tags=["chat"])
async def get_friend(uname: Union[uname, uRecord]):
    # 将上述两个函数添加到此处。
    data = uname.dict()
    if data.get("login_name", False):
        return JSONResponse(add_user(uname.login_name, uname.add_name))
    elif data.get("userself", False):
        return JSONResponse(get_record(uname.userself, uname.user_friend))
    else:
        raise HTTPException(status_code=400, detail="bad request")
