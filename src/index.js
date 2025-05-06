// src/index.js
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const taskRoutes = require("./routes/taskRoutes");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const bcrypt = require("bcrypt");
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = 3000;

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/tasks", taskRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const tasks = await prisma.task.findMany();
    const posts = await prisma.post.findMany();

    res.render("index", { users, tasks, posts }); // Pass data to EJS
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/create-user", (req, res) => {
  res.render("forms/createUser");
});

app.post("/create-user", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hashed } });
  res.redirect("/");
});

app.get("/create-post", (req, res) => {
  res.render("forms/createPost"); // Test with just the file name, without the 'forms/' folder path
});

app.post("/create-post", async (req, res) => {
  const { title, content, userId } = req.body;
  await prisma.post.create({
    data: { title, content, userId: parseInt(userId) },
  });
  res.redirect("/");
});

app.get("/create-task", (req, res) => {
  res.render("forms/createTask");
});

app.post("/create-task", upload.single("image"), async (req, res) => {
  const { title, description, userId } = req.body;
  const image = req.file?.filename;
  await prisma.task.create({
    data: {
      title,
      description,
      image,
      userId: parseInt(userId),
    },
  });
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.send("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.send("Invalid password");

  res.send(`Welcome, ${user.email}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
