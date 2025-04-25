const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'client' folder
app.use(express.static("client"));

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Broadcast to all connected clients
  });

  // Listen for typing event
  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name); // Send "typing..." to others
  });

  // When user disconnects, notify others
  socket.on("disconnect", () => {
    socket.broadcast.emit("chat message", {
      text: "A user has left the chat.",
      system: true
    });
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(Server running at http://localhost:${PORT});
});