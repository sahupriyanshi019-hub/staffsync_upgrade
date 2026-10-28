const router = require('express').Router();
const w = require('./asyncWrap');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/userController');

router.use(protect);
router.get('/', authorize('hr', 'manager'), w(c.getUsers));
router.post('/', authorize('hr'), w(c.createUser));
router.put('/:id', authorize('hr'), w(c.updateUser));
router.delete('/:id', authorize('hr'), w(c.deleteUser));

module.exports = router;
