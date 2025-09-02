import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Resend } from "resend";
// Load environment variables
dotenv.config();

const app = express();
const port = 5000;

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL, // The URL from your Supabase project
  process.env.SUPABASE_API_KEY // Your Supabase API key
);

// Middleware
app.use(
  cors({
    origin: [
      "https://aeronmelnyweddingrsvp.blog",
      "https://www.aeronmelnyweddingrsvp.blog",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const sendEmail = async (guest, email, response) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Define dynamic content based on response
  const dynamicContent =
    response === "accept"
      ? `
    <p style="font-size: 16px; color: #555;">
      We appreciate you taking the time to respond to our invitation. We have received your <strong>acceptance</strong> response, and we're excited to have you be a part of our event!
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <p style="font-size: 16px; color: #555;">We look forward to celebrating with you!</p>
    </div>
  `
      : `
    <p style="font-size: 16px; color: #555;">
      We appreciate you taking the time to respond to our invitation. We have received your <strong>decline</strong> response, and we're sorry you won't be able to join us for the event.
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <p style="font-size: 16px; color: #555;">If you change your mind, feel free to reach out to us.</p>
    </div>
  `;

  // Send email with dynamic content based on the response
  resend.emails
    .send({
      from: "onboarding@resend.dev",
      to: `${email}`,
      subject: "Thank You for Your Response",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Thank You for Your Response!</h2>
          <p style="font-size: 16px; color: #555;">Dear <strong>${guest}</strong>,</p>
          ${dynamicContent}
          <p style="font-size: 14px; color: #777; text-align: center;">
            Best regards,<br>Your Event Host
          </p>
        </div>
      `,
    })
    .then((response) => {
      console.log("Email sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

// Utility function for sending error responses
const sendError = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Utility function to handle guest response (accept/decline)
const handleGuestResponse = async (req, res, responseType) => {
  const { guestId, email } = req.body;

  // Validate input data
  if (!guestId) {
    return sendError(res, 400, "Guest ID is required to update the response.");
  }

  if (!email || email.trim() === "") {
    return sendError(res, 400, "Email is required and cannot be empty.");
  }

  try {
    // Update guest response and email in Supabase
    const { data, error } = await supabase
      .from("guestlist")
      .update({ response: responseType, email: email }) // Update response and email
      .eq("id", guestId)
      .select("id, guest, email, response");
    console.log(data);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    res.status(200).json({
      message: `Guest ${
        responseType === "accept" ? "accepted" : "declined"
      } successfully.`,
      ...data[0], // Send the updated guest data
    });

    const { guest } = data[0];
    console.log(guest, responseType, email);
    await sendEmail(guest, email, responseType);
  } catch (error) {
    console.error("Error updating guest response:", error);
    sendError(res, 500, "An error occurred while updating the guest response.");
  }
};

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Search for guests by name, excluding those with a response
app.get("/guest", async (req, res) => {
  const { guestName } = req.query;

  if (!guestName) {
    return sendError(res, 400, "Guest name is required to perform the search.");
  }

  try {
    // Query Supabase to search guests in the "guestlist" table
    const { data, error } = await supabase
      .from("guestlist") // Table name updated to "guestlist"
      .select("id, guest, response")
      .ilike("guest", `%${guestName}%`);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return res.status(200).json(0); // Send 0 if no matching guest found
    }

    const unrespondedGuests = data.filter((guest) => guest.response === "");

    if (unrespondedGuests.length === 0) {
      return res
        .status(200)
        .json({ message: "All matching guests have already responded." });
    }

    res.status(200).json(unrespondedGuests);
  } catch (error) {
    console.error(error.message);
    sendError(res, 500, "An error occurred while searching for the guest.");
  }
});

app.get("/response", async (req, res) => {
  try {
    // Query Supabase to get all guest names from the "guestlist" table
    const { data, error } = await supabase
      .from("guestlist") // Table name updated to "guestlist"
      .select("guest, email, response");

    if (error) {
      throw new Error(error.message);
    }

    // Send the names as a response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching guest names:", error);
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
