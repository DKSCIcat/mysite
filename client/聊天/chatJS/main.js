"use strict";

let ChatContent = document.getElementById("chat");//对话气泡框内容💬
let inputText = document.getElementById('chatText');//输入框内容 

let send = document.getElementById('send');//发送按钮 


function produceAMessage(operating = 'SEND') {
    const OPERATE = {
        'SEND': 'oneself',
        'RECEIVE': 'opposite-side'
    };
    let text = inputText.value.toString();
    if (/\S/.test(text)) {
        if (/[<>]/g.test(text)) {
            text = text.replace(/[<>]/g, (...args) =>
                (args[0] == "<" ? "&lt;" : "&gt;")
            );
        }
        // console.log(text);
        let aMessage = `<div data-content="user-content" class="base-style ${OPERATE[operating]}">
        <div class="userInfo1">
          <div class="portrait"></div> </div>
        <div class="userInfo2 ${OPERATE[operating]}">
          <div class="Amessage">${text}</div>
        </div></div>`;
        ChatContent.insertAdjacentHTML('beforeend', aMessage);
        ChatContent.scrollBy({ top: 120, behavior: 'smooth' });
    }
    inputText.value = "";
}//产生一条气泡内容 ，有两种模式，有发送⬆️和接受⬇️，默认发送⬆️。

send.addEventListener('click', () => produceAMessage('RECEIVE'));

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "Enter":
            produceAMessage();
            break;
    }
});



