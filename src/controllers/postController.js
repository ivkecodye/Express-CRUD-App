// src/controllers/postController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new post
const createPost = async (req, res) => {
  const { title, content, userId } = req.body;

  // Check if userId is valid
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        user: { connect: { id: Number(userId) } },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      user: { select: { email: true } },
    },
  });
  res.json(posts);
};

// Update a post by ID
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
};
