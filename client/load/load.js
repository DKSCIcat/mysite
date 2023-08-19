"use strict";
let userID = document.querySelector("#username");
let passwd = document.querySelector("#password");
let login = document.querySelector("#signIn");
let register = document.querySelector("#register");

async function user_login(data) {
    let url = window.location.href;
    const response = await fetch(url, {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    });
    return response.ok ? await response.json() : Promise.reject("网络访问错误");
}

function store(jsonInfo) {  //存储token
    for (let key in jsonInfo) {
        sessionStorage.setItem(key, jsonInfo[key]);
    }
}

login.addEventListener("click", () => {
    let id = userID.value.toString();
    let pwd = passwd.value.toString();
    let sendData = JSON.stringify({
        'uuid': id,
        'passwd': pwd,//此处应当加密
    });
    user_login(sendData).then((jsonValue) => {
        if (jsonValue.hasOwnProperty("access_token")) {
            store(jsonValue);
            window.location.assign("http://127.0.0.1:8000/chat");
        }
    }
    ).catch(console.log);
});
