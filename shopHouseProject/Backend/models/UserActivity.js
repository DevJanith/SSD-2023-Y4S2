// models/UserActivity.js
const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  _id: String,
  userEmail: String,
  userName: String,
  type: String,
  activity: String,
  activityDateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserActivity', userActivitySchema);
