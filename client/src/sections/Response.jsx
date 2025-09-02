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

    if (email === "AJMEL" && password === "mia051725") {
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
    .sort((a, b) => new Date(b.responded_at) - new Date(a.responded_at)); // Sort by `responded_at` in descending order

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 md:p-6">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Login
            </h2>
            <form className="w-full max-w-sm md:max-w-md bg-gray-50 p-4 md:p-6 rounded-lg shadow-md">
              <Login handleLogin={handleLogin} />
            </form>
          </div>
        ) : loading ? (
          <div className="text-center text-xl md:text-2xl font-bold text-indigo-600">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-bold">{error}</div>
        ) : (
          <div>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-indigo-700 mb-4 md:mb-6">
              Guest List
            </h2>

            <div className="flex flex-wrap justify-between bg-indigo-100 p-3 md:p-4 rounded-lg shadow-md mb-4 md:mb-6">
              <div className="text-indigo-700 font-semibold text-sm md:text-base">
                Total: <span className="font-bold">{totalGuests}</span>
              </div>
              <div className="text-green-600 font-semibold text-sm md:text-base">
                Accepted: <span className="font-bold">{acceptedGuests}</span>
              </div>
              <div className="text-red-600 font-semibold text-sm md:text-base">
                Declined: <span className="font-bold">{declinedGuests}</span>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <select
                className="w-full md:w-auto bg-white text-gray-700 p-2 rounded border border-gray-300"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Guests</option>
                <option value="accept">Accepted</option>
                <option value="decline">Declined</option>
              </select>
            </div>

            {/* Responsive table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-indigo-600 text-white text-sm md:text-base">
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left">
                      Guest Name
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left">
                      Email
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left">
                      Response
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                        } hover:bg-gray-200 transition-colors text-xs md:text-sm`}
                      >
                        <td className="px-3 md:px-6 py-2 md:py-3 border">
                          {guest.guest}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-3 border">
                          {guest.email}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-3 border text-center">
                          <span
                            className={`px-2 md:px-3 py-1 text-xs md:text-sm font-semibold rounded ${
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
                        <td className="px-3 md:px-6 py-2 md:py-3 border">
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
                        className="text-center text-gray-500 py-3"
                      >
                        No guests available.
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
