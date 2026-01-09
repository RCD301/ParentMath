// src/components/Pricing.jsx
import React from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { LoginPanel } from './LoginPanel';
import './Pricing.css';

function Pricing() {
  const handleContinueToPayment = async () => {
    try {
      const functions = getFunctions(getApp());
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');

      const result = await createCheckoutSession();
      const data = result.data;

      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {/* Card Header with Login */}
        <div className="card-header">
          <LoginPanel />
        </div>

        <button className="pricing-back" onClick={handleBackHome} aria-label="Back to home">
          ← Back
        </button>

        <div className="pricing-header">
          <h1 className="pricing-title">Simple, Calm Support for Math Homework</h1>
          <p className="pricing-subtitle">Everything you need to help your child — without pressure or judgment</p>
        </div>

        <div className="pricing-plan-name">ParentMath Pro</div>

        <div className="pricing-amount">
          <span className="pricing-currency">$</span>
          <span className="pricing-price">4.99</span>
          <span className="pricing-period">/month</span>
        </div>

        <div className="pricing-features">
          <h3>Everything you need:</h3>
          <ul>
            <li>✓ Help with every homework problem</li>
            <li>✓ Revisit past homework anytime</li>
            <li>✓ Use on your phone, tablet, or computer</li>
            <li>✓ Email support when you need help</li>
            <li>✓ Cancel anytime</li>
          </ul>
        </div>

        <button
          className="btn-continue-payment"
          onClick={handleContinueToPayment}
        >
          Get Started with ParentMath
        </button>

        <p className="pricing-notice">
          Secure checkout. Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}

export default Pricing;
