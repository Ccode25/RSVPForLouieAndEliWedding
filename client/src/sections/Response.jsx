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
  const [hideTop, setHideTop] = useState(false);

  // const URL = "http://localhost:5000";
  const URL = "https://rsvp-for-louie-and-eli-wedding-lraj.vercel.app";

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

  const handleFilterChange = (e) => setFilter(e.target.value);

  useEffect(() => {
    if (!isLoggedIn) return;

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
  }, [isLoggedIn]);

  const updateGuestCounts = (guests) => {
    setTotalGuests(guests.length);
    setAcceptedGuests(guests.filter((g) => g.response === "accept").length);
    setDeclinedGuests(guests.filter((g) => g.response === "decline").length);
  };

  const filteredGuests = guestList
    .filter((g) => filter === "all" || g.response === filter)
    .sort((a, b) => new Date(b.responded_at) - new Date(a.responded_at));

  useEffect(() => {
    const handleScroll = () => setHideTop(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#122029] flex justify-center items-center p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {!isLoggedIn ? (
        // ✅ Admin Login screen
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#C8692C] mb-6">
            Admin Login
          </h2>

          <form className="w-full bg-white p-8 rounded-xl shadow-xl space-y-6 border border-[#C8692C]/40">
            <Login handleLogin={handleLogin} />
          </form>
        </div>
      ) : (
        // ✅ Guest List screen
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

                <div className="flex justify-end mt-2">
                  <select
                    className="w-full md:w-auto bg-white text-gray-700 p-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#122029]"
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Guests</option>
                    <option value="accept">Accepted</option>
                    <option value="decline">Declined</option>
                  </select>
                </div>
              </div>

              {/* Scrollable Table */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map((guest, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-[#122029]/10 transition-colors`}
                        >
                          <td className="px-4 py-3 border">{guest.guest}</td>
                          <td className="px-4 py-3 border hidden sm:table-cell">
                            {guest.email}
                          </td>
                          <td className="px-4 py-3 border text-center">
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
      )}
    </div>
  );
};

export default Response;
