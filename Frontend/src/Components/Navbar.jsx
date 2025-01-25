import { useState, useContext } from "react";
import { Context } from "../main"; // Import the context
import Create from "./Create";
import axios from "axios";

const Navbar = () => {
  const { user, setIsAuthenticated } = useContext(Context); // Access user and setIsAuthenticated from Context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false); // Set authentication state to false
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
      {/* User Information */}
      <div className="flex items-center">
        <div className="rounded-full bg-gray-600 h-10 w-10 flex items-center justify-center">
          <span className="text-lg font-bold">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <div className="ml-4">
          <p className="font-semibold">{user?.email || "No Email Found"}</p>
          
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex">
        <button
          onClick={handleLogout}
          className="bg-white px-4 py-2 rounded-lg text-black mr-10"
        >
          Log Out
        </button>

        <button
          onClick={openModal}
          className="bg-white px-4 py-2 rounded-lg text-black"
        >
          Create a New Meeting
        </button>
      </div>

      {/* Conditionally render the Create modal */}
      {isModalOpen && <Create closeModal={closeModal} />}
    </div>
  );
};

export default Navbar;
