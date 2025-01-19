import React from "react";

const MeetingCard = ({ title, description, date }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
};

export default MeetingCard;
