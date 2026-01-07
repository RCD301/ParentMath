// src/components/SkeletonLoader.jsx
import React from 'react';
import './SkeletonLoader.css';

/**
 * Skeleton Loader Component
 * Shows content-aware loading skeletons for better perceived performance
 */
export const SkeletonLoader = ({ mode }) => {
  return (
    <div className="skeleton-container">
      {mode === 'parent' ? (
        // Parent mode skeleton - structured sections
        <>
          <div className="skeleton-section">
            <div className="skeleton-heading skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line short skeleton-shimmer"></div>
          </div>

          <div className="skeleton-section">
            <div className="skeleton-heading skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
          </div>

          <div className="skeleton-section">
            <div className="skeleton-heading skeleton-shimmer"></div>
            <div className="skeleton-step">
              <div className="skeleton-line skeleton-shimmer"></div>
              <div className="skeleton-line short skeleton-shimmer"></div>
            </div>
            <div className="skeleton-step">
              <div className="skeleton-line skeleton-shimmer"></div>
              <div className="skeleton-line short skeleton-shimmer"></div>
            </div>
            <div className="skeleton-step">
              <div className="skeleton-line skeleton-shimmer"></div>
              <div className="skeleton-line short skeleton-shimmer"></div>
            </div>
          </div>

          <div className="skeleton-section">
            <div className="skeleton-heading skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line short skeleton-shimmer"></div>
          </div>
        </>
      ) : (
        // Kid mode skeleton - simpler paragraphs
        <>
          <div className="skeleton-section">
            <div className="skeleton-heading skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
          </div>

          <div className="skeleton-section">
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line short skeleton-shimmer"></div>
          </div>

          <div className="skeleton-section">
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line short skeleton-shimmer"></div>
          </div>

          <div className="skeleton-section">
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
          </div>
        </>
      )}
    </div>
  );
};
