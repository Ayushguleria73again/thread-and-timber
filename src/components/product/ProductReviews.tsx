"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export type Review = {
  _id: string;
  product: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/reviews/product/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch studio reflections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((r: number) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("thread-timber-token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating, comment: comment.trim() })
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setComment("");
        setShowForm(false);
        toast.success("Artisan reflection shared");
      } else {
        toast.error("Failed to submit reflection");
      }
    } catch (error) {
      toast.error("Studio sync error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-black/5 bg-white/70 p-6">
      <h3 className="mb-6 text-lg font-semibold text-black italic font-serif">Artisan Reflections</h3>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold text-black">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star: number) => (
                <FiStar
                  key={star}
                  className={`${
                    star <= Math.round(averageRating)
                      ? "fill-moss text-moss"
                      : "text-black/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-black/40">
            Based on {reviews.length} studio reflection{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2">
          {ratingCounts.map(({ rating: r, count }: any) => (
            <div key={r} className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold w-12">{r} star</span>
              <div className="flex-1 rounded-full bg-black/5 h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-clay"
                  style={{
                    width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-black/20 w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 transition hover:bg-black/90 active:scale-95"
        >
          Write a Review
        </button>
      )}

      {showForm && user && (
        <form onSubmit={handleSubmit} className="mb-10 rounded-2xl border border-black/5 bg-sand/30 p-6 animate-in fade-in slide-in-from-top-4">
          <div className="mb-6">
            <label className="mb-3 block text-[10px] uppercase tracking-widest font-bold text-black/40">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star: number) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  className={`relative text-2xl transition-all duration-300 ${
                    star <= rating 
                      ? "text-moss drop-shadow-[0_0_8px_rgba(20,83,45,0.4)]" 
                      : "text-black/10"
                  }`}
                >
                  <FiStar className={star <= rating ? "fill-current" : ""} />
                  {star <= rating && (
                    <motion.div
                      layoutId="star-glow"
                      className="absolute inset-0 -z-10 blur-xl bg-moss/20 rounded-full scale-150"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your artisan experience..."
            className="mb-6 w-full rounded-2xl border border-black/5 bg-white px-4 py-4 text-sm focus:border-black/10 outline-none"
            rows={4}
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit reflection"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setComment("");
              }}
              className="px-6 py-3 text-[10px] uppercase tracking-widest text-black/40 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {loading ? (
            <p className="py-8 text-center text-[10px] uppercase tracking-widest text-black/20 animate-pulse">Gathering studio reflections...</p>
        ) : reviews.length === 0 ? (
            <div className="py-12 text-center">
                <p className="text-[10px] uppercase tracking-widest text-black/20 italic">No reflections for this piece yet.</p>
                <p className="mt-1 text-[8px] uppercase tracking-widest text-black/10">Be the first artisan to share your experience.</p>
            </div>
        ) : reviews.map((review: any) => (
          <div key={review._id} className="group rounded-3xl border border-black/[0.03] bg-white p-6 transition-hover hover:border-black/10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-black uppercase tracking-widest">{review.userName}</p>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star: number) => (
                    <FiStar
                      key={star}
                      className={`${
                        star <= review.rating
                          ? "fill-moss text-moss"
                          : "text-black/10"
                      } text-[10px]`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-black/20">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-black/70 italic font-serif">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
