import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Select from "react-select";
// Assuming you're using Redux for user data
import { Context } from "../main";

const Create = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    agenda: "",
    date: "",
    teammates: [], // Array to hold selected teammates
  });

  const [userOptions, setUserOptions] = useState([]); // Options for dropdown
  const [loading, setLoading] = useState(false);
  const { user } = useContext(Context);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/v1/user/getuser"); // Adjust this URL to match your backend

      const users = response.data?.data || []; // Default to an empty array if no data is returned

      // Set options in dropdown format
      if (users.length > 0) {
        const options = users.map((user) => ({
          value: user.username,
          label: `${user.username} (${user.email})`,
          email: user.email, // Include the email in the option
        }));
        setUserOptions(options);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if teammates are selected
    if (formData.teammates.length === 0) {
      alert("Please select at least one teammate to invite.");
      return;
    }

    try {
      // Map teammates to get their emails as well
      const meetingData = {
        members: formData.teammates.map((teammate) => teammate.value), // Extract usernames
        emails: formData.teammates.map((teammate) => teammate.email), // Extract emails
        agenda: formData.agenda,
        date: formData.date,
        host: user?.username, // Add host (logged-in user)
      };

      const response = await axios.post(
        "http://localhost:4000/api/v1/meeting/create",
        meetingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Meeting created successfully:", response.data);
        closeModal();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-96 relative">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Create Meeting</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="agenda" className="sr-only">
              Agenda
            </label>
            <input
              type="text"
              id="agenda"
              name="agenda"
              value={formData.agenda}
              onChange={(e) =>
                setFormData({ ...formData, agenda: e.target.value })
              }
              placeholder="Agenda"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="sr-only">
              Date
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="teammates" className="sr-only">
              Invite Teammates
            </label>
            <Select
              isMulti
              options={userOptions} // Pass options here
              value={formData.teammates} // Ensure this matches the options format
              onChange={(selectedOptions) =>
                setFormData({
                  ...formData,
                  teammates: selectedOptions || [], // Update state with selected options or an empty array
                })
              }
              placeholder="Invite Teammates"
              isLoading={loading} // Show loading spinner while fetching
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </div>
        </form>
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-black font-semibold"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Create;
