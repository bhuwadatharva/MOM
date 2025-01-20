import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Meeting() {
  const { state } = useLocation();
  const meetingId = state?.meetingId; // Get meetingId from state
  const [editorContent, setEditorContent] = useState("");
  const [members, setMembers] = useState([]); // State for members
  const [agenda, setAgenda] = useState(""); // State for agenda
  const [host, setHost] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const template = (agenda, attendees) => `
    <h2>Minutes of Meeting</h2>
    <p><strong>Date:</strong> ___________</p>
    <p><strong>Time:</strong> ___________</p>
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
            console.log("Fetched Meeting Data:", data);

            setMembers(data.member || []);
            setAgenda(data.agenda || "");
            setHost(data.host || "");
            setEmail(data.email || []);

            const updatedTemplate = template(data.agenda, data.member);
            setEditorContent(data.momContent || updatedTemplate);
          } else {
            console.error("Failed to fetch meeting details");
            setEditorContent(template("", []));
          }
        } catch (error) {
          console.error("Error while fetching meeting details:", error);
          setEditorContent(template("", []));
        } finally {
          setIsLoading(false);
        }
      };

      fetchMeetingDetails();
    } else {
      setEditorContent(template("", []));
    }
  }, [meetingId]);

  const handleEditorChange = (content) => setEditorContent(content);

  const saveMomContent = async () => {
    if (!meetingId) {
      alert("Meeting ID is required to save MOM.");
      return;
    }

    if (!editorContent) {
      alert("MOM content cannot be empty.");
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
        alert("MOM saved and email sent successfully!");
        console.log("Server Response:", result);
      } else {
        const errorData = await response.json();
        console.error("Error saving MOM:", errorData);
        alert(errorData.message || "Failed to save MOM.");
      }
    } catch (error) {
      console.error("Error while saving MOM:", error);
      alert("An unexpected error occurred while saving MOM.");
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
                parts: [
                  {
                    text: editorContent || template("", []),
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setEditorContent(data.candidates[0].content.parts[0].text);
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
      <aside className="w-1/4 bg-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-600 h-12 w-12 flex justify-center items-center">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{host}</h2>
            <p className="text-gray-600 text-sm">Professor</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Members</h3>
          <ul className="mt-2">
            {members.length > 0 ? (
              members.map((member, index) => (
                <li key={index} className="text-gray-700">
                  {index + 1}. {member}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No members found.</p>
            )}
          </ul>
        </div>
      </aside>

      <div className="flex-1 p-8">
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={{
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
            ],
          }}
        />
        <div className="mt-6 flex space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2"
            onClick={saveMomContent}
          >
            Save MOM
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2"
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
