// ... other imports
import React, { useState } from "react";
import img from "../assets/RSVPhorizontal.jpg";
import { FaEnvelope, FaSearch, FaUser } from "react-icons/fa";
import RsvpHeader from "../components/RsvpHeader";
import InputForm from "../components/InputForm";
import Button from "../components/Button";
import AddName from "../components/AddName";
import ResponseMessage from "../components/ResponseMessage";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RSVPForm = () => {
  const [guestName, setGuestName] = useState("");
  const [guest, setGuest] = useState([]);
  const [loadingGuests, setLoadingGuests] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);
  const [isAttending, setIsAttending] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [guestEmails, setGuestEmails] = useState({});
  const [showAddNameModal, setShowAddNameModal] = useState(false);

  const readOnly = true;
  const URL = "http://localhost:5000";

  const guestListBaseNames = [
    "Kharllo Miguel Pernetes",
    "Patrick Anthony Dominguez",
    "Khristian Paul Pimentel",
    "John Curt Pascual",
    "Katrina Caña",
    "John Carlos Cuadra",
    "Kyle Phillip Laconsay",
    "Angelo Cordero",
    "Urberto Bulatao",
    "Mark Jonh Bautista",
    "Lorna Almondia",
    "Glorina Villaluz",
    "Marita Tamayosa",
    "Conchita Zurita",
    "Rowena Pangalanan",
    "Cristina Malabanan",
  ];

  // --- Search Guest ---
  const searchGuest = async () => {
    if (!guestName.trim()) {
      toast.error("Please enter a name to search.");
      return;
    }

    setSearchPerformed(true);
    const toastId = toast.info("Searching for your name...", {
      autoClose: false,
    });

    try {
      const response = await axios.get(`${URL}/guest?guestName=${guestName}`);
      toast.dismiss(toastId);

      if (!response.data || response.data.length === 0) {
        toast.warning("No name found.");
        setSearchPerformed(false);
        return;
      }

      if (response.data.message) {
        toast.info(response.data.message);
        setSearchPerformed(false);
        return;
      }

      setGuest(response.data);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong. Please try again.");
      setGuest([]);
      setSearchPerformed(false);
    }
  };

  // --- Handle Guest Selection ---
  const handleGuestSelect = (id) => {
    setSelectedGuestId((prev) => (prev === id ? null : id));
  };

  const handleEmailChange = (e, guestId) => {
    setGuestEmails((prev) => ({ ...prev, [guestId]: e.target.value }));
  };

  const handleInputChange = (e) => setGuestName(e.target.value);

  // --- Handle Response (Accept / Decline) ---
  const handleResponse = async (id, action, email) => {
    if (!selectedGuestId) {
      toast.error("Please select a guest before responding.");
      return;
    }
    if (!email || !email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const url =
      action === "accept" ? `${URL}/guest/accept` : `${URL}/guest/decline`;

    try {
      setLoadingGuests((prev) => ({ ...prev, [id]: true }));
      const sendingToastId = toast.info("Sending response...", {
        autoClose: false,
      });

      await axios.post(url, { guestId: id, email, action });

      toast.dismiss(sendingToastId);
      toast.success("Response submitted successfully!", { autoClose: 3000 });

      setResponseReceived(true);
      setIsAttending(action === "accept");

      const guestObj = guest.find((g) => g.id === id);

      // Show AddName modal only for specific main guests
      if (
        action === "accept" &&
        guestObj &&
        guestListBaseNames.includes(guestObj.guest)
      ) {
        setShowAddNameModal(true); // Keep selectedGuestId for AddName
      }

      // Clear guest list but keep selectedGuestId
      setGuest([]);
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingGuests((prev) => ({ ...prev, [id]: false }));
    }
  };

  // --- Reset Search ---
  const resetSearch = () => {
    setGuest([]);
    setResponseReceived(false);
    setSearchPerformed(false);
    setGuestName("");
    setSelectedGuestId(null);
    setShowAddNameModal(false);
    setIsAttending(null);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 w-full max-w-4xl text-white px-6 mt-10">
        <RsvpHeader />
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
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
              <Button label="Find" onClick={searchGuest} />
              <p className="text-xs sm:text-sm text-gray-300 mt-24">
                Please search for your name and let us know if you can make it
                or not. Thank you!
              </p>
            </>
          )}

          {guest.length > 0 && !responseReceived && (
            <div className="mt-6 p-8 rounded-lg shadow-xl space-y-8">
              <p className="text-4xl font-semibold text-white-800 font-greatVibes">
                Will you celebrate with us?
              </p>
              <div className="space-y-6">
                {guest.map((g) => (
                  <div
                    key={g.id}
                    className="flex flex-col sm:flex-row sm:items-start rounded-lg p-6 space-y-6 sm:space-x-8 sm:space-y-0 relative"
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
                      value={guestEmails[g.id] || ""}
                      onChange={(e) => handleEmailChange(e, g.id)}
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
                        disabled={
                          selectedGuestId !== g.id || loadingGuests[g.id]
                        }
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
                        disabled={
                          selectedGuestId !== g.id || loadingGuests[g.id]
                        }
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {responseReceived && (
            <>
              <ResponseMessage
                message="Thank you for your response!"
                isAttending={isAttending}
              />

              {isAttending && showAddNameModal && (
                <AddName
                  mainGuestId={selectedGuestId} // Keep mainGuestId until modal closes
                  onGuestAdded={() => setShowAddNameModal(false)}
                />
              )}

              {!showAddNameModal && (
                <div className="mt-6">
                  <Button label="Search Again" onClick={resetSearch} />
                </div>
              )}
            </>
          )}
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default RSVPForm;
