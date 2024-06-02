const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Note } = require("./models");
const cors = require("cors");
const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Middleware
app.use(express.json());

const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds (higher is more secure)
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};
// Register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  // Hash the password

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  res.json({ message: "User registered successfully" });
});

// Login and generate JWT token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Find the user by email
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  // Verify the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid email or password" });

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, "your_secret_key", {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Failed to authenticate token" });
    req.userId = decoded.userId;
    next();
  });
};

// Get all notes for the authenticated user
app.get("/notes", verifyToken, async (req, res) => {
  const notes = await Note.findAll({ where: { userId: req.userId } });
  res.json(notes);
});
app.get("/notes/:id", verifyToken, async (req, res) => {
  const note = await Note.findOne({
    where: { id: req.params.id, userId: req.userId },
  });
  res.json(note);
});
app.get("/user", verifyToken, async (req, res) => {
  const user = await User.findOne({
    where: { id: req.userId },
  });
  res.json(user);
});
// Create a new note for the authenticated user
app.post("/notes", verifyToken, async (req, res) => {
  console.log(req.userId);
  const { title, content } = req.body;
  const note = await Note.create({ title, content, userId: req.userId });
  res.json(note);
});

// Update an existing note for the authenticated user
app.put("/notes/:id", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOne({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!note) return res.status(404).json({ message: "Note not found" });

  note.title = title;
  note.content = content;
  await note.save();
  res.json(note);
});

// Delete an existing note for the authenticated user
app.delete("/notes/:id", verifyToken, async (req, res) => {
  const note = await Note.findOne({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!note) return res.status(404).json({ message: "Note not found" });

  await note.destroy();
  res.json({ message: "Note deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
