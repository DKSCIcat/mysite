"use strict";

let ChatContent = document.getElementById("chat");//对话气泡框内容💬
let inputText = document.getElementById('chatText');//输入框内容 
let send = document.getElementById('send');//发送按钮

function getMessage() {
    // 获取输入框中消息⌨
    return inputText.value.toString()
}

function produceAMessage(operating, message) {
    const OPERATE = {
        'SEND': 'oneself',
        'RECEIVE': 'opposite-side',
    };
    if (/\S/.test(message)) {
        if (/[<>]/.test(message)) {
            message = message.replace(/[<>]/g, (...args) =>
                (args[0] == "<" ? "&lt;" : "&gt;")
            );
        }
        let aMessage = `<div data-content="user-content" class="base-style ${OPERATE[operating]}">
        <div class="userInfo1">
          <div class="portrait"></div> </div>
        <div class="userInfo2 ${OPERATE[operating]}">
          <div class="${operating}-bgc Amessage">${message}</div>
        </div></div>`;
        ChatContent.insertAdjacentHTML('beforeend', aMessage);
        ChatContent.scrollBy({ top: 300, behavior: 'smooth' });
    }
    inputText.value = "";
}//产生一条气泡内容 ，有两种模式，有发送⬆️和接受⬇️，默认发送⬆️。


class chatWebSocket {
    constructor(access_token) {
        this.client_id = access_token;
        this.ws = new WebSocket(`ws://localhost:8000/chat/ws/${this.client_id}/`);
    }
    init() {
        this.ws.addEventListener("open", this.ONopen);
        this.ws.addEventListener("message", this.ONmessage);
        this.ws.addEventListener("close", this.ONclose);
        this.ws.addEventListener("error", this.ONerror)
    }
    ONopen() {
        console.log("websocket open");
    }
    ONmessage(event) {
        let receiveMessage = JSON.parse(event.data);
        produceAMessage("RECEIVE", receiveMessage.message);
    };
    ONerror() {
        console.log("error");
    }
    ONclose() {
        console.log("客户端关闭");
    }
    sendMessage(message) {
        if (this.ws.readyState) {
            produceAMessage("SEND", getMessage());
            this.ws.send(message);
        }
    }
}

let client_id = sessionStorage.getItem("uuid");
let target_user = sessionStorage.getItem("target_user");
const chat = new chatWebSocket(client_id);
chat.init();

function generate_info(
    target_user = client_id,
    message = getMessage()) {
    /*-------------
    生成一个JSON消息，参数1：目标用户，参数2：消息内容
    -------------*/
    return JSON.stringify({
        sender: sessionStorage.getItem('uuid'),
        receiver: target_user,
        message: message,
    })
}


let send_func = () => {
    chat.sendMessage(
        generate_info(target_user = target_user));
}
send.addEventListener('click', send_func);
window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "Enter":
            send_func(); break;
    }
});