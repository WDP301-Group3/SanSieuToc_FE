/**
 * @fileoverview FieldReviews - Component hiển thị đánh giá sân
 * Bao gồm review summary (rating breakdown) và review list
 */

const FieldReviews = ({ feedbacks, averageRating, totalReviews, ratingBreakdown }) => {
  return (
    <div className="detail-section" id="reviews">
      <div className="reviews-header">
        <h3 className="section-title">Đánh giá & Bình luận</h3>
      </div>

      {/* Review Summary */}
      {totalReviews > 0 ? (
        <div className="review-summary">
          <div className="summary-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className="material-symbols-outlined star-filled">
                  {star <= Math.floor(averageRating) ? 'star' : star === Math.ceil(averageRating) && averageRating % 1 !== 0 ? 'star_half' : 'star'}
                </span>
              ))}
            </div>
            <span className="rating-count">{totalReviews} đánh giá</span>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-row">
                <span className="rating-label">{star} sao</span>
                <div className="rating-bar">
                  <div
                    className="rating-fill"
                    style={{ width: `${ratingBreakdown[star]}%` }}
                  />
                </div>
                <span className="rating-percent">{ratingBreakdown[star]}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="review-summary" style={{ textAlign: 'center', padding: '2rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }}>rate_review</span>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        </div>
      )}

      {/* Review List */}
      <div className="reviews-list">
        {feedbacks.length > 0 ? feedbacks.map(feedback => (
          <div key={feedback._id} className="review-item">
            <div className="review-avatar" style={{ backgroundImage: `url(${feedback.userImage})` }} />
            <div className="review-content">
              <div className="review-header">
                <div>
                  <h4 className="review-author">{feedback.userName}</h4>
                  <div className="review-meta">
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`material-symbols-outlined ${star <= feedback.rating ? 'star-filled' : 'star-empty'}`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="review-date">
                      {new Date(feedback.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="review-text">{feedback.comment}</p>
            </div>
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
            Chưa có đánh giá nào cho sân này.
          </p>
        )}
      </div>
    </div>
  );
};

export default FieldReviews;
