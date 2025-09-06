import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "../components/Login";

const Response = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [totalGuests, setTotalGuests] = useState(0);
  const [acceptedGuests, setAcceptedGuests] = useState(0);
  const [declinedGuests, setDeclinedGuests] = useState(0);

  const URL = "https://wedding-rsvp-9ynq.vercel.app";

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

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchGuestList = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await axios.get(`${URL}/response`);
          setGuestList(response.data);
          updateGuestCounts(response.data);
          toast.success("Guest list loaded successfully!");
        } catch (err) {
          setError("Failed to fetch guest list.");
          console.error("API Error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchGuestList();
    }
  }, [isLoggedIn]);

  const updateGuestCounts = (guests) => {
    const total = guests.length;
    const accepted = guests.filter(
      (guest) => guest.response === "accept"
    ).length;
    const declined = guests.filter(
      (guest) => guest.response === "decline"
    ).length;
    setTotalGuests(total);
    setAcceptedGuests(accepted);
    setDeclinedGuests(declined);
  };

  const filteredGuests = guestList
    .filter((guest) => {
      if (filter === "all") return true;
      return guest.response === filter;
    })
    .sort((a, b) => new Date(b.responded_at) - new Date(a.responded_at));

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-6 md:p-8 overflow-hidden">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[80vh]">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
              Admin Login
            </h2>
            <form className="w-full max-w-sm md:max-w-md bg-gray-50 p-6 rounded-xl shadow-lg">
              <Login handleLogin={handleLogin} />
            </form>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-xl md:text-2xl font-semibold text-indigo-600 animate-pulse">
              Loading guest list...
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center text-red-600 font-semibold text-lg">
              {error}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-center text-3xl md:text-4xl font-bold text-indigo-700 mb-6">
              Guest List
            </h2>

            {/* Stats */}
            <div className="flex flex-col md:flex-row md:justify-between gap-3 bg-indigo-50 p-4 rounded-lg shadow mb-6">
              <div className="text-indigo-700 font-semibold">
                Total: <span className="font-bold">{totalGuests}</span>
              </div>
              <div className="text-green-600 font-semibold">
                Accepted: <span className="font-bold">{acceptedGuests}</span>
              </div>
              <div className="text-red-600 font-semibold">
                Declined: <span className="font-bold">{declinedGuests}</span>
              </div>
            </div>

            {/* Filter */}
            <div className="flex justify-end mb-4">
              <select
                className="w-full md:w-auto bg-white text-gray-700 p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Guests</option>
                <option value="accept">Accepted</option>
                <option value="decline">Declined</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full border-collapse bg-white shadow rounded-lg">
                <thead className="sticky top-0 z-10 bg-indigo-600 text-white text-sm md:text-base">
                  <tr>
                    <th className="px-4 py-3 text-left">Guest Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-center">Response</th>
                    <th className="px-4 py-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-indigo-50 transition-colors text-xs md:text-sm`}
                      >
                        <td className="px-4 py-3 border">{guest.guest}</td>
                        <td className="px-4 py-3 border">{guest.email}</td>
                        <td className="px-4 py-3 border text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                        <td className="px-4 py-3 border">
                          {guest.responded_at
                            ? format(
                                new Date(guest.responded_at),
                                "MMM dd, yyyy hh:mm a"
                              )
                            : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
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
    </div>
  );
};

export default Response;
