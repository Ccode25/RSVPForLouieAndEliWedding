import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import sendEmail from "./sendEmail.js";

// Load environment variables
dotenv.config();

const app = express();
const port = 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Middleware

const allowedOrigins = [
  "http://localhost:5173", // Allow frontend during development
  "https://rsvp-for-louie-and-eli-wedding-bls34gs8e-ccodes-projects.vercel.app",
  "https://rsvp-for-louie-and-eli-wedding.vercel.app",
  "https://rsvp-for-louie-and-eli-wedding-lraj.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json());

// Utility function for sending error responses
const sendError = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Utility function to handle guest response (accept/decline)
const handleGuestResponse = async (req, res, responseType) => {
  const { guestId, email } = req.body;

  if (!guestId) {
    return sendError(res, 400, "Guest ID is required to update the response.");
  }

  if (!email || email.trim() === "") {
    return sendError(res, 400, "Email is required and cannot be empty.");
  }

  try {
    const respondedAt = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    });

    console.log(respondedAt);

    // Update the guest response in the database
    const { data, error } = await supabase
      .from("guestlist")
      .update({
        response: responseType,
        email: email,
        responded_at: respondedAt,
      })
      .eq("id", guestId)
      .select("id, guest, email, response, responded_at");

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    const { guest } = data[0];
    console.log(guest, responseType, email);

    // Send confirmation email after updating database
    const emailResult = await sendEmail(guest, email, responseType);

    if (!emailResult.success) {
      console.error(
        "Email Error:",
        JSON.stringify({
          error: "Email sending failed",
          guestId,
          action: responseType,
          email,
          reason: emailResult.reason || "Unknown error",
        })
      );
      return sendError(res, 500, "Failed to send email. Check server logs.");
    }

    return res.status(200).json({
      message: `Guest ${
        responseType === "accept" ? "accepted" : "declined"
      } successfully.`,
      ...data[0],
    });
  } catch (error) {
    console.error("Error updating guest response:", error);
    return sendError(res, 500, "An error occurred while updating response.");
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Search for guests by name, excluding those who have responded
app.get("/guest", async (req, res) => {
  const { guestName } = req.query;

  if (!guestName) {
    return sendError(res, 400, "Guest name is required to search.");
  }

  try {
    const { data, error } = await supabase
      .from("guestlist")
      .select("id, guest, response")
      .ilike("guest", `%${guestName}%`);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return res.status(200).json(0); // No matching guest found
    }

    const unrespondedGuests = data.filter((guest) => guest.response === "");

    if (unrespondedGuests.length === 0) {
      return res
        .status(200)
        .json({ message: "All matching guests have already responded." });
    }

    res.status(200).json(unrespondedGuests);
  } catch (error) {
    console.error("Error searching for guest:", error);
    sendError(res, 500, "An error occurred while searching.");
  }
});

// Fetch all guest responses
app.get("/response", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("guestlist")
      .select("guest, email, response, responded_at")
      .order("responded_at", { ascending: false }); // Sort by 'responded_at' in descending order

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching guest responses:", error);
    sendError(res, 500, "Internal Server Error");
  }
});

// Accept a guest
app.post("/guest/accept", (req, res) =>
  handleGuestResponse(req, res, "accept")
);

// Decline a guest
app.post("/guest/decline", (req, res) =>
  handleGuestResponse(req, res, "decline")
);

// Add plus-one guest and auto-accept with main guest's email
app.post("/guest/addName", async (req, res) => {
  const { mainGuestId, guestName } = req.body; // use mainGuestId consistently

  if (!guestName || guestName.trim() === "") {
    return res.status(400).json({ error: "Guest name is required." });
  }

  if (!mainGuestId) {
    return res.status(400).json({ error: "Main guest ID is required." });
  }

  try {
    // Fetch main guest to get email
    const { data: mainGuestData, error: mainGuestError } = await supabase
      .from("guestlist")
      .select("email")
      .eq("id", mainGuestId)
      .single();

    if (mainGuestError) throw new Error(mainGuestError.message);

    const mainGuestEmail = mainGuestData.email;

    // Check if the plus-one guest already exists
    const { data: existingGuest, error: checkError } = await supabase
      .from("guestlist")
      .select("id")
      .ilike("guest", `%${guestName.trim()}%`);

    if (checkError) throw new Error(checkError.message);

    if (existingGuest.length > 0) {
      return res.status(409).json({ error: "Guest already exists." });
    }

    // Insert new guest with auto-accepted response and main guest's email
    const { data, error } = await supabase
      .from("guestlist")
      .insert([
        {
          guest: guestName.trim(),
          response: "accept", // automatically accepted
          email: mainGuestEmail, // inherit main guest email
          responded_at: new Date().toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
          }),
        },
      ])
      .select("id, guest, response, email");

    if (error) throw new Error(error.message);

    res.status(201).json({
      success: true,
      message: `Plus-one guest added and automatically accepted.`,
      ...data[0],
    });
  } catch (error) {
    console.error("Error adding plus-one guest:", error);
    res.status(500).json({
      error: "An error occurred while adding the plus-one guest.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
