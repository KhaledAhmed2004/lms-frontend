'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { BookOpen, Star, Square, Check } from 'lucide-react';
import Image from 'next/image';
import Session from '@/app/shared/Session';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


type FeedbackStep = 'recording' | 'success';

function FeedbackModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState<FeedbackStep>('recording');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  useLayoutEffect(() => {
    if (isOpen && !hasInitialized.current) {
      hasInitialized.current = true;

     

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            clearInterval(intervalRef.current!);
            return 59;
          }
          return prev + 1;
        });
      }, 1000);
    }

    // Cleanup when modal closes
    if (!isOpen) {
      hasInitialized.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  const stopAndSubmit = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentStep('success');
    setTimeout(() => {
      onClose();
      hasInitialized.current = false; // Reset for next open
    }, 2000);
  };

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    hasInitialized.current = false;
    onClose();
  };

  const formatTime = (sec: number) => `0:${sec.toString().padStart(2, '0')}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 p-0 overflow-hidden">
        <VisuallyHidden>
    <DialogTitle>Feedback Modal</DialogTitle>
  </VisuallyHidden>
        <DialogHeader>
      <DialogTitle>Give Feedback</DialogTitle>
      <DialogDescription>
        Record your audio feedback or skip to write text feedback.
      </DialogDescription>
  </DialogHeader>

        {/* Recording Step */}
        {currentStep === 'recording' && (
          <div className="py-12 px-8 text-center space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Share Your Feedback</h2>

            {/* Star Rating */}
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover-scale"
                >
                  <Star
                    size={38}
                    className={
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>

            {/* Pulsing Stop Button (Recording is ON) */}
            <button
              onClick={stopAndSubmit}
              className="w-36 h-36 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-2xl"
            >
              <Square size={64} className="text-white fill-white" />
            </button>

            <p className="text-5xl font-bold text-gray-900">
              {formatTime(recordingTime)}
            </p>

            <button
              onClick={handleClose}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Skip audio feedback
            </button>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={stopAndSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <div className="py-16 px-8 text-center space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Check size={56} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
            <p className="text-lg text-gray-600">Your feedback was submitted successfully</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ================ DASHBOARD ================
export default function Dashboard() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setIsFeedbackOpen(true);
    window.addEventListener('openFeedbackModal', openModal);
    return () => window.removeEventListener('openFeedbackModal', openModal);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      

      <Session />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}