const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, email, password, role, bio, profilePicture, topicsOfInterest, syllabus, coursework } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Create a new user instance
    user = new User({
      name,
      email,
      password,
      role,
      bio, // Add bio field
      profilePicture, // Add profilePicture field
      topicsOfInterest, // Add topicsOfInterest field
      syllabus, // Add syllabus field
      coursework, // Add coursework field
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id } };
    console.log('JWT_SECRET in Auth:', process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Return token and user data
    res.json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    console.log('JWT_SECRET in Auth:', process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({ token,user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { registerUser, loginUser };
