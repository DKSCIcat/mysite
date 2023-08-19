from fastapi import Depends, HTTPException, status
from typing import Union, Set, Any, Dict
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from mongodb import *
encrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class forward_data(BaseModel):
    # websocket发送的数据
    sender: str = Field(min_length=1, max_length=20)
    receiver: str = Field(min_length=1, max_length=20)
    message: str = Field(min_length=1, max_length=200)


class user_info(BaseModel):
    userid: str
    passwd: str
    username: str
    disable: bool
    friends: Set[str]  # 好友
    groups: Set[str]  # 群疗号
    chat_record: Set[str]  # 聊天记录id
    create_time: str
    last_login_time: str
    other_info: Union[
        Dict[str, Union[str, None]], None]


class single_message(BaseModel):
    sender: str
    receiver: str
    time: str  # 这条消息发送的时间
    message_type: str
    content: Any


class user_chat_record(BaseModel):
    recordID: str
    chat_member: Set[str]
    Records: Dict[str, Dict[str, single_message]]


class user_login_data(BaseModel):
    uuid: str = Field(default=None, min_length=1, max_length=20)
    passwd: str = Field(default=None, min_length=8, max_length=20)


def get_hashed_value(value: str) -> str:
    # 获取加密值
    return encrypt_context.hash(value)


def verify_hashed_value(plain_value: str, hashed_value: str) -> bool:
    # 验证原密码
    return encrypt_context.verify(plain_value, hashed_value)


async def verify_current_user(login_data: user_login_data):
    # 现在login_data是一个json文件
    # 验证用户是否为存在
    authentication_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",)
    if USERS.find({'username': login_data.uuid}) is not None:
        if USERS.find_one({'username': login_data.uuid})["passwd"] == login_data.passwd:
            return login_data
        raise authentication_exception
    raise authentication_exception
