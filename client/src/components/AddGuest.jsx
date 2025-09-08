import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddGuest = ({ onGuestAdded }) => {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // const URL = "http://localhost:5000"; // change for production
  const URL = "https://rsvp-for-louie-and-eli-wedding-lraj.vercel.app";

  const handleAddGuest = async (e) => {
    e.preventDefault();

    if (!guestName.trim()) {
      toast.error("Guest name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${URL}/guest/add`, {
        guestName,
        email,
      });

      toast.success(res.data.message);

      // Reset form + close modal
      setGuestName("");
      setEmail("");
      setIsOpen(false);

      if (onGuestAdded) {
        onGuestAdded(res.data);
      }
    } catch (err) {
      console.error("Error adding guest:", err);
      toast.error(
        err.response?.data?.error || "Failed to add guest. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {/* Add Guest Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg 
                   border border-green-700 shadow-sm hover:bg-green-700 
                   focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition"
      >
        ➕ Add Guest
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Add Guest
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✖
            </button>

            {/* Form */}
            <form onSubmit={handleAddGuest} className="space-y-4">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Guest Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-green-400 focus:border-green-400 outline-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Guest Email (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-green-400 focus:border-green-400 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg 
                           shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 
                           focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 
                           disabled:cursor-not-allowed transition"
              >
                {loading ? "Adding..." : "Add Guest"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGuest;
