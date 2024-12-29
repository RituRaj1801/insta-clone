import React from "react";
import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import LoginPage from "./components/LoginPage"; // Import the LoginPage component
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import RegistrationPage from "./components/RegistrationPage";
import NotFound from "./components/NotFound";
import UserProfile from "./components/UserProfile";
import Chat from "./components/Chat";
import PostUpload from "./components/PostUpload";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LoginPage />} />  {/* Login Page at root */}
        <Route path="/login" element={<LoginPage />} />  {/* Explicit Login Route */}
        <Route path="/upload_post" element={<PostUpload backendUrl={'http://localhost/backend/'}/>} />  {/* Explicit Login Route */}
        <Route path="/register" element={<RegistrationPage />} />  {/* Explicit Login Route */}
        <Route path="/UserProfile" element={<UserProfile />} />  {/* user Profile Login Route */}
        <Route path="/chat" element={<Chat />} />  {/* user Profile Login Route */}
        <Route path="/dashboard" element={localStorage.getItem('authToken')?  <Dashboard /> : <Navigate to="/login" replace />} />  {/* Dashboard Page */}        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
