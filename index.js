// index.js
require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const { MeiliSearch } = require("meilisearch");

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_SERVER_URL,
  apiKey: process.env.MEILISEARCH_API_KEY,
});

// Middleware to parse JSON requests
app.use(express.json());

// API to add documents (movies) to the MeiliSearch index
app.post("/movies", async (req, res) => {
  try {
    const index = client.index("movies");
    const movies = req.body.movies; // Expects an array of movie objects
    const response = await index.addDocuments(movies);
    return res
      .status(200)
      .json({ message: "Movies added successfully", response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// API to search for movies in the MeiliSearch index
app.get("/movies/search", async (req, res) => {
  try {
    const query = req.query.q; // Search term passed as a query parameter
    const index = client.index("movies");
    const searchResults = await index.search(query);
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple route for testing the server
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
