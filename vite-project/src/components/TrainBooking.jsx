import React, { useState, useEffect } from "react";

const TrainBooking = ({ showNotification }) => {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await fetch("https://railway-booking-system-qf4u.onrender.com/api/trains");
      const data = await response.json();
      setTrains(data);
    } catch (error) {
      showNotification("Error", "Failed to fetch trains", "error");
    }
  };

  const checkAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://railway-booking-system-qf4u.onrender.com/api/trains/${selectedTrain}/availability`
      );
      const data = await response.json();
      showNotification("Seat Availability", `Available seats: ${data.availableSeats}`);
    } catch (error) {
      showNotification("Error", "Failed to check availability", "error");
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async () => {
    if (!selectedTrain || !userId) {
      showNotification("Error", "Please select a train and enter user ID", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://railway-booking-system-qf4u.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainId: selectedTrain, userId }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification("Success", `Booking confirmed! Booking ID: ${data.bookingId}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Book Ticket</h2>
      </div>
      <div className="p-6 space-y-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedTrain || ""}
          onChange={(e) => setSelectedTrain(e.target.value)}
        >
          <option value="">Select Train</option>
          {trains.map((train) => (
            <option key={train.trainId} value={train.trainId}>
              {train.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter User ID"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <div className="flex space-x-4">
          <button
            onClick={checkAvailability}
            disabled={loading || !selectedTrain}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Check Availability
          </button>

          <button
            onClick={bookTicket}
            disabled={loading || !selectedTrain || !userId}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainBooking;
