import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main"; // Assuming Context is defined globally

function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { username, password },
        { withCredentials: true }
      );
  
      console.log("Response from server:", response.data); // Log the entire response data
  
      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
  
        console.log("User data:", response.data.user); // Log user-specific data
        navigate("/"); // Redirect after login
      } else {
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-serif text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-200 text-black rounded-lg hover:bg-black hover:text-white transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
