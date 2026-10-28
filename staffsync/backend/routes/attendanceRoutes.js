const router = require('express').Router();
const w = require('./asyncWrap');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/attendanceController');

router.use(protect);
router.post('/check-in', w(c.checkIn));
router.put('/check-out', w(c.checkOut));
router.get('/my', w(c.myAttendance));
router.get('/', authorize('hr'), w(c.allAttendance));

module.exports = router;
