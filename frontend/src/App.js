import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Predict from "./components/Predict";
import History from "./components/History";
import HowItWorks from "./components/HowItWorks";
import Login from "./components/login";
import Signup from "./components/signup";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) return null;
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <div className="pt-20"></div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/predict"
          element={
            <ProtectedRoute user={user}>
              <Predict />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute user={user}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/Signup" element={<Signup setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}
