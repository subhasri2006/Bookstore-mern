import Order from "../models/Order.js";
import User from "../models/User.js";

export const placeOrder = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).populate("cart.bookId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = user.cart.map((item) => ({
      bookId: item.bookId._id,
      title: item.bookId.title,
      price: item.bookId.price,
      quantity: item.quantity,
      image: item.bookId.image,
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userEmail: email,
      items: orderItems,
      totalAmount,
    });

    await newOrder.save();

    // ✅ CLEAR CART
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order failed" });
  }
};