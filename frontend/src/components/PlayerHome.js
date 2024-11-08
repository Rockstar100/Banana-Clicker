// Assuming you get `userId` from your auth context or props
import React, { useEffect, useState } from "react";

function PlayerHome({ userId }) { // Pass userId as a prop, or define it from your auth state
  const [bananaCount, setBananaCount] = useState(0);

  useEffect(() => {
    // Fetch initial banana count for user
    const fetchBananaCount = async () => {
      try {
        const response = await fetch(`/api/players/${userId}/bananas`);
        const data = await response.json();
        setBananaCount(data.count);
      } catch (error) {
        console.error("Error fetching banana count:", error);
      }
    };

    if (userId) {
      fetchBananaCount();
    }
  }, [userId]);

  const handleBananaClick = async () => {
    try {
      const response = await fetch(`/api/players/${userId}/bananas`, {
        method: "POST"
      });
      const data = await response.json();
      setBananaCount(data.count);
    } catch (error) {
      console.error("Error updating banana count:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Banana Clicker Game!</h1>
      <p>Your Banana Count: {bananaCount}</p>
      <button onClick={handleBananaClick}>Banana</button>
    </div>
  );
}

export default PlayerHome;
