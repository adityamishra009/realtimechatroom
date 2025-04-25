const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const typing = document.getElementById("typing");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value.trim()) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    socket.emit("chat message", {
      user: window.username,
      text: input.value,
      time: time
    });

    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  const item = document.createElement("li");
  if (msg.system) {
    item.innerHTML = <em>${msg.text}</em>;
  } else {
    item.innerHTML = <strong>${msg.user}</strong> <small>${msg.time}</small><br>${msg.text};
  }
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

input.addEventListener("input", () => {
  socket.emit("typing", window.username);
});

let typingTimeout;
socket.on("typing", (name) => {
  typing.textContent = ${name} is typing...;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typing.textContent = "";
  }, 1500);
});

socket.emit("chat message", {
  user: window.username,
  text: ${window.username} joined the chat.,
  system: true
});