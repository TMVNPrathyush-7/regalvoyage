const express = require('express');
const router = express.Router();
const { addReview, getReviews, editReview, deleteReview } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

// Add a review
router.post('/', authenticateToken, addReview);
// Get reviews for a resource
router.get('/', getReviews);
// Edit own review
router.put('/:id', authenticateToken, editReview);
// Delete own review
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router; 