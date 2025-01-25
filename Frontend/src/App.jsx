import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Login from "./Components/Login";
import Hero from "./Components/Hero";
import "./App.css";
import Create from "./Components/Create";
import Meeting from "./Components/Meeting"
import { Context } from "./main";

function App() {
  const { isAuthenticated, setIsAuthenticated,user, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user); // Store user data in Context
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
  
    fetchUser(); // Fetch user data on app mount
  }, []);// Empty dependency array ensures this only runs once on mount

  return (
    <Router>
      {/* <Context.Provider value={{ isAuthenticated, setIsAuthenticated, setUser }}> */}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Hero /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/meeting/:id" element={<Meeting />} />
        </Routes>
      {/* </Context.Provider> */}
    </Router>
  );
}

export default App;
