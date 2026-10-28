const User = require('../models/User');

// Demo accounts banata hai (agar pehle se na hon)
module.exports = async function seedDemoUsers() {
  if (await User.countDocuments()) return;

  const mgr = await User.create({ name: 'Manav Manager', email: 'manager@staffsync.com', password: 'manager1234', role: 'manager', department: 'Engineering', designation: 'Team Lead' });
  await User.create({ name: 'Hina HR', email: 'hr@staffsync.com', password: 'hr1234', role: 'hr', department: 'HR', designation: 'HR Manager' });
  await User.create({ name: 'Esha Employee', email: 'employee@staffsync.com', password: 'employee1234', role: 'employee', department: 'Engineering', designation: 'Developer', manager: mgr._id });

  console.log('Demo users created: hr@staffsync.com / hr1234, manager@staffsync.com / manager1234, employee@staffsync.com / employee1234');
};
