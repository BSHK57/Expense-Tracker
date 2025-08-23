const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ===== Middleware =====
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you're using cookies or auth headers
})); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// ===== MongoDB Schemas =====

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// ===== Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// ===== Auth Routes =====
app.get("/", async (req, res) => {
    res.send("backend working");
})


app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: "User already exists" });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Transaction Routes (Protected) =====
//app.use("/api/transactions", authMiddleware);

app.get("/api/transactions", async (req, res) => {
  try {
    const txns = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const txn = new Transaction({ ...req.body, userId: req.userId });
    await txn.save();
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete" });
  }
});

// ===== Start Server =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
