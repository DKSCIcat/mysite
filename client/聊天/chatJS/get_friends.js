"use strict";
let add_friend = document.querySelector("#add_friends");

/*---添加用户标签
  参数：username为用户名，last_message为最后一条消息；
  功能：在左侧生成一个用户标签；
  无返回值；
*/
function add_user_tag(username, last_message) {
  let user_tag = `<div id="${username}" class="chat-item">
  <div>
    <div class="portrait"></div>
    <div>
      <span class="username">${username}</span>
      <span class="lastMessage">${last_message}</span>
    </div>
  </div>
  </div>`;
  add_friend.insertAdjacentHTML("beforebegin", user_tag);
}

async function opt_friend(data, url = `http://127.0.0.1:8000/chat`) {
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


let friend_list = sessionStorage['friends'].split(",");
friend_list.forEach((value) => {
  add_user_tag(value, "test");
});

add_friend.addEventListener("click", () => {
  let uname = "";
  uname = prompt("填写用户名：");
  if (uname ?? false) {
    let data = JSON.stringify({
      login_name: sessionStorage['uuid'],
      add_name: uname
    });//封装发送包含添加用户名的信息
    opt_friend(data).then((res) => {
      if (res.hasOwnProperty("success") && !friend_list.includes(uname)) {
        add_user_tag(uname, "last_message");
      } else {
        alert("user inexistence or added");
      }
    }).catch(console.log);
  }
});

