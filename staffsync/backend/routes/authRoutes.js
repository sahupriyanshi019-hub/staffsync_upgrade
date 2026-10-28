const router = require('express').Router();
const w = require('./asyncWrap');
const { protect } = require('../middleware/auth');
const c = require('../controllers/authController');

router.post('/login', w(c.login));
router.get('/me', protect, c.me);
router.put('/profile', protect, w(c.updateProfile));
router.put('/change-password', protect, w(c.changePassword));

module.exports = router;
