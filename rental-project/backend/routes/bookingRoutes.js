const express = require('express');
const router = express.Router();
const { addBookingItems, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addBookingItems);
router.get('/mybookings', protect, getMyBookings);

module.exports = router;
