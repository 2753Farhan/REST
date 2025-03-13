const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

// Serve static files with caching
app.use("/static", express.static(path.join(__dirname, "public"), {
  maxAge: "1h", // Cache static assets for 1 hour
}));

// Simple route for the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// Simple API route with caching
app.get("/api/data", (req, res) => {
    res.set("Cache-Control", "public, max-age=60"); // Cache API response for 1 minute
    res.json({ message: "This is cached data!" });
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});