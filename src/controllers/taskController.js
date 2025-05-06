// src/controllers/taskController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

// Create a new task
// src/controllers/taskController.js
const createTask = async (req, res) => {
  const { title, description, status, userId } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const task = await prisma.task.create({
      data: { title, description, status, userId: Number(userId), image },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    include: {
      user: { select: { email: true } },
    },
  });
  res.json(tasks);
};

// Update a task by ID
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete old image if new image is uploaded
    if (newImage && existingTask.image) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads",
        existingTask.image
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Failed to delete old image:", err.message);
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        image: newImage || existingTask.image,
      },
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete associated image from disk
    if (existingTask.image) {
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        existingTask.image
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err.message);
      });
    }

    await prisma.task.delete({ where: { id: Number(id) } });

    res.json({ message: "Task and associated image deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
