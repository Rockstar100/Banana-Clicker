import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socketService"; // Import the socket service

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();

    // Subscribe to socket.io updates for real-time user data
    socket.on("updateUser", (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    });

    return () => {
      socket.off("updateUser");
    };
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/users");
    setUsers(res.data);
  };

  const handleBlockUser = async (userId) => {
    await axios.patch(`/api/admin/users/${userId}/block`);
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`/api/admin/users/${userId}`);
    fetchUsers();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Banana Count</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.bananaCount}</td>
              <td>{user.isBlocked ? "Blocked" : "Active"}</td>
              <td>
                <button onClick={() => handleBlockUser(user._id)}>
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
