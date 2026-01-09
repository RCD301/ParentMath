import React, { useState, useCallback } from 'react';
import { BookOpenIcon, ChatBubbleLeftRightIcon, CameraIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Cropper from 'react-easy-crop';
import { extractTextFromImage } from '../utils/ocrService';
import { detectProblems, validateDetection } from '../utils/problemDetector';
import { LoginPanel } from './LoginPanel';
import './Landing.css';

/**
 * Landing Component - Single Page Workflow
 * Contains mode selection, input method, and input forms all on one page
 */
const Landing = ({ onSubmit, preservedState }) => {
  const [selectedMode, setSelectedMode] = useState(preservedState?.mode || null);
  const [selectedMethod, setSelectedMethod] = useState(preservedState?.method || null);
  const [problemText, setProblemText] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(preservedState?.method === 'photo');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [error, setError] = useState(null);
  const [detectedProblems, setDetectedProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setError(null);
    // Don't reset selectedMethod - preserve the user's input method choice
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setError(null);
    if (method === 'photo') {
      setShowPhotoUpload(true);
    } else {
      setShowPhotoUpload(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please select an image under 10MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setDetectedProblems([]);
    setSelectedProblem(null);
    setIsCropping(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreview(reader.result);
      setOriginalPreview(reader.result);
      // Don't auto-run OCR anymore - wait for user to crop or analyze
    };
    reader.readAsDataURL(file);
  };

  const handleRetakePhoto = () => {
    setPreview(null);
    setOriginalPreview(null);
    setSelectedFile(null);
    setDetectedProblems([]);
    setSelectedProblem(null);
    setError(null);
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleStartCrop = () => {
    setIsCropping(true);
    setError(null);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result);
        };
      }, 'image/jpeg');
    });
  };

  const handleApplyCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(originalPreview, croppedAreaPixels);
      setPreview(croppedImage);
      setIsCropping(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (e) {
      console.error('Error cropping image:', e);
      setError('Failed to crop image. Please try again.');
    }
  };

  const handleUndoCrop = () => {
    setPreview(originalPreview);
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setError(null);
  };

  const performOCR = async (dataUrl, mediaType) => {
    setIsProcessingOCR(true);
    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data
      const base64 = dataUrl.split(',')[1];

      // Call OCR service
      const extractedText = await extractTextFromImage(base64, mediaType);

      // Detect individual problems
      const problems = detectProblems(extractedText);

      if (validateDetection(problems)) {
        setDetectedProblems(problems);

        // Auto-select if only one problem
        if (problems.length === 1) {
          setSelectedProblem(problems[0]);
        }
      } else {
        // Fallback: treat as single problem
        setDetectedProblems([{
          id: 'problem-1',
          text: extractedText,
          label: 'Detected Text'
        }]);
        setSelectedProblem({
          id: 'problem-1',
          text: extractedText,
          label: 'Detected Text'
        });
      }
    } catch (err) {
      console.error('OCR error:', err);
      setError({
        type: 'ocr',
        message: 'Could not read text from this photo.'
      });
      // Allow fallback to image submission
    } finally {
      setIsProcessingOCR(false);
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!preview) return;
    await performOCR(preview, selectedFile.type);
  };

  const handleTextSubmit = () => {
    if (!selectedMode) {
      setError('Please select a mode (Parent or Kid) first');
      return;
    }
    const trimmed = problemText.trim();
    if (!trimmed) {
      setError('Please enter a math problem');
      return;
    }
    if (trimmed.length < 2) {
      setError('Problem seems too short. Please enter a complete math problem.');
      return;
    }

    onSubmit({
      mode: selectedMode,
      type: 'text',
      data: trimmed
    });
  };

  const handlePhotoSubmit = async () => {
    if (!selectedMode) {
      setError('Please select a mode (Parent or Kid) first');
      return;
    }
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    // If we have a selected problem from OCR, submit as text
    if (selectedProblem && selectedProblem.text) {
      onSubmit({
        mode: selectedMode,
        type: 'text',
        data: selectedProblem.text
      });
      return;
    }

    // If multiple problems detected but none selected
    if (detectedProblems.length > 1 && !selectedProblem) {
      setError('Please select which problem to analyze');
      return;
    }

    // Fallback: submit as image if OCR failed or wasn't performed
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      onSubmit({
        mode: selectedMode,
        type: 'image',
        data: base64,
        mediaType: selectedFile.type === 'image/png' ? 'image/png' : 'image/jpeg',
        preview: preview
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const exampleProblems = [
    '1/2 + 1/4',
    '25 × 4',
    'What is 2/3 of 12?',
    'If I have 5 apples and give away 2, how many do I have left?'
  ];

  return (
    <div className="landing">
      <div className="landing-container-single">
        {/* Card Header with Login */}
        <div className="card-header">
          <LoginPanel />
        </div>

        {/* Header */}
        <header className="landing-header-single">
          <h1 className="landing-title">ParentMath</h1>
          <p className="landing-tagline">Understand your child's "new math" with simple, parent-friendly explanations.</p>
          <div className="header-divider"></div>
        </header>

        {/* Mode Selection */}
        <section className="mode-section">
          <h2 className="section-title">Who needs help?</h2>
          <div className="mode-buttons-single">
            <button
              className={`mode-card ${selectedMode === 'parent' ? 'selected' : ''}`}
              onClick={() => handleModeSelect('parent')}
            >
              <BookOpenIcon className="mode-icon-simple" />
              <h3 className="mode-label">Parent</h3>
            </button>

            <button
              className={`mode-card ${selectedMode === 'kid' ? 'selected' : ''}`}
              onClick={() => handleModeSelect('kid')}
            >
              <ChatBubbleLeftRightIcon className="mode-icon-simple" />
              <h3 className="mode-label">Child</h3>
            </button>
          </div>
        </section>

        {/* Input Method Selection */}
        <section className="input-method-section">
          <h2 className="section-title">How would you like to share the homework?</h2>
          <div className="method-buttons-single">
            <button
              className={`method-card ${selectedMethod === 'photo' ? 'selected' : ''}`}
              onClick={() => handleMethodSelect('photo')}
            >
              <CameraIcon className="method-icon" />
              <span>Take Photo</span>
            </button>
            <button
              className={`method-card ${selectedMethod === 'text' ? 'selected' : ''}`}
              onClick={() => handleMethodSelect('text')}
            >
              <PencilSquareIcon className="method-icon" />
              <span>Type It In</span>
            </button>
          </div>
        </section>

        {/* Photo Upload */}
        {selectedMethod === 'photo' && (
          <section className="input-area">
            {!preview ? (
              <div className="upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="upload-label-single">
                  <CameraIcon className="upload-icon" />
                  <h3>Click to upload or take photo</h3>
                  <p>Supports JPG, PNG, WebP (max 10MB)</p>
                  <p className="upload-helper-text">
                    For best results: good lighting, dark text on light paper, and the problem centered in the frame.
                  </p>
                </label>
              </div>
            ) : (
              <div className="preview-zone">
                {!isCropping ? (
                  <img src={preview} alt="Preview" className="preview-img" />
                ) : (
                  <div className="crop-container">
                    <Cropper
                      image={originalPreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                )}

                {/* OCR Processing Indicator */}
                {isProcessingOCR && (
                  <div className="ocr-processing">
                    <div className="spinner-small"></div>
                    <p>Detecting problems...</p>
                  </div>
                )}

                {/* Problem Selection Chips */}
                {!isProcessingOCR && detectedProblems.length > 1 && (
                  <div className="problem-selection">
                    <p className="problem-selection-label">
                      We found {detectedProblems.length} problems. Select one:
                    </p>
                    <div className="problem-chips">
                      {detectedProblems.map((problem) => (
                        <button
                          key={problem.id}
                          className={`problem-chip ${selectedProblem?.id === problem.id ? 'selected' : ''}`}
                          onClick={() => setSelectedProblem(problem)}
                        >
                          <div className="problem-chip-label">{problem.label}</div>
                          <div className="problem-chip-preview">
                            {problem.text.substring(0, 60)}
                            {problem.text.length > 60 ? '...' : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Problem Display */}
                {!isProcessingOCR && selectedProblem && !isCropping && (
                  <div className="selected-problem-display">
                    <p className="selected-problem-label">Selected Problem:</p>
                    <div className="selected-problem-text">{selectedProblem.text}</div>
                  </div>
                )}

                {/* Action buttons */}
                {!isCropping ? (
                  <>
                    <div className="photo-button-row">
                      <button
                        className="btn-secondary"
                        onClick={handleRetakePhoto}
                        disabled={isAnalyzing}
                      >
                        Retake Photo
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={handleStartCrop}
                        disabled={isAnalyzing}
                      >
                        Crop Photo
                      </button>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={detectedProblems.length > 0 ? handlePhotoSubmit : handleAnalyzePhoto}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <span className="analyzing-button">
                          <span className="spinner-inline"></span>
                          Analyzing…
                        </span>
                      ) : (
                        'Analyze Problem →'
                      )}
                    </button>
                  </>
                ) : (
                  <div className="crop-actions">
                    <button
                      className="btn-secondary"
                      onClick={handleUndoCrop}
                    >
                      Undo Crop
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleApplyCrop}
                    >
                      Apply Crop
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Text Input */}
        {selectedMethod === 'text' && (
          <section className="input-area">
            <div className="text-input-zone">
              <label htmlFor="problem-input" className="input-label-single">
                Math Problem
              </label>
              <textarea
                id="problem-input"
                className="problem-textarea-single"
                placeholder="e.g., 1/2 + 1/4 or What is 2/3 of 12?"
                value={problemText}
                onChange={(e) => {
                  setProblemText(e.target.value);
                  setError(null);
                }}
                rows={4}
              />
              <p className="input-hint-single">
                {selectedMode === 'parent'
                  ? "Type the problem exactly as it appears. We'll explain the new math concept behind it."
                  : "Type the problem exactly as it appears."}
              </p>

              {/* Example Problems */}
              <div className="examples-inline">
                <p className="examples-label">Examples:</p>
                <div className="examples-chips">
                  {exampleProblems.map((example, index) => (
                    <button
                      key={index}
                      className="example-chip"
                      onClick={() => {
                        setProblemText(example);
                        setError(null);
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleTextSubmit}
                disabled={!problemText.trim()}
              >
                Get Teaching Guidance →
              </button>
            </div>
          </section>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message-single">
            {typeof error === 'string' ? (
              error
            ) : error.type === 'ocr' ? (
              <>
                <strong>{error.message}</strong>
                <ul className="error-tips">
                  <li>Try taking the photo in brighter lighting.</li>
                  <li>Avoid glare or screen lines.</li>
                  <li>Fill the frame with just the math problem.</li>
                  <li>Make sure the numbers are dark on a light background.</li>
                </ul>
              </>
            ) : (
              error.message || error
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="landing-footer-single">
          <p>Supports elementary math (grades K-5)</p>
          <a href="/help-your-child-with-math-homework" className="footer-help-link">
            How to Help Your Child With Math Homework
          </a>
          <p className="footer-support-text">
            Need help or have a question?<br />
            Email us at <a href="mailto:help@parentmath.com" className="footer-support-email">help@parentmath.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
