'use server'
export function sendMessage(){
    socket.emit("send-message", {
      username,
      message
    });
    setMessage("");
}