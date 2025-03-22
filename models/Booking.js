const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BookingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  psNumber: {
    type: String,
    required: true
  },
  deptCode: {
    type: String,
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure uniqueness of psNumber per date
BookingSchema.index({ psNumber: 1, bookingDate: 1 }, { unique: true });

module.exports = Booking = mongoose.model('booking', BookingSchema);