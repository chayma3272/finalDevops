const express = require("express");

const router = express.Router();

const {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/todoController");

router.route("/new").post(createTask);

router.route("/get").get(getTask);

router.route("/update/:id").put(updateTask);

router.route("/delete/:id").delete(deleteTask);

module.exports = router;
