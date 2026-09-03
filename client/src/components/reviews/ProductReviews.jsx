import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as reviewService from '../../services/reviewService';
import {
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Trash2,
  Edit3,
  AlertCircle,
  X
} from 'lucide-react';

export const ProductReviews = ({ productId }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingsAverage, setRatingsAverage] = useState(4.8);
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data.reviews || []);
      setTotalReviews(data.totalReviews || 0);
      setRatingsAverage(data.ratingsAverage || 4.8);
      setDistribution(data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const existingUserReview = reviews.find(
    (r) => (r.user?._id || r.user) === user?._id
  );

  const handleOpenEdit = (r) => {
    setEditingReviewId(r._id);
    setRating(r.rating);
    setTitle(r.title);
    setComment(r.comment);
    setShowForm(true);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title.trim() || !comment.trim()) {
      setFormError('Please provide both a title and review comment.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingReviewId) {
        await reviewService.updateReview(editingReviewId, { rating, title, comment });
        setFormSuccess('Review updated successfully!');
      } else {
        await reviewService.createProductReview(productId, { rating, title, comment });
        setFormSuccess('Review submitted successfully!');
      }

      setShowForm(false);
      setEditingReviewId(null);
      setTitle('');
      setComment('');
      setRating(5);
      await loadReviews();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to remove your review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        await loadReviews();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className="rounded-3xl glass-card border border-slate-800 p-6 sm:p-8 space-y-8">
      
      {/* Header & Stats Overview */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Client Appraisals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Customer Reviews & Ratings
          </h2>
        </div>

        {/* Rating Score & Write Review CTA */}
        <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-amber-400 font-serif">
              {ratingsAverage}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(ratingsAverage) ? 'fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => {
                if (existingUserReview) {
                  handleOpenEdit(existingUserReview);
                } else {
                  setEditingReviewId(null);
                  setTitle('');
                  setComment('');
                  setRating(5);
                  setShowForm(!showForm);
                }
              }}
              className="py-3 px-6 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider shadow-lg shrink-0"
            >
              {existingUserReview ? 'Edit My Review' : 'Write a Review'}
            </button>
          ) : (
            <Link
              to="/login"
              className="py-3 px-6 rounded-2xl glass-panel border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white shrink-0"
            >
              Sign In to Review
            </Link>
          )}
        </div>
      </div>

      {/* Review Form (Collapsible) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {editingReviewId ? 'Edit Your Appraisal' : 'Share Your Experience'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-300 block">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-amber-300 font-semibold ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-300 block mb-1">
              Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Masterful tailoring and luxurious silk texture"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-300 block mb-1">
              Appraisal & Comments *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Detail the garment fit, drape, texture, and how it elevated your wardrobe..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-bold uppercase shadow-md disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : editingReviewId ? 'Save Changes' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl glass-panel border border-slate-700 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading appraisals...</div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => {
            const isAuthor = (rev.user?._id || rev.user) === user?._id;
            return (
              <div
                key={rev._id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={rev.user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.user?.name || 'Verified Client'}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified Acquisition</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Stars & Author Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    {isAuthor && (
                      <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                        <button
                          onClick={() => handleOpenEdit(rev)}
                          className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Edit Review"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 pl-12">
                  <h4 className="text-xs sm:text-sm font-bold text-white font-serif">{rev.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{rev.comment}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-white">No Client Reviews Yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first verified client to acquire and review this creation.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductReviews;
