
import React, { useState, useCallback, useRef } from 'react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile | null) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove data:mime/type;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini inline data
        alert("File is too large. Please select an image under 4MB.");
        return;
      }
      setPreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      onImageUpload({ base64, mimeType: file.type });
    } else {
      setPreview(null);
      onImageUpload(null);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
          if (fileInputRef.current) {
              fileInputRef.current.files = files;
              handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
          }
      }
  }, [handleFileChange]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">1. Upload Group Photo</label>
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mt-1 flex justify-center items-center w-full h-48 px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-md" />
        ) : (
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-400">
              <p className="pl-1">Upload an image or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 4MB</p>
          </div>
        )}
        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
      </label>
    </div>
  );
};
