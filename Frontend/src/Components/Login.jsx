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
      console.log("Response from server:", response.data);
      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        toast.success("Login successful");

        // Redirect to home page
        navigate("/");
      } else {
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-black">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:text-slate-300 hover:border hover:border-black transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-black font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
