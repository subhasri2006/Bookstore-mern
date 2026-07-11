const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, phone } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ name, email, phone, cart: [], wishlist: [] });
    await user.save();
  }

  res.json(user);
});

// ✅ GET CART
router.get("/cart/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .populate("cart.bookId");

    if (!user) return res.json([]);

    res.json(user.cart);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

// ✅ ADD TO CART
router.post("/cart", async (req, res) => {
  try {
    const { email, bookId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, cart: [], wishlist: [] });
    }

    const existingItem = user.cart.find(
      item => item.bookId.toString() === bookId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        bookId: bookId,
        quantity: 1
      });
    }

    await user.save();

    const updatedUser = await User.findOne({ email }).populate("cart.bookId");

    res.json(updatedUser.cart);

  } catch (err) {
    console.log("ADD CART ERROR:", err);
    res.status(500).json(err.message);
  }
});

// ✅ UPDATE QUANTITY
router.put("/cart", async (req, res) => {
  try {
    const { email, bookId, quantity } = req.body;

    const user = await User.findOne({ email });

    const item = user.cart.find(
      item => item.bookId.toString() === bookId
    );

    if (item) {
      item.quantity = quantity;
    }

    await user.save();

    const updated = await User.findOne({ email }).populate("cart.bookId");

    res.json(updated.cart);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ✅ DELETE ITEM
router.delete("/cart/:bookId", async (req, res) => {
  try {
    const { email } = req.query;
    const { bookId } = req.params;

    const user = await User.findOne({ email });

    user.cart = user.cart.filter(
      item => item.bookId.toString() !== bookId
    );

    await user.save();

    const updated = await User.findOne({ email }).populate("cart.bookId");

    res.json(updated.cart);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ❤️ TOGGLE WISHLIST (ADD / REMOVE)
router.post("/wishlist", async (req, res) => {
  try {
    const { email, bookId } = req.body;

    let user = await User.findOne({ email });

    // ✅ CREATE USER IF NOT EXISTS
    if (!user) {
      user = new User({ email, cart: [], wishlist: [] });
    }

    // ✅ FIX: ensure wishlist exists
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const exists = user.wishlist.includes(bookId);

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== bookId
      );
    } else {
      user.wishlist.push(bookId);
    }

    await user.save();

    res.json({ message: "Wishlist updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating wishlist" });
  }
});

// ❤️ GET WISHLIST
router.get("/wishlist/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .populate("wishlist");

    if (!user) return res.json([]);

    res.json(user.wishlist);

  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

module.exports = router;