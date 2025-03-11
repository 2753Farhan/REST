require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(helmet()); // Security best practices
app.use(morgan("dev")); // Logging
app.use((req, res, next) => {
  res.header("Cache-Control", "private, max-age=3600"); // Cacheable Responses
  next();
});

// Sample Data (Simulating a Database)
let books = [
  { id: 1, title: "The Pragmatic Programmer", author: "Andy Hunt" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin" },
];

// RESTful Routes

// 1. Get all books (Uniform Interface, Stateless)
app.get("/api/books", (req, res) => {
  res.json(books);
});

// 2. Get a single book by ID (Stateless)
app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// 3. Create a new book (Stateless, Client-Server)
app.post("/api/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ message: "Title and author required" });

  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. Update a book (Stateless)
app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { title, author } = req.body;
  book.title = title || book.title;
  book.author = author || book.author;
  res.json(book);
});

// 5. Delete a book (Stateless)
app.delete("/api/books/:id", (req, res) => {
  books = books.filter((b) => b.id !== parseInt(req.params.id));
  res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
