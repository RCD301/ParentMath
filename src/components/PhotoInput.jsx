import React, { useState, useRef } from 'react';
import { CameraIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { compressImage, isValidImage } from '../utils/imageProcessor';
import './PhotoInput.css';

/**
 * PhotoInput Component
 * Handles image upload, preview, and submission
 */
const PhotoInput = ({ mode, onSubmit, onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file
    if (!isValidImage(file)) {
      setError('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please select an image under 10MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Compress image
      const base64Image = await compressImage(selectedFile);
      const mediaType = selectedFile.type === 'image/png' ? 'image/png' : 'image/jpeg';

      // Pass to parent
      onSubmit({
        type: 'image',
        data: base64Image,
        mediaType: mediaType,
        preview: preview
      });
    } catch (err) {
      setError('Failed to process image. Please try again or use text input instead.');
      console.error('Image processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="photo-input">
      <div className="photo-input-container">
        <header className="photo-input-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2 className="photo-input-title">
            {mode === 'parent' ? 'Parent Coach Mode' : 'Kid-Friendly Mode'}
          </h2>
          <p className="photo-input-subtitle">Take or upload a photo of the homework</p>
        </header>

        <div className="photo-input-content">
          {!preview ? (
            <div className="upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-label">
                <CameraIcon className="upload-icon" />
                <h3>Take or Choose Photo</h3>
                <p>Click to open camera or select from gallery</p>
                <span className="upload-hint">Supports JPG, PNG, WebP (max 10MB)</span>
              </label>
            </div>
          ) : (
            <div className="preview-area">
              <div className="preview-image-container">
                <img src={preview} alt="Homework preview" className="preview-image" />
              </div>

              <div className="preview-actions">
                <button
                  className="button button-secondary"
                  onClick={handleClear}
                  disabled={isProcessing}
                >
                  Choose Different Photo
                </button>
                <button
                  className="button button-primary"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Analyze Problem'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isProcessing && (
            <div className="processing-overlay">
              <div className="spinner"></div>
              <p>Analyzing the problem...</p>
            </div>
          )}
        </div>

        <div className="photo-input-footer">
          <p className="footer-tip">
            <InformationCircleIcon className="footer-icon" />
            <span><strong>Tip:</strong> Make sure the problem is clearly visible and well-lit</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoInput;
