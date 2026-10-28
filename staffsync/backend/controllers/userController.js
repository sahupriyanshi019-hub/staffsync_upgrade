const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const filter = {};
  if (req.user.role === 'manager') filter.manager = req.user._id;
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).select('-password').populate('manager', 'name').sort('-createdAt');
  res.json(users);
};

exports.createUser = async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  if (!req.body.manager) delete req.body.manager;
  const user = await User.create(req.body);
  const safe = user.toObject();
  delete safe.password;
  res.status(201).json(safe);
};

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const fields = ['name', 'email', 'role', 'department', 'designation', 'phone', 'address', 'joiningDate', 'manager'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f] === '' && f === 'manager' ? null : req.body[f];
  });
  if (req.body.password) user.password = req.body.password;
  await user.save();

  const safe = user.toObject();
  delete safe.password;
  res.json(safe);
};

exports.deleteUser = async (req, res) => {
  if (String(req.user._id) === req.params.id)
    return res.status(400).json({ message: 'You cannot delete yourself' });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};
