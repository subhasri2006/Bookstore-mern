const Interaction = require("../models/Interaction");

const saveInteraction = async (req, res) => {
  try {
    const { email, bookId, type, searchQuery } = req.body;

    const interaction = await Interaction.create({
      email,
      bookId,
      type,
      searchQuery
    });

    res.status(201).json(interaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save interaction" });
  }
};

module.exports = {
  saveInteraction
};