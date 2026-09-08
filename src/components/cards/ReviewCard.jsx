import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium">{review.user}</p>
            <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{review.rating}</span>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
    </div>
  );
}
