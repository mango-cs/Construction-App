import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, X, Upload } from 'lucide-react';
import type { User, UpdateFormData } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface UpdatePageProps {
  user: User;
}

const UpdatePage: React.FC<UpdatePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UpdateFormData>({
    title: '',
    description: '',
    photos: [],
    videos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof UpdateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const files = Array.from(event.target.files || []);
    
    if (type === 'photo') {
      if (formData.photos.length + files.length > 5) {
        setError('Maximum 5 photos allowed');
        return;
      }
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    } else {
      if (formData.videos.length + files.length > 3) {
        setError('Maximum 3 videos allowed');
        return;
      }
      // Check video duration
      files.forEach(file => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          if (video.duration > 120) { // 2 minutes
            setError('Videos must be under 2 minutes');
            return;
          }
        };
        video.src = URL.createObjectURL(file);
      });
      setFormData(prev => ({ ...prev, videos: [...prev.videos, ...files] }));
    }
    setError('');
  };

  const removeFile = (index: number, type: 'photo' | 'video') => {
    if (type === 'photo') {
      setFormData(prev => ({ 
        ...prev, 
        photos: prev.photos.filter((_, i) => i !== index) 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        videos: prev.videos.filter((_, i) => i !== index) 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement Firebase upload logic
      console.log('Submitting update:', formData);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Create Update
            </h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Update Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input-field"
              placeholder="e.g., Roof work completed"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field"
              placeholder="Describe the progress made..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos ({formData.photos.length}/5)
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={formData.photos.length >= 5}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Add Photos</span>
                </div>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e, 'photo')}
                className="hidden"
              />

              {/* Photo Preview */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.photos.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'photo')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Videos ({formData.videos.length}/3)
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={formData.videos.length >= 3}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Video className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Add Videos (max 2 min)</span>
                </div>
              </button>
              
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileSelect(e, 'video')}
                className="hidden"
              />

              {/* Video Preview */}
              {formData.videos.length > 0 && (
                <div className="space-y-2">
                  {formData.videos.map((file, index) => (
                    <div key={index} className="relative">
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-32 object-cover rounded-lg"
                        controls
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'video')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex justify-center items-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Update...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create Update
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePage; 