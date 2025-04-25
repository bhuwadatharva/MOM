import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Login from "./Components/Login";
import Hero from "./Components/Hero";
import "./App.css";
import Create from "./Components/Create";
import Meeting from "./Components/Meeting";
import { Context } from "./main";

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://mom-t2in.onrender.com/api/v1/user/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };

    fetchUser();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Hero /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/meeting/:id" element={<Meeting />} />
      </Routes>
    </Router>
  );
}

export default App;
