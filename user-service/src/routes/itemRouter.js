const express = require("express");
const itemSchema = require("../models/itemSchema");
// const Item = require("../models/item");
const router = express.Router();

// Create a new item
router.post("/", async (req, res) => {
  try {
    const item = new itemSchema(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await itemSchema.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one item
router.get("/:id", async (req, res) => {
  try {
    const item = await itemSchema.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put("/:id", async (req, res) => {
  try {
    const item = await itemSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const item = await itemSchema.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
