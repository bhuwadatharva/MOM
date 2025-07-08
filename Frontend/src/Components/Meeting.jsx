import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

function Meeting() {
  const { state } = useLocation();
  const meetingId = state?.meetingId;

  const [editorContent, setEditorContent] = useState("");
  const [members, setMembers] = useState([]);
  const [agenda, setAgenda] = useState("");
  const [host, setHost] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    const formattedDate = dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  const template = (agenda, attendees, formattedDateTime) => `
    <h2>Minutes of Meeting</h2>
    <p><strong>Date:</strong> ${
      formattedDateTime?.split(" at ")[0] || "___________"
    }</p>
    <p><strong>Time:</strong> ${
      formattedDateTime?.split(" at ")[1] || "___________"
    }</p>
    <p><strong>Attendees:</strong></p>
    <ul>
      ${attendees
        .map((member, index) => `<li>${index + 1}. ${member}</li>`)
        .join("")}
    </ul>
    <p><strong>Agenda:</strong> ${agenda || "_"}</p>
    <p><strong>Discussion Points:</strong></p>
    <ul>
      <li>________</li>
      <li>________</li>
      <li>_________</li>
    </ul>
    <p><strong>Action Items:</strong></p>
    <ol>
      <li>_________</li>
      <li>________</li>
      <li>_________</li>
    </ol>
    <p><strong>Next Meeting:</strong> ___________</p>
  `;

  useEffect(() => {
    if (meetingId) {
      const fetchMeetingDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `http://localhost:4000/api/v1/meeting/get-mom/${meetingId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setMembers(data.member || []);
            setAgenda(data.agenda || "");
            setHost(data.host || "");
            setEmail(data.email || []);
            setDate(data.date || "");

            const formattedDate = formatDateTime(data.date || new Date());
            const filledTemplate = template(
              data.agenda,
              data.member,
              formattedDate
            );

            setEditorContent(data.momContent || filledTemplate);
          } else {
            console.error("Failed to fetch meeting details");
            setEditorContent(template("", [], ""));
          }
        } catch (error) {
          console.error("Error while fetching meeting details:", error);
          setEditorContent(template("", [], ""));
        } finally {
          setIsLoading(false);
        }
      };

      fetchMeetingDetails();
    } else {
      setEditorContent(template("", [], ""));
    }
  }, [meetingId]);

  const handleEditorChange = (content) => setEditorContent(content);

  const saveMomContent = async () => {
    if (!meetingId || !editorContent) {
      alert("Meeting ID and MOM content are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/meeting/save-mom",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            momContent: editorContent,
            meetingId,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("MOM saved successfully!");
        console.log("Server Response:", result);
      } else {
        const errorData = await response.json();
        console.error("Error saving MOM:", errorData);
        toast.error(errorData.message || "Failed to save MOM.");
      }
    } catch (error) {
      console.error("Error while saving MOM:", error);
      toast.error("An unexpected error occurred while saving MOM.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBxb77wDyEzM1SbLvCgSKonvtPApnVd8QU",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: editorContent || template("", [], "") }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generated) {
        setEditorContent(generated);
      } else {
        console.error("Invalid API response format", data);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-700 h-12 w-12 flex justify-center items-center text-white font-bold text-lg">
            {host?.charAt(0).toUpperCase() || "H"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{host}</h2>
            <p className="text-gray-500 text-sm">Host</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-black mb-2">Members</h3>
          <ul className="text-gray-700 space-y-1 text-sm">
            {members.length > 0 ? (
              members.map((member, index) => (
                <li key={index}>
                  {index + 1}. {member}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No members found.</li>
            )}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Meeting: {agenda}
          </h1>
          <p className="text-gray-600 font-medium">
            <span className="font-semibold">Date & Time:</span>{" "}
            {date ? formatDateTime(date) : "Not Available"}
          </p>
        </div>

        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          theme="snow"
          className="bg-white"
          modules={{
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
            ],
          }}
        />

        <div className="mt-6 flex gap-4">
          <button
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
            onClick={saveMomContent}
          >
            Save MOM
          </button>
          <button
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-black transition"
            onClick={generateReport}
          >
            {isLoading ? "Loading..." : "Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Meeting;
