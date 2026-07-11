const express = require("express");
const router = express.Router();

const {
  saveInteraction
} = require("../controllers/interactionController");

router.post("/", saveInteraction);

module.exports = router;