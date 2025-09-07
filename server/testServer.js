import express from "express";

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.post("/test", (req, res) => {
  console.log("POST /test hit", req.body);
  res.json({ success: true, body: req.body });
});

// AddName route
app.post("/addName", (req, res) => {
  console.log("POST /addName hit", req.body);
  const { guestName } = req.body;

  if (!guestName || guestName.trim() === "") {
    return res.status(400).json({ error: "Guest name is required" });
  }

  // Mock response for now
  res.status(201).json({
    success: true,
    message: "Guest added successfully",
    guest: guestName.trim(),
  });
});

// Catch-all for unknown routes
app.all("*", (req, res) => {
  console.log("Unknown route hit:", req.method, req.url);
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
