const express = require("express");
const User = require("../models/User");
const router = express.Router();


router.get("/me", async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("username bananaCount");
  res.json(user);
});


router.post("/click", async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  user.bananaCount += 1;
  await user.save();
  res.json({ bananaCount: user.bananaCount });
});


router.get("/leaderboard", async (req, res) => {
  const leaderboard = await User.find({ role: "player" })
    .sort({ bananaCount: -1 })
    .select("username bananaCount")
    .limit(10);
  res.json(leaderboard);
});

module.exports = router;
