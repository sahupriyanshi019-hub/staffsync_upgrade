const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
  const items = await Announcement.find().populate('postedBy', 'name').sort('-createdAt');
  res.json(items);
};

exports.createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ message: 'Title and message required' });
  const item = await Announcement.create({ title, message, postedBy: req.user._id });
  res.status(201).json(item);
};

exports.deleteAnnouncement = async (req, res) => {
  const item = await Announcement.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Announcement not found' });
  res.json({ message: 'Deleted' });
};
