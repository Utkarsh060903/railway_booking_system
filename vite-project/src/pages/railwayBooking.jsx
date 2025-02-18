import React, { useState } from "react";
import Notification from "../components/Notification";
import TrainBooking from "../components/TrainBooking";
import BookingManagement from "../components/BookingManagement";

const RailwaySystem = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (title, message, type = "success") => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 8000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Railway Reservation System
        </h1>
        <Notification notification={notification} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TrainBooking showNotification={showNotification} />
          <BookingManagement showNotification={showNotification} />
        </div>
      </div>
    </div>
  );
};

export default RailwaySystem;
