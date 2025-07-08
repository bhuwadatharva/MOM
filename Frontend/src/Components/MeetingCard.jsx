import { CalendarDays } from "lucide-react";

const MeetingCard = ({ title, date }) => {
  return (
    <div className="p-6 rounded-2xl border border-black bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <CalendarDays className="text-black w-5 h-5" />
      </div>
      <p className="text-sm text-gray-700 font-medium">
        Date:{" "}
        <span className="text-black font-semibold">
          {new Date(date).toLocaleDateString()}
        </span>
      </p>
    </div>
  );
};

export default MeetingCard;
