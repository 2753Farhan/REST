const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4000;

// Serve static files with caching
app.use("/static", express.static(path.join(__dirname, "public"), {
  maxAge: "1h", // Cache static assets for 1 hour
}));

// Simple route for the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// shurvo's part

// Simple API route with caching
// app.get("/api/data", (req, res) => {
//     res.set("Cache-Control", "public, max-age=60"); // Cache API response for 1 minute
//     res.json({ message: "This is cached data! yes" });
//   });

app.get("/api/data", (req, res) => {
  res.set("Cache-Control", "no-cache"); // Cache API response for 1 minute
  res.json({ message: "This is cached data! yes" });
// Helper function to get the last modified timestamp of the data file
function getLastModified() {
  const stats = fs.statSync(path.join(__dirname, "data.txt"));
  return stats.mtime; // Returns the last modified time of the file
}

// API route with caching and If-Modified-Since support
app.get("/api/data", (req, res) => {
  const lastModified = getLastModified().toUTCString();
  res.set("Last-Modified", lastModified);

  // Check If-Modified-Since header
  const ifModifiedSince = req.headers["if-modified-since"];
  if (ifModifiedSince && new Date(ifModifiedSince) >= getLastModified()) {
    // Resource hasn't changed, send 304 Not Modified
    return res.status(304).send();
  }

  // Read data from the text file (dummy database)
  fs.readFile(path.join(__dirname, "data.txt"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to read data" });
    }

    // Send the full response with caching headers
    res.set("Cache-Control", "public, max-age=60"); // Cache API response for 1 minute
    res.json({ message: data.trim() });
  });
});

// Route to update the data in the text file (simulate a change)
app.post("/api/update", (req, res) => {
  const newData = "This is updated data!";
  fs.writeFile(path.join(__dirname, "data.txt"), newData, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update data" });
    }

    res.json({ message: "Data updated successfully!", lastModified: getLastModified().toUTCString() });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});