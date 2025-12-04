const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, telegramUsername, twitterUsername, walletAddress, password } =
      req.body;

    if (!name || !telegramUsername || !twitterUsername || !password) {
      return res
        .status(400)
        .json({ message: "Please add all required fields" });
    }

    // Normalize usernames
    const normalizedTelegram = telegramUsername.trim().toLowerCase();
    const normalizedTwitter = twitterUsername.trim().toLowerCase();

    // Check if telegram username exists
    const telegramExists = await User.findOne({
      telegramUsername: normalizedTelegram,
    });
    if (telegramExists) {
      return res
        .status(400)
        .json({ message: "Telegram username already exists" });
    }

    // Check if twitter username exists
    const twitterExists = await User.findOne({
      twitterUsername: normalizedTwitter,
    });
    if (twitterExists) {
      return res
        .status(400)
        .json({ message: "Twitter username already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      telegramUsername: normalizedTelegram,
      twitterUsername: normalizedTwitter,
      walletAddress,
      password,
      role: "user",
      status: "pending",
    });

    if (user) {
      res.status(201).json({
        message: "Signup successful. Your account is pending admin approval.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${
          field === "telegramUsername" ? "Telegram" : "Twitter"
        } username already exists`,
      });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { telegramUsername, password } = req.body;

  // Normalize username for login
  const normalizedTelegram = telegramUsername.trim().toLowerCase();

  // Check for user
  const user = await User.findOne({ telegramUsername: normalizedTelegram });

  if (user && (await user.matchPassword(password))) {
    if (user.role === "user" && user.status !== "approved") {
      return res
        .status(401)
        .json({ message: "Your account is not approved yet." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      telegramUsername: user.telegramUsername,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
