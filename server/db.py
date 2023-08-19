from typing import Union, Dict, Any, Set, Annotated, List
from datetime import datetime
from pydantic import BaseModel
import pymongo
client = pymongo.MongoClient()

CHAT_DB = client['chatDB']  # 聊天数据库
USERS = CHAT_DB['User']  # 用户数据集合
# CHAT_DATA = CHAT_DB['chatData']  # 聊天数据集合


class single_message(BaseModel):
    sender: str
    receiver: str
    time: str  # 这条消息发送的时间
    message_type: str


class user_chat_record(BaseModel):
    recordID: str
    chat_member: Set[str]


class user_info(BaseModel):
    login_id: str
    username: str
    passwd: str
    disabled: bool
    friends: List[str]  # 好友
    groups: Union[Set[str], None]  # 群疗号
    chat_record: Set[str]  # 聊天记录id
    create_time: datetime
    last_login_time: datetime
    other_info: Union[
        Dict[str, Union[str, None]], None]


class client_user_info(BaseModel):
    login_id: str
    username: str
    friends: Set[str]  # 好友
    groups: Union[Set[str], None]  # 群聊号


def create_user(json_info: dict):
    user_template = {
        # "login_id": '100001',  # will be replace
        "username": "用户名",  # will be replace
        "passwd": "password",  # will be replace
        "disabled": False,
        'friends': [],
        'groups': None,
        'chat_record': [],
        'create_time': datetime.now(),  # will be replace
        'last_login_time': datetime.now()  # will be replace
    }
    template = user_template.copy()
    template['create_time'] = datetime.utcnow()
    template['last_login_time'] = datetime.utcnow()
    for k in json_info.keys():
        template[k] = json_info[k]
    USERS.insert_one(template)
