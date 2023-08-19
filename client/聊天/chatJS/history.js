"use strict";
let title_name = document.querySelector("header>h1");
let user_tags = [];
setTimeout(() => {
    friend_list.forEach((value, key) => {
        user_tags.push(document.getElementById(`${value}`));
        user_tags[key].addEventListener("click", () => {
            sessionStorage.setItem("target_user", value);
            if (title_name.textContent !== value) {
                ChatContent.innerHTML = "";
                title_name.textContent = value;
                let data = JSON.stringify({
                    userself: client_id,
                    user_friend: value
                });
                opt_friend(data).then((res) => {
                    let historyData = Object.entries(res);
                    for (let m of historyData.reverse()) {
                        m = m[1]
                        if (m["sender"] == client_id)
                            produceAMessage("SEND", m["message"])
                        else {
                            produceAMessage("RECEIVE", m["message"])
                        }
                    }
                });
            }

        })
    });
}, 50);


