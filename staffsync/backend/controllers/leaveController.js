const Leave = require('../models/Leave');
const User = require('../models/User');

exports.applyLeave = async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  if (new Date(toDate) < new Date(fromDate))
    return res.status(400).json({ message: 'To date cannot be before from date' });
  const leave = await Leave.create({ employee: req.user._id, type, fromDate, toDate, reason });
  res.status(201).json(leave);
};

exports.myLeaves = async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id }).populate('reviewedBy', 'name').sort('-createdAt');
  res.json(leaves);
};

// HR: all leaves. Manager: leaves of own team.
exports.getLeaves = async (req, res) => {
  const filter = {};
  if (req.user.role === 'manager') {
    const team = await User.find({ manager: req.user._id }).select('_id');
    filter.employee = { $in: team.map((t) => t._id) };
  }
  if (req.query.status) filter.status = req.query.status;
  const leaves = await Leave.find(filter)
    .populate('employee', 'name email department role')
    .populate('reviewedBy', 'name')
    .sort('-createdAt');
  res.json(leaves);
};

exports.reviewLeave = async (req, res) => {
  const { status, reviewComment } = req.body;
  if (!['approved', 'rejected'].includes(status))
    return res.status(400).json({ message: 'Status must be approved or rejected' });

  const leave = await Leave.findById(req.params.id).populate('employee');
  if (!leave) return res.status(404).json({ message: 'Leave not found' });

  if (req.user.role === 'manager') {
    const isTeam = String(leave.employee.manager) === String(req.user._id);
    if (!isTeam) return res.status(403).json({ message: 'Not your team member' });
  }
  if (String(leave.employee._id) === String(req.user._id))
    return res.status(400).json({ message: 'You cannot review your own leave' });

  leave.status = status;
  leave.reviewComment = reviewComment || '';
  leave.reviewedBy = req.user._id;
  await leave.save();
  res.json(leave);
};
