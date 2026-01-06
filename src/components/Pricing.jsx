// src/components/Pricing.jsx
import React from 'react';
import './Pricing.css';

function Pricing() {
  const handleContinueToPayment = () => {
    // TODO: Implement Stripe checkout
    alert('Stripe integration coming next');
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        <button className="pricing-back" onClick={handleBackHome} aria-label="Back to home">
          ← Back
        </button>

        <div className="pricing-header">
          <h1 className="pricing-title">Go Pro</h1>
          <p className="pricing-subtitle">Unlock unlimited math help</p>
        </div>

        <div className="pricing-card">
          <div className="pricing-badge">Most Popular</div>

          <div className="pricing-plan-name">Pro Monthly</div>

          <div className="pricing-amount">
            <span className="pricing-currency">$</span>
            <span className="pricing-price">4.99</span>
            <span className="pricing-period">/month</span>
          </div>

          <div className="pricing-features">
            <h3>Everything you need:</h3>
            <ul>
              <li>✓ Unlimited problem solving</li>
              <li>✓ Save your problem history</li>
              <li>✓ Access from any device</li>
              <li>✓ Priority support</li>
              <li>✓ Cancel anytime</li>
            </ul>
          </div>

          <button
            className="btn-continue-payment"
            onClick={handleContinueToPayment}
            disabled
          >
            Continue to payment
          </button>

          <p className="pricing-notice">
            Stripe checkout coming next
          </p>
        </div>

        <div className="pricing-footer">
          <p>No hidden fees. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
