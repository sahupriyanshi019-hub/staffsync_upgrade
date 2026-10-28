const Attendance = require('../models/Attendance');

const today = () => new Date().toISOString().slice(0, 10);

exports.checkIn = async (req, res) => {
  const date = today();
  const exists = await Attendance.findOne({ employee: req.user._id, date });
  if (exists) return res.status(400).json({ message: 'Already checked in today' });
  const rec = await Attendance.create({ employee: req.user._id, date, checkIn: new Date() });
  res.status(201).json(rec);
};

exports.checkOut = async (req, res) => {
  const rec = await Attendance.findOne({ employee: req.user._id, date: today() });
  if (!rec) return res.status(400).json({ message: 'You have not checked in today' });
  if (rec.checkOut) return res.status(400).json({ message: 'Already checked out' });
  rec.checkOut = new Date();
  const hours = (rec.checkOut - rec.checkIn) / 36e5;
  rec.status = hours < 4 ? 'half-day' : 'present';
  await rec.save();
  res.json(rec);
};

exports.myAttendance = async (req, res) => {
  const records = await Attendance.find({ employee: req.user._id }).sort('-date').limit(60);
  res.json(records);
};

exports.allAttendance = async (req, res) => {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;
  if (req.query.employee) filter.employee = req.query.employee;
  const records = await Attendance.find(filter)
    .populate('employee', 'name email department')
    .sort('-date')
    .limit(500);
  res.json(records);
};
