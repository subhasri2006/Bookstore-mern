const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // ✅ IMPORTANT (you missed this)
const path = require("path");

const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ✅ 1. SEARCH (MUST BE FIRST)
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    });

    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Search failed" });
  }
});


// ✅ 2. SUGGESTIONS
router.get("/suggestions", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.json([]);

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    })
    .limit(5)
    .select("title author category");

    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Suggestion failed" });
  }
});


// ✅ 3. GET ALL BOOKS
router.get("/", getBooks);

router.get("/categories", async (req, res) => {
  try {
    const categories = await Book.distinct("category");
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});
router.get("/category/:category", async (req, res) => {
  try {
    const books = await Book.find({
      category: req.params.category
    });

    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch books"
    });
  }
});
// ✅ 4. GET BOOK BY ID (ALWAYS LAST)
router.get("/:id", getBookById);


// ✅ ADMIN ROUTES
router.post("/", addBook);
router.put("/:id", authMiddleware, adminMiddleware, updateBook);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);


// ✅ READ PDF
router.get("/read/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads/books", req.params.filename);
  res.sendFile(filePath);
});

module.exports = router;