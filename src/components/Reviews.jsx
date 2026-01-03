import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import './Reviews.css'

const Reviews = ({ showId }) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle review submission
    console.log('Review submitted', { rating, review, name, email })
  }

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Be the first to review "Political Animal"</h2>
      
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your rating</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${rating >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                <FiStar />
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="review">Your review *</label>
          <textarea
            id="review"
            rows="6"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-review-btn">
          Submit Review
        </button>
      </form>

      <div className="reviews-note">
        <p>There are no reviews yet.</p>
      </div>
    </div>
  )
}

export default Reviews

