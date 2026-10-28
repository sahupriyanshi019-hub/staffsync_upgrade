const router = require('express').Router();
const w = require('./asyncWrap');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/leaveController');

router.use(protect);
router.post('/', authorize('employee', 'manager'), w(c.applyLeave));
router.get('/my', w(c.myLeaves));
router.get('/', authorize('hr', 'manager'), w(c.getLeaves));
router.put('/:id/review', authorize('hr', 'manager'), w(c.reviewLeave));

module.exports = router;
