const Book = require("../models/Book");

// Add Book
// Add Book
const addBook = async (req, res) => {
  try {

    if (req.body.category) {
      req.body.category =
        req.body.category.charAt(0).toUpperCase() +
        req.body.category.slice(1).toLowerCase();
    }

    const book = new Book({
      ...req.body,

      // Cloudinary image URL
      image: req.file ? req.file.path : ""
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Book
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {
     if (req.body.category) {
      req.body.category =
        req.body.category.charAt(0).toUpperCase() +
        req.body.category.slice(1).toLowerCase();
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBook, getBooks, getBookById, updateBook, deleteBook };