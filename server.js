const next = require("next");
const { createServer } = require("http");
const { Server } = require("socket.io");
const url = require("url");
const Message = require("./src/modals/message");

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
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = new Set();
  let socketUserMap = new Map();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("message", async (msg) => {
      if (msg.messageId) {
        await Message.findByIdAndUpdate(msg.messageId, {
          status: "sent",
        });
      }
      io.emit("message", msg);
    });

    socket.on("messageDelivered", async (message) => {
      if (message && message.messageId) {
        await Message.findByIdAndUpdate(message.messageId, {
          status: "delivered",
        });
      }
      io.emit('messageDelivered',message)
    });

    socket.on("messageSeen",async (messageId)=>{
      await Message.findByIdAndUpdate(messageId,{
        status:"seen"
      })
      io.emit('messageSeen',messageId)
    })

    socket.on("online", async (userId) => {
      socketUserMap.set(socket.id, userId);
      onlineUsers.add(userId);
      const undeliveredMessages = await Message.find({
        receiverId: userId,
        status: "sent",
      });

      undeliveredMessages.forEach(async (msg) => {
  
        await Message.findByIdAndUpdate(msg._id, {
          status: "delivered",
        });
        io.emit("message_delivered", msg);
      });
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
