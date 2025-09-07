import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

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
    return res
      .status(400)
      .json({ error: "Guest name and mainGuestId are required." });
  }

  try {
    // Fetch main guest email
    const { data: mainGuestData, error: mainGuestError } = await supabase
      .from("guestlist")
      .select("email")
      .eq("id", mainGuestId)
      .single();

    if (mainGuestError) throw new Error(mainGuestError.message);

    const mainGuestEmail = mainGuestData.email;

    // Insert new guest
    const { data, error } = await supabase
      .from("guestlist")
      .insert([
        {
          guest: guestName.trim(),
          response: "accept",
          email: mainGuestEmail,
          responded_at: new Date().toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
          }),
        },
      ])
      .select("id, guest, response, email");

    if (error) throw new Error(error.message);

    res.status(201).json({ success: true, ...data[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the guest." });
  }
}
