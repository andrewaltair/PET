'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ImageUploadProps {
  mainImageUrl?: string;
  subImages?: string[];
  onMainImageChange: (url: string) => void;
  onSubImagesChange: (urls: string[]) => void;
  maxSubImages?: number;
}

export function ImageUpload({
  mainImageUrl,
  subImages = [],
  onMainImageChange,
  onSubImagesChange,
  maxSubImages = 10,
}: ImageUploadProps) {
  const t = useTranslations('ImageUpload');
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const subImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingSub, setUploadingSub] = useState(false);

  const handleMainImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    try {
      // In a real implementation, upload to cloud storage (e.g., AWS S3, Cloudinary)
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file);
      onMainImageChange(url);
    } catch (error) {
      console.error('Error uploading main image:', error);
    } finally {
      setUploadingMain(false);
    }
  };

  const handleSubImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingSub(true);
    try {
      const newUrls: string[] = [];
      for (const file of files) {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      }
      
      const updatedSubImages = [...subImages, ...newUrls].slice(0, maxSubImages);
      onSubImagesChange(updatedSubImages);
    } catch (error) {
      console.error('Error uploading sub images:', error);
    } finally {
      setUploadingSub(false);
    }
  };

  const removeMainImage = () => {
    onMainImageChange('');
  };

  const removeSubImage = (index: number) => {
    const updated = subImages.filter((_, i) => i !== index);
    onSubImagesChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Main Image *
        </label>
        <Card className="p-4">
          {mainImageUrl ? (
            <div className="relative">
              <img
                src={mainImageUrl}
                alt="Main service image"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-xx"
                onClick={removeMainImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                No main image selected
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => mainImageInputRef.current?.click()}
                disabled={uploadingMain}
              >
                {uploadingMain ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Select Main Image
                  </>
                )}
              </Button>
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageSelect}
                className="hidden"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Sub Images */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Additional Images ({subImages.length}/{maxSubImages})
        </label>
        <p className="text-sm text-gray-600">
          Add up to {maxSubImages} additional images (optional)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subImages.map((url, index) => (
            <Card key={index} className="relative p-2">
              <img
                src={url}
                alt={`Sub image ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1"
                onClick={() => removeSubImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Card>
          ))}
          
          {subImages.length < maxSubImages && (
            <Card className="border-2 border-dashed border-gray-300 p-4 flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => subImageInputRef.current?.click()}
                disabled={uploadingSub}
                className="w-full h-full min-h-[128px]"
              >
                {uploadingSub ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Image
                  </>
                )}
              </Button>
              <input
                ref={subImageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImageSelect}
                className="hidden"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

