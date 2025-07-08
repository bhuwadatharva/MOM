import { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Select from "react-select";
import { Context } from "../main";
import { X } from "lucide-react"; // optional close icon
import { toast } from "react-toastify";

const Create = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    agenda: "",
    date: "",
    teammates: [],
  });

  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(Context);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/getuser"
      );
      const users = response.data?.data || [];

      if (users.length > 0) {
        const options = users.map((user) => ({
          value: user.username,
          label: `${user.username} (${user.email})`,
          email: user.email,
        }));
        setUserOptions(options);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.teammates.length === 0) {
      alert("Please select at least one teammate to invite.");
      return;
    }

    try {
      const meetingData = {
        members: formData.teammates.map((teammate) => teammate.value),
        emails: formData.teammates.map((teammate) => teammate.email),
        agenda: formData.agenda,
        date: formData.date,
        host: user?.username,
      };

      const response = await axios.post(
        "http://localhost:4000/api/v1/meeting/create",
        meetingData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        console.log("Meeting created successfully:", response.data);
        toast.success("Meeting created successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white/90 rounded-xl shadow-xl p-6 w-full max-w-md relative border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Create a New Meeting
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="agenda"
            placeholder="Meeting Agenda"
            value={formData.agenda}
            onChange={(e) =>
              setFormData({ ...formData, agenda: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
            required
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
            required
          />

          <Select
            isMulti
            isLoading={loading}
            options={userOptions}
            value={formData.teammates}
            onChange={(selectedOptions) =>
              setFormData({ ...formData, teammates: selectedOptions || [] })
            }
            placeholder="Invite Teammates"
            className="react-select-container"
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary25: "#f3f4f6", // light hover
                primary: "#000000", // black focus
              },
            })}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default Create;
