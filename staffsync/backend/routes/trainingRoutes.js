const router = require('express').Router();
const w = require('./asyncWrap');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/trainingController');

router.use(protect);
router.get('/', w(c.getTrainings));
router.post('/', authorize('manager', 'hr'), w(c.createTraining));
router.put('/:id', authorize('manager', 'hr'), w(c.updateTraining));
router.delete('/:id', authorize('manager', 'hr'), w(c.deleteTraining));

module.exports = router;
