const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', async (req, res) => {
  const { name, psNumber, deptCode, bookingDate } = req.body;

  // Validate required fields
  if (!name || !psNumber || !deptCode || !bookingDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate date is not in the past
  const selectedDate = new Date(bookingDate);
  selectedDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return res.status(400).json({ message: 'Booking date cannot be in the past' });
  }

  try {
    // Create new booking
    const newBooking = new Booking({
      name,
      psNumber,
      deptCode,
      bookingDate: selectedDate
    });

    // Save booking
    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    // Check for duplicate key error (unique constraint violation)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already booked lunch for this date' });
    }
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/bookings
// @desc    Get all bookings for a specific date
// @access  Private (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Get date from query params or use today's date
    let filterDate = req.query.date ? new Date(req.query.date) : new Date();
    
    // Set time to start of day
    filterDate.setHours(0, 0, 0, 0);
    
    // Set time to end of day for query
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Find bookings for the specified date
    const bookings = await Booking.find({
      bookingDate: {
        $gte: filterDate,
        $lt: nextDay
      }
    }).sort({ timestamp: 1 });
    
    res.json({ bookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/bookings/stats
// @desc    Get booking statistics
// @access  Private (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();
    
    // Get today's bookings count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Get department statistics
    const departments = await Booking.aggregate([
      {
        $group: {
          _id: '$deptCode',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json({
      totalBookings,
      todayBookings,
      departments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;