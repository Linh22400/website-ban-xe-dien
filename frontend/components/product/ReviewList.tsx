'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import RatingStars from './RatingStars';

interface Review {
  id: number;
  attributes: {
    Rating: number;
    Title: string;
    Comment: string;
    Images?: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
        };
      }>;
    };
    IsVerifiedPurchase: boolean;
    IsApproved: boolean;
    HelpfulCount: number;
    AdminResponse?: string;
    createdAt: string;
    Customer: {
      data: {
        id: number;
        attributes: {
          username: string;
          email: string;
        };
      };
    };
  };
}

interface ReviewListProps {
  carModelId: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export default function ReviewList({ carModelId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [carModelId]);

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      const response = await fetch(
        `${apiUrl}/api/reviews/car-model/${carModelId}`
      );
      const data = await response.json();
      
      setReviews(data.data || []);
      if (data.meta) {
        setStats({
          averageRating: data.meta.averageRating || 0,
          totalReviews: data.meta.totalReviews || 0,
          distribution: data.meta.distribution || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      await fetch(
        `${apiUrl}/api/reviews/${reviewId}/helpful`,
        { method: 'POST' }
      );
      // Refresh reviews to update helpful count
      fetchReviews();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const openLightbox = (images: string[], index: number) => {
    setSelectedImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setSelectedImages([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <RatingStars rating={stats.averageRating} size="lg" showValue={false} />
              <p className="text-sm text-gray-600 mt-2">
                {stats.totalReviews} đánh giá
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star.toString() as keyof typeof stats.distribution] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-8">{star} ⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
          </div>
        ) : (
          reviews.map((review) => {
            const reviewImages = review.attributes.Images?.data || [];
            const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
            const imageUrls = reviewImages.map(
              (img) => `${apiUrl}${img.attributes.url}`
            );

            return (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {review.attributes.Customer?.data?.attributes?.username || 'Khách hàng'}
                      </span>
                      {review.attributes.IsVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <RatingStars
                      rating={review.attributes.Rating}
                      size="sm"
                      showValue={false}
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.attributes.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Review Title */}
                {review.attributes.Title && (
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {review.attributes.Title}
                  </h4>
                )}

                {/* Review Comment */}
                <p className="text-gray-700 mb-4">{review.attributes.Comment}</p>

                {/* Review Images */}
                {reviewImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {reviewImages.slice(0, 4).map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => openLightbox(imageUrls, idx)}
                        className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={`${apiUrl}${img.attributes.url}`}
                          alt={img.attributes.alternativeText || 'Review image'}
                          fill
                          className="object-cover"
                        />
                        {idx === 3 && reviewImages.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold">
                            +{reviewImages.length - 4}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Admin Response */}
                {review.attributes.AdminResponse && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Phản hồi từ người bán
                    </p>
                    <p className="text-sm text-blue-800">
                      {review.attributes.AdminResponse}
                    </p>
                  </div>
                )}

                {/* Helpful Button */}
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Hữu ích ({review.attributes.HelpfulCount})
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            &times;
          </button>
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
            <Image
              src={selectedImages[lightboxIndex]}
              alt="Review image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
