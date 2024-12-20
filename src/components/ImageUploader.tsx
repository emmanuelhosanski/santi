import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  label: string;
  currentImage: string | null;
}

export function ImageUploader({ 
  onImageSelect, 
  onImageClear,
  label, 
  currentImage 
}: ImageUploaderProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  if (currentImage) {
    return (
      <div className="relative">
        <img 
          src={currentImage} 
          alt="Selected" 
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          onClick={onImageClear}
          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">{label}</span>
        </p>
        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </label>
  );
}