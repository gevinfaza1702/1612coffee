import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================== REGISTER ======================
export const register = async (req, res) => {
  try {
    const {
      full_name,
      username,
      email,
      password,
      phone,
      gender,
      birthDate,
      address,
      role,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const parsedBirthDate = birthDate ? new Date(birthDate) : null;
    const userData = {
      full_name,
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      address,
      role: role || "user",
    };

    if (parsedBirthDate && !isNaN(parsedBirthDate)) {
      userData.birthDate = parsedBirthDate;
    }

    const newUser = new User({
      ...userData,
    });

    await newUser.save();
    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender,
        birthDate: newUser.birthDate,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== LOGIN USER ======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "user" });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login berhasil (User)",
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthDate: user.birthDate,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== LOGIN ADMIN ======================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin)
      return res.status(404).json({ message: "Admin tidak ditemukan" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login berhasil (Admin)",
      token,
      admin: {
        id: admin._id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
