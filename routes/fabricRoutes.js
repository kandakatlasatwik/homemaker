const express = require("express");
const router = express.Router();
const Fabric = require("../models/Fabric");

// ➤ Add Fabric
router.post("/add", async (req, res) => {
  try {
    const fabric = new Fabric(req.body);
    await fabric.save();
    res.status(201).json(fabric);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ Get All Fabrics
router.get("/", async (req, res) => {
  try {
    const fabrics = await Fabric.find();
    res.json(fabrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get Fabrics By Category
router.get("/category/:category", async (req, res) => {
  try {
    const fabrics = await Fabric.find({ category: req.params.category });
    res.json(fabrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Delete Fabric
router.delete("/:id", async (req, res) => {
  try {
    await Fabric.findByIdAndDelete(req.params.id);
    res.json({ message: "Fabric deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;