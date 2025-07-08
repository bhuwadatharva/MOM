import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../main";
import MeetingCard from "./MeetingCard";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Hero = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.username) {
        setMeetings([]);
        setFilteredMeetings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://mom-t2in.onrender.com/api/v1/meeting/meetings?searchValue=${encodeURIComponent(
            user.username
          )}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch meetings");
        }

        const data = await response.json();
        setMeetings(data.data || []);
        setFilteredMeetings(data.data || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [user?.username]);

  useEffect(() => {
    const filtered = meetings.filter((m) =>
      m.agenda.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMeetings(filtered);
  }, [search, meetings]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="px-6 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search meetings by agenda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredMeetings.length === 0 ? (
          <p>No meetings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                key={meeting._id}
                onClick={() =>
                  navigate(`/meeting/${meeting._id}`, {
                    state: { meetingId: meeting._id },
                  })
                }
                className="cursor-pointer transition"
              >
                <MeetingCard title={meeting.agenda} date={meeting.date} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
