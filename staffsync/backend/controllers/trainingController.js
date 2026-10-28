const Training = require('../models/Training');

exports.getTrainings = async (req, res) => {
  const filter = {};
  if (req.user.role === 'manager') filter.createdBy = req.user._id;
  if (req.user.role === 'employee') filter.assignedEmployees = req.user._id;
  const items = await Training.find(filter)
    .populate('createdBy', 'name')
    .populate('assignedEmployees', 'name email')
    .sort('-createdAt');
  res.json(items);
};

exports.createTraining = async (req, res) => {
  const item = await Training.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(item);
};

exports.updateTraining = async (req, res) => {
  const item = await Training.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Training not found' });
  if (req.user.role === 'manager' && String(item.createdBy) !== String(req.user._id))
    return res.status(403).json({ message: 'Not your program' });
  Object.assign(item, req.body);
  await item.save();
  res.json(item);
};

exports.deleteTraining = async (req, res) => {
  const item = await Training.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Training not found' });
  if (req.user.role === 'manager' && String(item.createdBy) !== String(req.user._id))
    return res.status(403).json({ message: 'Not your program' });
  await item.deleteOne();
  res.json({ message: 'Deleted' });
};
