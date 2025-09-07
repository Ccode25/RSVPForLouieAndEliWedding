import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";

const AddName = ({ mainGuestId, onGuestAdded }) => {
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [wantsToAddGuest, setWantsToAddGuest] = useState(null); // null = not chosen yet
  const [validGuestId, setValidGuestId] = useState(false);

  useEffect(() => {
    if (mainGuestId) {
      setValidGuestId(true);
    } else {
      setValidGuestId(false);
      toast.error("Main guest ID is missing. Cannot add guest.");
    }
  }, [mainGuestId]);

  const handleAddGuest = async () => {
    if (!validGuestId) return;

    if (!guestName.trim()) {
      toast.error("Please enter a guest name.");
      return;
    }

    setLoading(true);

    try {
      // const response = await axios.post("http://localhost:5000/guest/addName", {
      //   guestName: guestName.trim(),
      //   mainGuestId, // associate with main guest
      // });

      const response = await axios.post(
        "https://rsvp-for-louie-and-eli-wedding-lraj.vercel.app/guest/addName",
        {
          guestName: guestName.trim(),
          mainGuestId, // associate with main guest
        }
      );

      toast.success(`Guest added successfully: ${response.data.guest}`);
      setGuestName("");

      if (onGuestAdded) onGuestAdded(); // Close modal after adding
    } catch (err) {
      toast.error(
        err.response?.data?.error || "An error occurred while adding guest"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onGuestAdded) onGuestAdded(); // close modal without adding
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-gray-800 p-6 rounded-3xl w-full max-w-md mx-auto text-white shadow-2xl transform transition-transform duration-300 scale-100">
        {!validGuestId ? (
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">Cannot add guest</h3>
            <p>Main guest ID is missing. Cannot proceed.</p>
            <button
              onClick={handleClose}
              className="w-full py-3 text-white font-semibold rounded-full bg-red-600 hover:bg-red-700 transition duration-300"
            >
              Close
            </button>
          </div>
        ) : wantsToAddGuest === null ? (
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">
              Would you like to add a guest with you?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => setWantsToAddGuest(true)}
                className="flex-1 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-[#C8692C] to-[#a0521f] hover:scale-105 transition transform duration-300"
              >
                Yes
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-[#C8692C] to-[#a0521f] hover:scale-105 transition transform duration-300"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Add New Guest</h3>
            <InputForm
              details="Guest Name"
              placeholder="Enter guest name"
              type="text"
              id="add-guest"
              htmlFor="add-guest"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleAddGuest}
                disabled={loading}
                className={`flex-1 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-[#C8692C] to-[#a0521f] hover:scale-105 transition transform duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Adding..." : "Add Guest"}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-[#C8692C] to-[#a0521f] hover:scale-105 transition transform duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddName;
