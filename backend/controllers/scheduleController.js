// const Schedule = require('../models/Schedule');

// // Create a new schedule
// exports.createSchedule = async (req, res) => {
//   try {
//     const schedule = new Schedule(req.body);
//     await schedule.save();
//     res.status(201).json(schedule);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // (Optional) Get schedules visible to a contact
// exports.getSchedulesForPhone = async (req, res) => {
//   try {
//     const phone = req.params.phone;
//     const schedules = await Schedule.find({ visibleTo: phone });
//     res.json(schedules);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const Schedule = require('../models/Schedule');

// CREATE a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all schedules for a specific user (by userId query)
exports.getSchedulesByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    const schedules = await Schedule.find({ userId }).sort({ date: 1, time: 1 }); // optional sort
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a schedule by ID
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(updatedSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a schedule by ID
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Schedule.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Optional) Get schedules visible to a contact
exports.getSchedulesForPhone = async (req, res) => {
  try {
    const phone = req.params.phone;
    const schedules = await Schedule.find({ visibleTo: phone });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
