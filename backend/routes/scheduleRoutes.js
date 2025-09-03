// const express = require('express');
// const router = express.Router();
// const scheduleController = require('../controllers/scheduleController');

// router.post('/', scheduleController.createSchedule);
// router.get('/:phone', scheduleController.getSchedulesForPhone); // Optional

// module.exports = router;
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// CREATE a new schedule
router.post('/', scheduleController.createSchedule);

// GET all schedules for a userId (e.g., /api/schedules?userId=123)
router.get('/', scheduleController.getSchedulesByUserId);

// GET all schedules for a specific phone number (optional, can be removed)
router.get('/:phone', scheduleController.getSchedulesForPhone);

// UPDATE a schedule by ID
router.put('/:id', scheduleController.updateSchedule);

// DELETE a schedule by ID
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
