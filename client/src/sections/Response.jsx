import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "../components/Login";
import AddGuest from "../components/AddGuest";

const Response = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [totalGuests, setTotalGuests] = useState(0);
  const [acceptedGuests, setAcceptedGuests] = useState(0);
  const [declinedGuests, setDeclinedGuests] = useState(0);
  const [hideTop, setHideTop] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [newResponse, setNewResponse] = useState("");

  // Use your Vercel deployment URL here
  const URL = "http://localhost:5000"; // change for production
  // const URL = "https://rsvp-for-louie-and-eli-wedding-lraj.vercel.app";

  // Login handler
  const handleLogin = (e, email, password) => {
    e.preventDefault();
    setError("");
    if (email === "LOUIEELIZA" && password === "LOUIEELIZA121325") {
      setIsLoggedIn(true);
      toast.success("Login successful!");
    } else {
      setError("Invalid email or password.");
      toast.error("Invalid email or password.");
    }
  };

  // Filter change
  const handleFilterChange = (e) => setFilter(e.target.value);

  // Fetch all guest responses
  const fetchGuestList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${URL}/response`);
      setGuestList(res.data);
      updateGuestCounts(res.data);
    } catch (err) {
      setError("Failed to fetch guest list.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchGuestList();
  }, [isLoggedIn]);

  // Update guest stats
  const updateGuestCounts = (guests) => {
    setTotalGuests(guests.length);
    setAcceptedGuests(guests.filter((g) => g.response === "accept").length);
    setDeclinedGuests(guests.filter((g) => g.response === "decline").length);
  };

  // Filtered guests
  const filteredGuests = guestList
    .filter((g) => filter === "all" || g.response === filter)
    .sort((a, b) => new Date(b.responded_at) - new Date(a.responded_at));

  // Handle new guest added
  const handleGuestAdded = (newGuest) => {
    setGuestList((prev) => [newGuest, ...prev]);
    updateGuestCounts([newGuest, ...guestList]);
  };

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setHideTop(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Edit modal
  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setNewResponse(guest.response || "");
  };

  // Save guest response
  const handleSaveResponse = async () => {
    if (!newResponse) {
      toast.error("Please select a response before saving.");
      return;
    }

    try {
      await axios.put(`${URL}/response/${editingGuest.id}`, {
        response: newResponse,
      });

      const updatedGuests = guestList.map((g) =>
        g.id === editingGuest.id
          ? {
              ...g,
              response: newResponse,
              responded_at: new Date().toISOString(),
            }
          : g
      );

      setGuestList(updatedGuests);
      updateGuestCounts(updatedGuests);
      toast.success("Response updated successfully!");
      setEditingGuest(null);
    } catch (err) {
      console.error("Error updating response:", err);
      toast.error("Failed to update response.");
    }
  };

  // Delete guest response
  const handleDeleteResponse = async (guestId) => {
    try {
      await axios.delete(`${URL}/response/${guestId}`);
      const updatedGuests = guestList.filter((g) => g.id !== guestId);
      setGuestList(updatedGuests);
      updateGuestCounts(updatedGuests);
      toast.success("Response deleted successfully!");
      if (editingGuest && editingGuest.id === guestId) setEditingGuest(null);
    } catch (err) {
      console.error("Error deleting response:", err);
      toast.error("Failed to delete response.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#122029] flex justify-center items-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#C8692C] mb-6">
            Admin Login
          </h2>
          <form className="w-full bg-white p-8 rounded-xl shadow-xl space-y-6 border border-[#C8692C]/40">
            <Login handleLogin={handleLogin} />
          </form>
        </div>
      ) : (
        <div
          className="w-full max-w-6xl bg-white shadow-xl rounded-lg p-6 md:p-8 flex flex-col"
          style={{ height: "calc(100vh - 40px)" }}
        >
          {loading ? (
            <div className="flex justify-center items-center flex-1">
              <div className="text-xl md:text-2xl font-semibold text-indigo-600 animate-pulse">
                Loading guest list...
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center flex-1">
              <div className="text-center text-red-600 font-semibold text-lg">
                {error}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 h-full">
              <h2 className="text-center text-3xl md:text-4xl font-bold text-[#122029] mb-6">
                Guest List
              </h2>

              {/* Stats & Filter */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  hideTop ? "h-0 opacity-0 mb-0" : "h-auto opacity-100 mb-4"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-3 bg-[#122029]/10 p-4 rounded-lg shadow">
                  <div className="text-[#122029] font-semibold">
                    Total: <span className="font-bold">{totalGuests}</span>
                  </div>
                  <div className="text-green-700 font-semibold">
                    Accepted:{" "}
                    <span className="font-bold">{acceptedGuests}</span>
                  </div>
                  <div className="text-red-700 font-semibold">
                    Declined:{" "}
                    <span className="font-bold">{declinedGuests}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="w-full sm:w-auto">
                    <AddGuest
                      onGuestAdded={handleGuestAdded}
                      className="w-full"
                    />
                  </div>
                  <select
                    className="w-full sm:w-auto bg-white text-gray-700 text-center p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#122029]"
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Guests</option>
                    <option value="accept">Accepted</option>
                    <option value="decline">Declined</option>
                  </select>
                </div>
              </div>

              {/* Guest Table */}
              <div className="flex-1 overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full border-collapse bg-white text-sm">
                  <thead className="sticky top-0 z-10 bg-[#122029] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Guest Name</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-4 py-3 text-center">Response</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">
                        Time
                      </th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map((guest, index) => (
                        <tr
                          key={guest.id}
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-[#122029]/10 transition-colors`}
                        >
                          <td className="px-4 py-3 border">{guest.guest}</td>
                          <td className="px-4 py-3 border hidden sm:table-cell">
                            {guest.email}
                          </td>
                          <td className="px-4 py-3 border text-center flex justify-center items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                guest.response === "accept"
                                  ? "bg-green-100 text-green-700"
                                  : guest.response === "decline"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {guest.response || "No Response"}
                            </span>
                          </td>
                          <td className="px-4 py-3 border hidden sm:table-cell">
                            {guest.responded_at
                              ? format(
                                  new Date(guest.responded_at),
                                  "MMM dd, yyyy hh:mm a"
                                )
                              : ""}
                          </td>
                          <td className="px-4 py-3 border text-center">
                            {guest.response ? (
                              <button
                                onClick={() => openEditModal(guest)}
                                className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                              >
                                Edit
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs italic">
                                No Response
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-gray-500 py-6"
                        >
                          No guests found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingGuest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Edit Response for {editingGuest.guest}
            </h3>
            <select
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select Response</option>
              <option value="accept">Accept</option>
              <option value="decline">Decline</option>
            </select>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => handleDeleteResponse(editingGuest.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveResponse}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Response;
