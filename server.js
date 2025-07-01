const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");
const url = require("url");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*", // update this in production
      methods: ["GET", "POST"]
    }
  });

  let onlineUsers = new Set();
  let socketUserMap = new Map(); 

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      io.emit("message", msg);
    });

    socket.on("online", (userId) => {
      socketUserMap.set(socket.id, userId);
      onlineUsers.add(userId);
      console.log("Online Users:", onlineUsers);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("offline", (userId) => {
      onlineUsers.delete(userId);
      socketUserMap.forEach((id, sockId) => {
        if (id === userId) socketUserMap.delete(sockId);
      });
      console.log("Online Users:", onlineUsers);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        socketUserMap.delete(socket.id);
        console.log(`User ${userId} disconnected`);
        io.emit("onlineUsers", Array.from(onlineUsers));
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
