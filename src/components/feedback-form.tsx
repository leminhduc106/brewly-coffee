"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface FeedbackFormProps {
  orderId: string;
  initialRating?: number;
  initialFeedback?: string;
  onSubmit: (rating: number, feedback: string) => Promise<void>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ orderId, initialRating = 0, initialFeedback = "", onSubmit }) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(rating, feedback);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6 text-center">
          <CardTitle className="mb-2">Thank you for your feedback!</CardTitle>
          <p className="text-muted-foreground">Your review helps us improve our service.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Card>
        <CardContent className="p-6">
          <CardTitle className="mb-4">Rate Your Experience</CardTitle>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star className="w-8 h-8" fill={star <= rating ? "#facc15" : "none"} />
              </button>
            ))}
          </div>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="mb-4"
          />
          <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
