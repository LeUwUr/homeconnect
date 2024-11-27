import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface PhotosFormProps {
  onNext: () => void;
  onPrev: () => void;
  updateFormData: (data: any) => void;
}

const PhotosForm: React.FC<PhotosFormProps> = ({ onNext, onPrev, updateFormData }) => {
  const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + additionalPhotos.length > 5) {
      alert('Maximum 5 additional photos allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setAdditionalPhotos(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
    updateFormData(files);
  };

  const removePhoto = (index: number) => {
    setAdditionalPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fotos Adicionales (Máximo 5)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="photos-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Subir fotos</span>
                <input
                  id="photos-upload"
                  name="photos"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={additionalPhotos.length >= 5}
                />
              </label>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG hasta 10MB ({5 - additionalPhotos.length} restantes)
            </p>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-40 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PhotosForm;