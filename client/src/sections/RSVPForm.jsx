import React, { useState } from "react";
import img from "../assets/RSVPhorizontal.jpg";
import { FaEnvelope, FaSearch, FaUser } from "react-icons/fa";
import RsvpHeader from "../components/RsvpHeader";
import InputForm from "../components/InputForm";
import Button from "../components/Button";
import axios from "axios";
import ResponseMessage from "../components/ResponseMessage";
import { BounceLoader } from "react-spinners";

const RSVPForm = () => {
  const [guestName, setGuestName] = useState("");
  const [guest, setGuest] = useState([]); // Holds the list of guests
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false); // Track if response is received
  const [isAttending, setIsAttending] = useState(null); // Track if the guest is attending or not
  const [selectedGuestId, setSelectedGuestId] = useState(null); // Track selected guest for response
  const [guestEmails, setGuestEmails] = useState({}); // Track emails for each guest
  const [loadingGuests, setLoadingGuests] = useState({}); // Track loading status for each guest

  const readOnly = true;
  const URL = "https://rsvp-for-louie-and-eli-wedding-lraj.vercel.app";

  const searchGuest = async () => {
    if (!guestName) {
      setError("Input name required");
      return;
    }

    setLoading(true); // Set loading state before making the API call
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await axios.get(`${URL}/guest?guestName=${guestName}`);
      if (response.data === 0) {
        setError("No name found");
        setSearchPerformed(false);
        return;
      }
      if (response.data.message) {
        setSearchPerformed(false);
        setError(response.data.message);
        return;
      } else {
        setGuest(response.data);
        setSearchPerformed(true);
        setError("");
      }
    } catch (error) {
      setGuest([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false after completion
    }
  };

  const handleEmailChange = (e, guestId) => {
    setGuestEmails((prevEmails) => ({
      ...prevEmails,
      [guestId]: e.target.value, // Update email for the specific guest by guestId
    }));
  };

  const handleInputChange = (e) => {
    setGuestName(e.target.value);
  };

  const handleGuestSelect = (id) => {
    setSelectedGuestId((prevId) => (prevId === id ? null : id)); // Toggle selection
  };

  const handleResponse = async (id, action, email) => {
    if (!selectedGuestId) {
      setError("Please select a guest before responding.");
      return;
    }

    // Ensure the email is valid and not empty
    if (!email || !email.trim()) {
      setError("Email is required.");
      return;
    }

    // Ensure the guestId is also valid
    if (!id) {
      setError("Guest ID is invalid.");
      return;
    }

    const url =
      action === "accept" ? `${URL}/guest/accept` : `${URL}/guest/decline`;

    try {
      // Set the guest as loading while processing the response
      setLoadingGuests((prev) => ({ ...prev, [id]: true }));

      // Make the API call
      const response = await axios.post(url, {
        guestId: id,
        email: email,
        action: action, // Ensure 'action' is passed to handle logic on the server
      });

      // If the response is successful
      setResponseReceived(true);
      setIsAttending(action === "accept");

      // Reset guest data and search state
      setGuest([]);
      setSearchPerformed(false);
      setError(null);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      // Set loading state to false after completion
      setLoadingGuests((prev) => ({ ...prev, [id]: false }));
    }
  };

  const resetSearch = () => {
    setGuest([]);
    setResponseReceived(false);
    setSearchPerformed(false);
    setGuestName("");
    setSelectedGuestId(null);
    setError(null); // Clear any errors
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-4xl text-white px-6 mt-10">
        <RsvpHeader />
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Conditional Rendering for Input and Search */}
          {!searchPerformed && !responseReceived && (
            <>
              <InputForm
                details="Enter Name"
                icon={FaSearch}
                placeholder="Search your name"
                type="text"
                id="search-name"
                htmlFor="search-name"
                value={guestName}
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                onChange={handleInputChange}
              />

              <Button
                label="Find"
                onClick={searchGuest}
                disabled={loading} // Disable button while loading
              />

              <p className="text-xs sm:text-sm text-gray-300 mt-24">
                Please search for your name and let us know if you can make it
                or not. Thank you!
              </p>
            </>
          )}

          {loading && (
            <div className="text-center text-2xl font-bold">Searching...</div>
          )}

          {error && <p className="mt-4 text-red-500 text-xl">{error}</p>}

          {guest.length > 0 && !responseReceived && (
            <div className="mt-6 p-8 rounded-lg shadow-xl space-y-8">
              <p className="text-4xl font-semibold text-white-800 font-greatVibes">
                Will you celebrate with us?
              </p>
              <div className="space-y-6">
                {guest.map((g) => (
                  <div
                    key={g.id}
                    className="flex flex-col sm:flex-row sm:items-start rounded-lg p-6 space-y-6 sm:space-x-8 sm:space-y-0"
                  >
                    <div className="flex justify-start items-center">
                      <input
                        type="checkbox"
                        id={`select-${g.id}`}
                        className="mr-4 flex-shrink-0"
                        onChange={() => handleGuestSelect(g.id)}
                        checked={selectedGuestId === g.id}
                      />
                      <label
                        htmlFor={`select-${g.id}`}
                        className="text-white text-xl font-greatVibes"
                      >
                        Select your name
                      </label>
                    </div>

                    <InputForm
                      icon={FaUser}
                      placeholder="Enter your full name"
                      type="text"
                      id={`guest-${g.id}`}
                      htmlFor={`guest-${g.id}`}
                      value={g.guest}
                      readOnly={readOnly}
                      className="text-xl sm:text-xl w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                    />

                    <InputForm
                      icon={FaEnvelope}
                      placeholder="Email Address"
                      type="email"
                      id={`email-${g.id}`}
                      htmlFor={`email-${g.id}`}
                      value={guestEmails[g.id] || ""} // Get the email for each specific guest
                      onChange={(e) => handleEmailChange(e, g.id)} // Pass the guest id to handle email change
                      className="text-xl sm:text-xl w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                    />

                    <div className="flex space-x-4 w-full sm:w-auto">
                      <button
                        type="button"
                        className={`px-5 py-2 text-lg bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto ${
                          selectedGuestId === g.id
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          handleResponse(g.id, "accept", guestEmails[g.id])
                        }
                        disabled={selectedGuestId !== g.id}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`px-5 py-2 text-lg text-white font-semibold rounded-lg shadow-lg transition duration-300 w-full sm:w-auto ${
                          selectedGuestId === g.id
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        style={{ backgroundColor: "#C8692C" }}
                        onClick={() =>
                          handleResponse(g.id, "decline", guestEmails[g.id])
                        }
                        disabled={selectedGuestId !== g.id}
                      >
                        No
                      </button>
                    </div>

                    {loadingGuests[g.id] && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="text-center text-2xl font-bold text-white p-6 sm:p-8 rounded-lg bg-black bg-opacity-75 shadow-lg w-full max-w-xs sm:max-w-md">
                          <BounceLoader color="#ffffff" size={50} />
                          <p className="text-lg sm:text-2xl mt-4">
                            Sending response... Please wait
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {responseReceived && (
            <ResponseMessage
              message="Thank you for your response!"
              isAttending={isAttending}
            />
          )}

          {responseReceived && (
            <div className="mt-6">
              <Button label="Search Again" onClick={resetSearch} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
