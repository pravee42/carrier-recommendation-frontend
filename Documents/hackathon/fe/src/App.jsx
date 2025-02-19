import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/Login";
import { useEffect } from "react";
import ProfileSummary from "./pages/profileSummary";

// Separate authentication check component
const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginDetails = JSON.parse(localStorage.getItem('token'));
    
    if (!loginDetails) {
      navigate('/login');
    } else {
      navigate('/form');
    }
  }, [navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AuthWrapper>
            <Home />
          </AuthWrapper>
        } />
        <Route path="/form" element={<FormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/result" element={<ProfileSummary />} />
      </Routes>
    </Router>
  );
}

export default App;