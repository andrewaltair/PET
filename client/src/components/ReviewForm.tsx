'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/star-rating';
import { useToast } from '@/hooks/use-toast';
import { reviewsAPI } from '@/services/api';

interface ReviewFormProps {
  bookingId: string;
  serviceTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewForm({
  bookingId,
  serviceTitle,
  isOpen,
  onClose,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  const t = useTranslations('reviewForm');

  const createReviewMutation = useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      reviewsAPI.createReview(bookingId, { ...data, bookingId }),
    onSuccess: () => {
      toast({
        title: t('success.title'),
        description: t('success.description'),
      });
      onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: t('error.title'),
        description: error?.response?.data?.error || t('error.default'),
        variant: 'destructive',
      });
    },
  });

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: t('validation.ratingRequired.title'),
        description: t('validation.ratingRequired.description'),
        variant: 'destructive',
      });
      return;
    }

    createReviewMutation.mutate({ rating, comment: comment.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { serviceTitle })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('ratingLabel')} <span className="text-red-500">*</span>
            </label>
            <StarRating
              value={rating}
              onValueChange={setRating}
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              {t('commentLabel')}
            </label>
            <Textarea
              id="comment"
              placeholder={t('commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {t('charactersCount', { count: comment.length })}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createReviewMutation.isPending}
            >
              {t('cancelButton')}
            </Button>
            <Button
              type="submit"
              disabled={createReviewMutation.isPending || rating === 0}
            >
              {createReviewMutation.isPending ? t('submittingButton') : t('submitButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
