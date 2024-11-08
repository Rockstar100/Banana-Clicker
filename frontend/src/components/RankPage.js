import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socketService";

const RankPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch initial leaderboard data
    fetchLeaderboard();

    // Real-time update on leaderboard
    socket.on("updateLeaderboard", (updatedUser) => {
      setLeaderboard((prevLeaderboard) => {
        const updatedList = prevLeaderboard.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        return updatedList.sort((a, b) => b.bananaCount - a.bananaCount);
      });
    });

    return () => {
      socket.off("updateLeaderboard");
    };
  }, []);

  const fetchLeaderboard = async () => {
    const res = await axios.get("/api/player/leaderboard");
    setLeaderboard(res.data);
  };

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Banana Count</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.bananaCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankPage;
