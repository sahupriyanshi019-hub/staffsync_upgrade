const router = require('express').Router();
const w = require('./asyncWrap');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/announcementController');

router.use(protect);
router.get('/', w(c.getAnnouncements));
router.post('/', authorize('hr'), w(c.createAnnouncement));
router.delete('/:id', authorize('hr'), w(c.deleteAnnouncement));

module.exports = router;
