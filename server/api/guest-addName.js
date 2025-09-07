// /api/guest-addName.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mainGuestId, guestName } = req.body;

  if (!guestName || !mainGuestId) {
    return res.status(400).json({ error: "Guest name and mainGuestId are required." });
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

    // Check if the guest already exists
    const { data: existingGuest, error: checkError } = await supabase
      .from("guestlist")
      .select("id")
      .ilike("guest", `%${guestName.trim()}%`);

    if (checkError) throw new Error(checkError.message);

    if (existingGuest.length > 0) {
      return res.status(409).json({ error: "Guest already exists." });
    }

    // Insert new guest with auto-accepted response
    const { data, error } = await supabase
      .from("guestlist")
      .insert([
        {
          guest: guestName.trim(),
          response: "accept",
          email: mainGuestEmail,
          responded_at: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
        },
      ])
      .select("id, guest, response, email");

    if (error) throw new Error(error.message);

    return res.status(201).json({
      success: true,
      message: "Plus-one guest added and automatically accepted.",
      ...data[0],
    });
  } catch (error) {
    console.error("Error adding guest:", error);
    return res.status(500).json({ error: "An error occurred while adding the guest." });
  }
}
