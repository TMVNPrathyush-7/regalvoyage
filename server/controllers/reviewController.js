const Review = require('../models/reviewModel');

// Add a review
async function addReview(req, res) {
  try {
    const { resourceType, resourceId, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      resourceType,
      resourceId,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
}

// Get reviews for a resource
async function getReviews(req, res) {
  try {
    const { resourceType, resourceId } = req.query;
    const reviews = await Review.find({ resourceType, resourceId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
}

// (Optional) Edit own review
async function editReview(req, res) {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit review', error: err.message });
  }
}

// (Optional) Delete own review
async function deleteReview(req, res) {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
}

module.exports = { addReview, getReviews, editReview, deleteReview }; 