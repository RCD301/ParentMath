// src/components/PaywallModal.tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { useAuth } from '../context/AuthContext';
import './PaywallModal.css';

interface PaywallModalProps {
  onClose: () => void;
  usesRemaining: number;
}

export function PaywallModal({ onClose, usesRemaining }: PaywallModalProps) {
  const { user } = useAuth();
  const isAnonymous = user?.isAnonymous ?? true;
  const usedCount = 5 - usesRemaining;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleGoProClick = async () => {
    try {
      const functions = getFunctions(getApp());
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');

      const result = await createCheckoutSession();
      const data = result.data as { url: string };

      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  const handleLoginClick = () => {
    // Scroll to top where LoginPanel is located
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close when clicking backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="paywall-overlay" onClick={handleOverlayClick}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <button className="paywall-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="paywall-content">
          {/* Progress Indicator */}
          <div className="paywall-progress">
            <span className="progress-badge">✓ {usedCount}/5 free problems used</span>
          </div>

          <h2 className="paywall-title">You've reached the free limit</h2>
          <p className="paywall-subtitle">Go unlimited and save your history</p>

          {isAnonymous && (
            <p className="paywall-save-notice">
              💡 Create an account to save your progress
            </p>
          )}

          <div className="paywall-benefits">
            <h3>Unlock Pro Benefits:</h3>
            <ul>
              <li>Unlimited problem solving</li>
              <li>Save your problem history</li>
              <li>Access from any device</li>
              <li>Priority support</li>
            </ul>
          </div>

          <div className="paywall-actions">
            <button className="btn-go-pro" onClick={handleGoProClick}>
              Go Pro – $4.99/mo
            </button>

            {isAnonymous ? (
              <button className="btn-login-alt" onClick={handleLoginClick}>
                Log in or create account
              </button>
            ) : (
              <p className="paywall-hint">
                Already have Pro? Make sure you're signed in with the correct account.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
