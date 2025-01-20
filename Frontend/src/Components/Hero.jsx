import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../main"; // Ensure this contains the authentication context
import MeetingCard from "./MeetingCard";
import Navbar from "./Navbar";

const Hero = () => {
  const { isAuthenticated, user } = useContext(Context); // Ensure the `Context` provides `user`
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
      const fetchMeetings = async () => {
        if (!user?.username) {
          setMeetings([]);
          setLoading(false);
          return;
        }
  
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:4000/api/v1/meeting/meetings?searchValue=${encodeURIComponent(
              user.username
            )}` // Pass username as a query parameter
          );
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch meetings");
          }
  
          const data = await response.json();
          setMeetings(data.data || []);
        } catch (err) {
          setError(err.message || "An error occurred while fetching meetings.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchMeetings();
    }, [user?.username]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-6 py-8">
        {loading ? (
          <p>Loading meetings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : meetings.length === 0 ? (
          <p>No meetings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                onClick={() =>
                  navigate(`/meeting/${meeting._id}`, { state: { meetingId: meeting._id } })
                }
              >
                <MeetingCard title={meeting.agenda} date={meeting.date} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
