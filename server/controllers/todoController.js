const Todo = require("../models/todoModel");

// Base route to welcome users
exports.baseRoot = (req, res) => {
  res
    .status(200)
    .send(
      `<h1>✅ Welcome to MERN-Todofy! </h1><p>See Live Web URL for this Server - <a href="https://mern-todofy.netlify.app">https://mern-todofy.netlify.app</a></p>`
    );
};

exports.getTask = async (req, res) => {
  try {
    const allTask = await Todo.find();
    res.status(200).json(allTask);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || typeof task !== "string") {
      return res.status(400).json({ errorMessage: "Task is not valid." });
    }

    const newList = await Todo.create({ task });
    res.status(201).json({ message: "Task created successfully.", newList });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ errorMessage: "Task not found." });
    }
    res.status(200).json({ message: "Task deleted successfully.", deleted });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ errorMessage: "Task not found." });
    }

    res.status(200).json({ message: "Task updated successfully.", updated });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};
