import React from "react";
import { FaRobot } from "react-icons/fa";

const Message = ({ llm, message }) => {
  if (llm) {
    return (
      <div className="flex items-start">
        <div className="bg-blue-500 rounded-full p-2">
          <FaRobot size={20} />
        </div>
        <div className="ml-4">
          <p className="font-bold">{message}</p>
          <p>MEDTRACK</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-start justify-end">
        <div className="ml-auto bg-gray-500 rounded-full p-2">
          <p className="text-white font-bold">{message}</p>
        </div>
      </div>
    );
  }
};

export default Message;
