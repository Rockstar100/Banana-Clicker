import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import PlayerHome from "./components/PlayerHome";
import AdminDashboard from "./components/AdminDashboard";
import RankPage from "./components/RankPage";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  
  useEffect(() => {
    if (authToken && role) {
      localStorage.setItem("token", authToken);
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [authToken, role]);

  const handleLogout = () => {
    setAuthToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  
  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
      
        <nav>
          {authToken && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>

        <Routes>
         
          <Route
            path="/login"
            element={
              authToken ? (
                <Navigate to={role === "admin" ? "/admin" : "/player"} />
              ) : (
                <AuthPage setAuth={setAuthToken} setRole={setRole} />
              )
            }
          />

        
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
              </ProtectedRoute>
            }
          />

         
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {role === "player" ? <PlayerHome /> : <Navigate to="/login" />}
              </ProtectedRoute>
            }
          />

            <Route
            path="/rank"
            element={
              <ProtectedRoute>
                {role === "player" ? <RankPage /> : <Navigate to="/login" />}
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
