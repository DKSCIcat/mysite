"use strict";

let client_id = 12345;
let ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);

ws.onopen = () => console.log("connect over");
ws.onerror = (error) => {
    console.log(error);
}
// ws.send("abc");
// ws.onmessage = (event) => {
//     console.log(event.data);
// }


// export default chatSocket;