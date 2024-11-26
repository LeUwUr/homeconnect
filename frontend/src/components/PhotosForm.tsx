import React, { useState } from 'react';

interface PhotosFormProps {
  updateFormData: (data: any) => void;
}

const PhotosForm: React.FC<PhotosFormProps> = ({ updateFormData }) => {
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real application, you would handle file uploads here
      // For now, we'll just store the file names
      const newPhotos = Array.from(files).map(file => file.name);
      setPhotos(prev => [...prev, ...newPhotos]);
      updateFormData(photos);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fotos Adicionales
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Subir fotos</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Fotos seleccionadas:</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="text-sm text-gray-500">
                {photo}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosForm;