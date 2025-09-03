const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: String,
  returnTime: String,
  location: String,
  planText: { type: String, required: true }, // ✅ make sure this is present
  visibleTo: [String]
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
