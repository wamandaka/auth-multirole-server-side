import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ message: "Password salah" });
  req.session.userId = user.uuid;
  const { uuid, name, email, role } = user;
  res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Mohon login terlebih dahulu" });
  } else {
    const user = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(user);
  }
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ message: "Tidak dapat logout" });
    res.status(200).json({ message: "Logout berhasil" });
  });
};
