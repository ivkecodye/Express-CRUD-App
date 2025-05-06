// src/routes/taskRoutes.js
const express = require("express");
const upload = require("../middleware/upload");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", upload.single("image"), createTask);
router.get("/", getAllTasks);
router.put("/:id", upload.single("image"), updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
