const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();
dotenv.config();

const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// ✅ ROUTES
const userRoutes = require("./routes/userRoutes");
console.log("User routes loaded");
app.use("/api/users", userRoutes);

const bookRoutes = require("./routes/bookRoutes");
app.use("/api/books", bookRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
// ✅ TEST
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
