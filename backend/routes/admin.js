const express = require("express");
const User = require("../models/User");
const router = express.Router();


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("username bananaCount isBlocked");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
});


router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username,
      password,
      role: "player",
      bananaCount: 0,
    });
    await user.save();
    res.status(201).json({ message: "Player created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to create player" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username }, { new: true });
    if (!user) return res.status(404).json({ message: "Player not found" });
    res.json({ message: "Player updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update player" });
  }
});


router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete player" });
  }
});


router.patch("/users/:id/block", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to block/unblock user" });
  }
});

module.exports = router;
