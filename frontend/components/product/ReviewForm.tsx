'use client';

import { useState } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';

interface ReviewFormProps {
  carModelId: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ carModelId, onSubmitSuccess }: ReviewFormProps) {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Tối đa 5 ảnh');
      return;
    }

    setImages((prev) => [...prev, ...files]);
    
    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token) {
      setError('Vui lòng đăng nhập để đánh giá');
      setLoading(false);
      return;
    }

    try {
      // Upload images first if any
      let uploadedImageIds: number[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('files', image);
        });

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Lỗi khi tải ảnh lên');
        }

        const uploadedFiles = await uploadResponse.json();
        uploadedImageIds = uploadedFiles.map((file: any) => file.id);
      }

      // Create review
      const reviewData = {
        data: {
          Rating: rating,
          Title: title,
          Comment: comment,
          CarModel: carModelId,
          Images: uploadedImageIds,
        },
      };

      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      const response = await fetch(
        `${apiUrl}/api/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Lỗi khi gửi đánh giá');
      }

      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
      setImages([]);
      setImagePreviews([]);
      setIsOpen(false);

      // Show success message
      alert('Đánh giá của bạn đã được gửi và đang chờ duyệt!');

      // Callback
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
        <p className="text-gray-600 mb-4">
          Vui lòng đăng nhập để viết đánh giá
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Viết đánh giá
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Viết đánh giá của bạn</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn *
              </label>
              <RatingStars
                rating={rating}
                size="lg"
                showValue={false}
                interactive
                onRatingChange={setRating}
              />
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="review-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tiêu đề
              </label>
              <input
                id="review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Tóm tắt đánh giá của bạn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="review-comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nhận xét *
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={5}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh (Tối đa 5 ảnh)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Tải ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || !comment}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
