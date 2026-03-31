const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

// ✅ PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).populate("cart.bookId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    // ✅ PREPARE ORDER ITEMS
    const items = user.cart.map(item => ({
      title: item.bookId.title,
      price: item.bookId.price,
      quantity: item.quantity
    }));

    // ✅ CALCULATE TOTAL
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // ✅ CREATE ORDER
    const newOrder = new Order({
      email,
      items,
      total
    });

    // ✅ SAVE ORDER
    await newOrder.save();

    // ================= 📧 EMAIL START =================

    // 📦 DELIVERY DATE (5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    // 🧾 CREATE BILL TEXT
    let itemsText = "";
    newOrder.items.forEach(item => {
      itemsText += `${item.title} x${item.quantity} - ₹${item.price}\n`;
    });

    const emailText = `
🛍️ Order Confirmed!

Hello,

Your order has been placed successfully.

📦 Items:
${itemsText}

💰 Total: ₹${newOrder.total}

 Order ID: ${newOrder._id}

🚚 Expected Delivery: ${deliveryDate.toDateString()}

Thank you for shopping with us ❤️
`;

    // 📧 SEND EMAIL
    await sendEmail(newOrder.email, "Order Confirmation", emailText);

    // ================= 📧 EMAIL END =================

    // ✅ CLEAR CART AFTER ORDER
    user.cart = [];
    await user.save();

    res.json(newOrder);

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json(err.message);
  }
});


// ✅ GET ALL ORDERS
router.get("/:email", async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


// ✅ GET SINGLE ORDER
router.get("/single/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;