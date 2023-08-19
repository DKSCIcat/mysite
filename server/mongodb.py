from datetime import datetime
import pymongo
client = pymongo.MongoClient()
CHAT_DB = client['chatDB']  # 聊天数据库
USERS = CHAT_DB['User']  # 用户数据集合


class Record_operation:

    def __init__(self) -> None:
        pass

    def create_record(self, user1: str, user2: str) -> str:
        col_name: str = f"{user1}_{user2}"
        CHAT_DB[col_name].insert_one({"members": [user1, user2]})
        return col_name

    def add_record(self, chat_col, message: dict):
        # 向聊天记里集合中添加一条记录.
        message.update({"time": datetime.now()})
        try:
            chat_col.insert_one(message)
            if chat_col.find_one({"time": {"$exists": True}}):
                chat_col.create_index([("time", -1)])
            # self.DETECT = False
        except:
            print("错误")
            # return {"error": "message bad"}

    def get_record(self, chat_col):
        try:
            num = 0
            record = {}
            if cols := chat_col.find({"time": {"$exists": True}}):
                for i in cols.sort("time", pymongo.DESCENDING).limit(15):
                    i.pop("_id")
                    i["time"] = i["time"].strftime('%Y:%m:%d:%X')
                    record.update({num: i})
                    num += 1
            return record  # 从集合中返回聊天记录
        except:
            return {"error": "message bad"}


record_col = Record_operation()


def get_public_record(user1: str, user2: str):
    # 查找公共集合
    user1Record = USERS.find_one({"username": user1})['chatRecord']

    user2Record = USERS.find_one({"username": user2})['chatRecord']
    public_record = set(user1Record) & set(user2Record)
    if len(public_record) == 0:
        return False
    return CHAT_DB[public_record.pop()]


class User_operation:
    def __init__(self) -> None:
        pass

    def get_user(self, username: str):
        # 验证用户名存在，有则返回，无则false
        user = USERS.find_one({"username": username})
        if user is None:
            return False  # {"failed":f"{username} inexistence"}
        return user

    def add_friend(self, userself: str, username: str):
        user_name = self.get_user(username)
        user_self = self.get_user(userself)
        if user_name and user_self:
            if username not in user_self['friends'] and userself not in user_name['friends']:
                recordName = record_col.create_record(userself, username)
                # 如果都不在用户列表内则添加用户
                USERS.update_one(
                    {"username": username},
                    {'$push': {'friends': userself}},
                )
                USERS.update_one(
                    {"username": username},
                    {"$push": {'chatRecord': recordName}}
                )
                USERS.update_one(
                    {"username": userself},
                    {'$push': {'friends': username}},
                )
                USERS.update_one(
                    {"username": userself},
                    {"$push": {'chatRecord': recordName}}
                )
            return True  # 更新成功 {"success":f"{username} added"}
        return False  # 更新失败 {"failed":f"{username} inexistence"}

    def delete_friend(self, userself: str, username: str):
        if self.get_user(userself):
            user_list = USERS.find_one({"username": userself})["friends"]
            if username in user_list:
                USERS.update_one(
                    {"username": userself},
                    {'$pull': {'friends': username}}
                )  # 从用户好友列表中删除用户
                USERS.update_one(
                    {"username": userself},
                    {'$pull': {'chatRecord': {"$regex": "username"}}}
                )
                return True  # 删除成功 {"success":f"{username} deleted"}
            return False  # {"failed":"requset bad"}


user_opt = User_operation()
