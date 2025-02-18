import React from "react";

const Notification = ({ notification }) => {
  if (!notification) return null;

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        notification.type === "error"
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <h3 className="font-semibold">{notification.title}</h3>
      <p>{notification.message}</p>
    </div>
  );
};

export default Notification;
