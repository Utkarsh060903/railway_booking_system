import React, { useState, useEffect } from "react";

const TrainBooking = ({ showNotification }) => {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      showNotification("Error", "Please login to book tickets", "error");
      setIsAuthorized(false);
      return;
    }
    
    setIsAuthorized(true);
    fetchTrains();
  }, [userId]);

  const fetchTrains = async () => {
    try {
      const response = await fetch("https://railway-booking-system-blza.onrender.com/api/trains", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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
        `https://railway-booking-system-blza.onrender.com/api/trains/${selectedTrain}/availability`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
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
    if (!selectedTrain) {
      showNotification("Error", "Please select a train", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://railway-booking-system-blza.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          trainId: selectedTrain, 
          userId: userId 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification("Success", `Booking confirmed! Booking ID: ${data.bookingId}`, "success");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <p className="text-red-500 text-center">
            Please login to access the ticket booking system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Book Ticket</h2>
        <p className="text-white text-sm mt-1">User ID: {userId}</p>
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
            disabled={loading || !selectedTrain}
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