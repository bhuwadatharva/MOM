import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Login from "./Components/Login";
import Hero from "./Components/Hero";
import "./App.css";
import Create from "./Components/Create";
import Meeting from "./Components/Metting";

// Create a Context to manage global user authentication state
export const Context = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };

    fetchUser(); // fetch the user once when the app starts
  }, [isAuthenticated]); // Empty dependency array ensures this only runs once on mount

  return (
    <Router>
      <Context.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create/>}/>
          
          <Route path="/meeting/:id" element={<Meeting/>} />
        </Routes>
      </Context.Provider>
    </Router>
  );
}

export default App;
