// filepath: c:\Users\Shifa\Desktop\REST\middleware.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3000; // Middleware server port

// Proxy configuration
app.use("/api", createProxyMiddleware({
    target: "http://localhost:5000", // Target server
    changeOrigin: true,
    pathRewrite: {
        "^/api": "/api", // Rewrite path if necessary
    },
}));

app.use("/static", createProxyMiddleware({
    target: "http://localhost:5000", // Target server
    changeOrigin: true,
    pathRewrite: {
        "^/static": "/static", // Rewrite path if necessary
    },
}));

app.use("/", createProxyMiddleware({
    target: "http://localhost:5000", // Target server
    changeOrigin: true,
}));

// Start the middleware server
app.listen(PORT, () => {
    console.log(`Middleware server running on http://localhost:${PORT}`);
});