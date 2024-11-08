const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const playerRoutes = require("./routes/player");
const { Server } = require("socket.io");
const User = require("./models/User");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/player", playerRoutes);

connectDB();

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("bananaClick", async (data) => {
    const user = await User.findById(data.userId);
    user.bananaCount += 1;
    await user.save();
    io.emit("updateRanking", await User.find().sort({ bananaCount: -1 }));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("updateBananaCount", async (userId) => {
    const user = await User.findById(userId);
    if (user) {
      user.bananaCount += 1;
      await user.save();
      io.emit("updateUser", user);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("clickBanana", async (userId) => {
    const user = await User.findById(userId);
    if (user) {
      user.bananaCount += 1;
      await user.save();
      io.emit("updateLeaderboard", user);
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
