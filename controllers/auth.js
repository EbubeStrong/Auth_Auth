// const express = require('express')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const router = express.Router()

//  console.log("Testing Mode - Hardcoded Data:");
//  console.log("Username:", username, "Email:", email, "Password:", password);

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

//   const username = "testusered";
//   const email = "test@example.com";
//   const password = "123456";

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: " password is required!",
        error: "Password is required!",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: " Email is required!",
        error: "Email is required!",
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required!",
        error: "Username is required!",
      });
    }

    // Hash password and create new user
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (e) {
    console.error("Error in registerUser:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // const username = "testuser";
    // const email = "test@example.com";
    // const password = "123456";

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist. Please register.",
      });
    }

    // check for password match
    const checkPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password! Try again",
      });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
        process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Login Successful",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      token,
    });
  } catch (e) {
    console.error("Error in loginUser:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
