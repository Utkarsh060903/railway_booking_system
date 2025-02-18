import React, { useState } from "react";

const BookingManagement = ({ showNotification }) => {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!bookingId) {
      showNotification("Error", "Please enter booking ID", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/bookings/${bookingId}`
      );
      const data = await response.json();
      showNotification("Booking Status", `Status: ${data.status}`);
    } catch (error) {
      showNotification("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const cancelTicket = async () => {
    if (!bookingId) {
      showNotification("Error", "Please enter booking ID", "error");
      return;
    }

    try {
      setLoading(true);
      await fetch(`http://localhost:3000/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
      });
      showNotification("Success", "Booking cancelled successfully");
    } catch (error) {
      showNotification("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Manage Booking</h2>
      </div>
      <div className="p-6 space-y-4">
        <input
          type="text"
          placeholder="Enter Booking ID"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />

        <div className="flex space-x-4">
          <button
            onClick={checkStatus}
            disabled={loading || !bookingId}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Check Status
          </button>

          <button
            onClick={cancelTicket}
            disabled={loading || !bookingId}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            Cancel Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
