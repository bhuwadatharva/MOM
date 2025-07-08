import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    designation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData
      );
      if (res.status === 201) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-black p-8 rounded-xl shadow-lg transition-all hover:shadow-2xl bg-white">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Create Your Account
        </h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {["username", "email", "password", "designation"].map((field) => (
            <div className="relative" key={field}>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className={`peer w-full px-3 pt-5 pb-2 border ${
                  error ? "border-red-600" : "border-black"
                } text-black bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-black rounded-md`}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
              <label
                htmlFor={field}
                className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-900 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
