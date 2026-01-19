"use client";

import { useState } from "react";
import { Star, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCreateReview } from "@/hooks/api/use-reviews";

interface StudentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
  tutorName?: string;
}

export default function StudentReviewModal({
  isOpen,
  onClose,
  sessionId,
  tutorName,
}: StudentReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (!sessionId || rating === 0) return;

    try {
      await createReview.mutateAsync({
        sessionId,
        overallRating: rating,
        teachingQuality: rating,
        communication: rating,
        punctuality: rating,
        preparedness: rating,
        comment: comment || undefined,
        wouldRecommend: rating >= 4,
        isPublic: true,
      });
      toast.success("Review submitted successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setShowSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 p-0 overflow-hidden" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>Student Review Modal</DialogTitle>
        </VisuallyHidden>

        {!showSuccess ? (
          <div className="py-6 sm:py-8 px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Share Your Feedback
            </h2>
            {tutorName && (
              <p className="text-sm text-gray-600">
                Rate your session with {tutorName}
              </p>
            )}

            {/* Star Rating */}
            <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400 w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                        : "text-gray-300 w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (optional)"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#002AC8]/20"
              rows={3}
            />

            {/* Buttons */}
            <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-9 sm:h-10 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || createReview.isPending}
                className="flex-1 bg-[#002AC8] hover:bg-blue-700 h-9 sm:h-10 text-sm sm:text-base disabled:opacity-50"
              >
                {createReview.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-10 sm:py-12 px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Success!</h3>
            <p className="text-base sm:text-lg text-gray-600">
              Your review was submitted successfully
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
