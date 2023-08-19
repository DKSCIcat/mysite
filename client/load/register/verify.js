"use strict";
let who = document.querySelector("#who");
let username = document.querySelector("#name");
let pwd = document.querySelector("#pwd");
let confrimPWD = document.querySelector("#confirm_pwd");
let submit = document.querySelector("#submit");

function verify_username(elemValue) {
    let reg = /[~`!@#$%\^&*\(\)\[\]{}:"';<>,./?|\/\s-+]/;
    let reg2 = /\S{1,20}/;
    if (!reg.test(elemValue) && reg2.test(elemValue)) {
        return elemValue;
    }
    throw new Error("字符在1~20且不可输入一般符号。");
}

function verify_pwd(elemValue) {
    let reg = /\S{8,20}/;
    if (reg.test(elemValue)) {
        return elemValue;
    }
    throw new Error("密码不可以输入空字符且在8~20位");
}

function get_form() {
    try {
        let myname = verify_username(who.value);
        let validated_uname = verify_username(username.value);
        let validated_pwd = verify_pwd(pwd.value);
        let validated_confirmPWD = verify_pwd(confrimPWD.value);
        if (validated_pwd !== validated_confirmPWD) throw new Error("确认密码不一致");
        let form_data = JSON.stringify({
            myname: myname,
            username: validated_uname,
            pwd: validated_pwd,
            confirm_pwd: validated_confirmPWD,
        })
        return form_data;
    } catch (error) {
        alert(error.message)
    }
}


async function send_form(form_data) {
    const URL = window.location.href;
    return await fetch(URL, {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: form_data,
    });
}

async function submit_applications() {
    let form_data = get_form();
    if (form_data) {
        let response = await send_form(form_data);
        if (response.ok) {
            // let newUser = await response.json();//获取用户id和密码
            // 跳转到登录页面
            setTimeout(() => {
                alert("注册成功.");
                window.location.assign("http://127.0.0.1:8000/login/");
            }, 200);
        }
    }
}

submit.addEventListener("click", submit_applications);
