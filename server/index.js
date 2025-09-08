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
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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

    const { data, error } = await supabase
      .from("guestlist")
      .update({
        response: responseType,
        email: email,
        responded_at: respondedAt,
      })
      .eq("id", guestId)
      .select("id, guest, email, response, responded_at");

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    const { guest } = data[0];

    // Send confirmation email
    const emailResult = await sendEmail(guest, email, responseType);

    if (!emailResult.success) {
      console.error("Email Error:", {
        guestId,
        action: responseType,
        email,
        reason: emailResult.reason || "Unknown error",
      });
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

// Search for guests by name
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

    if (error) throw new Error(error.message);

    if (data.length === 0) {
      return res.status(200).json(0);
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
      .select("id, guest, email, response, responded_at")
      .order("responded_at", { ascending: false });

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching guest responses:", error);
    sendError(res, 500, "Internal Server Error");
  }
});

// Accept / Decline via body
app.post("/response/accept", (req, res) =>
  handleGuestResponse(req, res, "accept")
);

app.post("/response/decline", (req, res) =>
  handleGuestResponse(req, res, "decline")
);

// Add plus-one
app.post("/guest/addPLusOne", async (req, res) => {
  const { guestName } = req.body;

  if (!guestName || guestName.trim() === "") {
    return res.status(400).json({ error: "Guest name is required." });
  }

  try {
    // Check for duplicates
    const { data: existingGuest, error: checkError } = await supabase
      .from("guestlist")
      .select("id")
      .ilike("guest", `%${guestName.trim()}%`);

    if (checkError) throw new Error(checkError.message);

    if (existingGuest.length > 0) {
      return res.status(409).json({ error: "Guest already exists." });
    }

    // Insert new guest with default "pending" response
    const { data, error } = await supabase
      .from("guestlist")
      .insert([
        {
          guest: guestName.trim(),
          response: "",
          responded_at: new Date().toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
          }),
        },
      ])
      .select("id, guest, response");

    if (error) throw new Error(error.message);

    res.status(201).json({
      success: true,
      message: `Guest "${guestName}" added successfully.`,
      ...data[0],
    });
  } catch (error) {
    console.error("Error adding guest:", error);
    res.status(500).json({
      error: "An error occurred while adding the guest.",
    });
  }
});

// Add a new guest directly
app.post("/guest/add", async (req, res) => {
  const { guestName, email } = req.body;

  if (!guestName || guestName.trim() === "") {
    return res.status(400).json({ error: "Guest name is required." });
  }

  try {
    // Check if guest already exists
    const { data: existingGuest, error: checkError } = await supabase
      .from("guestlist")
      .select("id")
      .ilike("guest", `%${guestName.trim()}%`);

    if (checkError) throw new Error(checkError.message);

    if (existingGuest.length > 0) {
      return res.status(409).json({ error: "Guest already exists." });
    }

    // Insert new guest
    const { data, error } = await supabase
      .from("guestlist")
      .insert([
        {
          guest: guestName.trim(),
          email: email || null,
          response: "",
          responded_at: null,
        },
      ])
      .select("id, guest, email, response, responded_at");

    if (error) throw new Error(error.message);

    res.status(201).json({
      success: true,
      message: `Guest '${guestName}' added successfully.`,
      ...data[0],
    });
  } catch (error) {
    console.error("Error adding guest:", error);
    res.status(500).json({
      error: "An error occurred while adding the guest.",
    });
  }
});

// ✅ Edit guest response by ID (frontend calls /response/:id)
app.put("/response/:id", async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  if (!response || (response !== "accept" && response !== "decline")) {
    return sendError(res, 400, "Response must be 'accept' or 'decline'.");
  }

  try {
    const respondedAt = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    });

    const { data, error } = await supabase
      .from("guestlist")
      .update({
        response,
        responded_at: respondedAt,
      })
      .eq("id", id)
      .select("id, guest, email, response, responded_at");

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    res.status(200).json({
      message: `Guest response updated to ${response}.`,
      guest: data[0],
    });
  } catch (error) {
    console.error("Error updating guest response:", error);
    return sendError(res, 500, "An error occurred while updating response.");
  }
});

// Delete guest response (keep name, remove email, response, responded_at)
app.delete("/response/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Reset email, response, responded_at
    const { data, error } = await supabase
      .from("guestlist")
      .update({
        email: null,
        response: "",
        responded_at: null,
      })
      .eq("id", id)
      .select("id, guest, email, response, responded_at");

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    res.status(200).json({
      message: `Guest response deleted successfully.`,
      guest: data[0],
    });
  } catch (error) {
    console.error("Error deleting guest response:", error);
    return sendError(res, 500, "An error occurred while deleting response.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
