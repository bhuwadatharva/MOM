import { useState, useContext } from "react";
import { Context } from "../main";
import Create from "./Create";
import axios from "axios";
import { PlusCircle, LogOut } from "lucide-react"; // Optional icons

const Navbar = () => {
  const { user, setIsAuthenticated } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    try {
      await axios.get("https://mom-t2in.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      closeModal(); // Close modal if open
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 flex items-center justify-between shadow-md">
      {/* User Avatar & Info */}
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-white h-10 w-10 flex items-center justify-center border-2 border-black shadow">
          <span className="text-black font-bold text-lg">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <div>
          <p className="font-semibold text-white text-sm md:text-base">
            {user?.email || "No Email Found"}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleLogout}
          className="flex items-center bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white border transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </button>

        <button
          onClick={openModal}
          className="flex items-center bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white border transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <Create closeModal={closeModal} />}
    </div>
  );
};

export default Navbar;
