from os import path
from os import listdir
chat_path = "C:/Users/MaCJ/Desktop/normal/client/"

pathDir = []


def showFilePath(root_path=chat_path) -> None:
    for i in listdir(root_path):
        if path.isfile(path.join(root_path, i)):
            pathDir.append(path.abspath(path.join(root_path, i)))
        else:
            showFilePath(path.abspath(path.join(root_path, i)))


showFilePath()

baseNameDir = [path.basename(i) for i in pathDir]


def getFilePath(filename: str):
    # 获取文件名在服务器中的绝对路径
    return pathDir[baseNameDir.index(filename)]
