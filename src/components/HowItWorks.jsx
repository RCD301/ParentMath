import React from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { LoginPanel } from './LoginPanel';
import './HowItWorks.css';

/**
 * How ParentMath Works - Product Explanation Page
 * Route: /how-it-works
 */
const HowItWorks = () => {
  const handleGetStartedClick = async (e) => {
    e.preventDefault();
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

  return (
    <div className="how-it-works-page">
      <article className="how-it-works-article">
        {/* Card Header with Login */}
        <div className="card-header">
          <LoginPanel />
        </div>

        <header className="how-it-works-header">
          <h1>How ParentMath Works</h1>
        </header>

        <section className="how-it-works-section">
          <p>Homework time is stressful for many parents. The math your child brings home looks different from what you learned. You want to help, but you're not sure how—and you don't want to make things worse by guessing.</p>

          <p>ParentMath exists to help parents support their child without relearning math or pretending to understand methods they've never seen.</p>
        </section>

        <section className="how-it-works-section">
          <h2>What ParentMath Is</h2>

          <p>ParentMath is a tool for parents, not students.</p>

          <p>It explains what a homework problem is asking, what method the teacher expects, and how to guide your child through it calmly. It doesn't do the work for your child. It helps you understand the problem so you can help them think it through.</p>

          <p>When you're stuck looking at a worksheet that doesn't make sense, ParentMath gives you the clarity you need to stay calm and confident.</p>
        </section>

        <section className="how-it-works-section">
          <h2>Who ParentMath Is For</h2>

          <p>ParentMath is built for parents of elementary school children in grades K–5. It's especially helpful if you:</p>

          <ul>
            <li>Feel unsure about the new math methods schools are teaching</li>
            <li>Want to help without confusing your child or undermining their teacher</li>
            <li>Don't want to admit you're lost in front of your child</li>
            <li>Want to protect your child's confidence during homework time</li>
          </ul>

          <p>You don't need to be good at math to use ParentMath. You just need to care about helping your child without adding stress.</p>
        </section>

        <section className="how-it-works-section">
          <h2>How ParentMath Works</h2>

          <div className="how-it-works-steps">
            <div className="step">
              <h3>Step 1: Take a photo or type it in</h3>
              <p>When your child asks for help, take a photo of the homework problem or type the question into ParentMath.</p>
            </div>

            <div className="step">
              <h3>Step 2: Get a clear explanation</h3>
              <p>ParentMath explains what the problem is asking, what method the teacher expects, and how to talk about it with your child—in plain language, without jargon.</p>
            </div>

            <div className="step">
              <h3>Step 3: Guide your child calmly</h3>
              <p>Use the explanation to ask guiding questions and help your child think it through themselves. You stay calm, your child stays confident, and homework gets done.</p>
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <h2>What ParentMath Is Not</h2>

          <p>It's important to understand what ParentMath doesn't do:</p>

          <ul>
            <li>It is not a tutor for children. It talks to parents, not students.</li>
            <li>It is not meant to replace teachers. It helps you understand what the teacher is teaching.</li>
            <li>It is not a game or practice app. It's support for parents during real homework time.</li>
            <li>It does not talk directly to children. You stay in control of how you help.</li>
          </ul>

          <p>This is reassurance, not limitation. ParentMath is built to support you without taking over the parent-child relationship during learning time.</p>
        </section>

        <section className="how-it-works-section">
          <h2>When ParentMath Is Most Helpful</h2>

          <p>Parents find ParentMath most useful when:</p>

          <ul>
            <li>Homework instructions don't make sense, even after reading them twice</li>
            <li>Your child is frustrated or shutting down, and you need to understand the problem quickly</li>
            <li>You want to help without taking over or doing the work for them</li>
            <li>You're tired and don't have the energy to decode unfamiliar math methods</li>
          </ul>

          <p>ParentMath works best when you need calm, practical support in the moment—not lectures or long explanations.</p>
        </section>

        <section className="how-it-works-section">
          <p>If you're interested in understanding the broader challenges parents face with math homework, read our guide: <a href="/help-your-child-with-math-homework">How to Help Your Child With Math Homework</a>.</p>

          <p>For more details on pricing, visit the <a href="/pricing">pricing page</a>.</p>
        </section>

        <section className="how-it-works-section how-it-works-cta-section">
          <h2>Ready to Try ParentMath?</h2>

          <p>If you want support understanding tonight's homework, ParentMath is here to help.</p>

          <p>For $4.99 a month, you get clear explanations whenever you need them. No pressure. No commitment required.</p>

          <p className="how-it-works-cta-button-container">
            <button onClick={handleGetStartedClick} className="how-it-works-cta-button">Get Started With ParentMath – $4.99/Month</button>
          </p>

          <p className="how-it-works-cta-subtext">Take a photo of the problem. Get clear guidance in seconds.</p>
        </section>
      </article>
    </div>
  );
};

export default HowItWorks;
