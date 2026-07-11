const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const response = await axios.get(
      `http://localhost:5001/recommend/${bookId}`
    );

    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Recommendation error"
    });
  }
});

module.exports = router;