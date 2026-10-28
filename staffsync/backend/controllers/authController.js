const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  const safe = user.toObject();
  delete safe.password;
  res.json({ token: signToken(user._id), user: safe });
};

exports.me = (req, res) => res.json(req.user);

// employee updates own personal record
exports.updateProfile = async (req, res) => {
  const allowed = ['name', 'phone', 'address'];
  allowed.forEach((f) => {
    if (req.body[f] !== undefined) req.user[f] = req.body[f];
  });
  await req.user.save();
  res.json(req.user);
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword)))
    return res.status(400).json({ message: 'Current password is wrong' });
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed' });
};
