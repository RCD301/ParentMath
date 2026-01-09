import React from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { LoginPanel } from './LoginPanel';
import './HelpYourChild.css';

/**
 * SEO Landing Page: How to Help Your Child With Math Homework
 * Target keyword: "how to help your child with math homework"
 */
const HelpYourChild = () => {
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
    <div className="help-page">
      <article className="help-article">
        {/* Card Header with Login */}
        <div className="card-header">
          <LoginPanel />
        </div>
        <header className="help-header">
          <h1>How to Help Your Child With Math Homework (Even If You're Bad at Math)</h1>
          <p className="help-subhead">A practical guide for parents of elementary school students (grades K–5)</p>
        </header>

        <section className="help-section">
          <p>You're sitting at the kitchen table. Your child is staring at a worksheet that looks nothing like the math you learned. They ask you to explain it. You don't understand the question yourself.</p>

          <p>You feel stuck between wanting to help and not knowing how. You worry that admitting confusion will make things worse. You're not alone in this.</p>

          <p>Most parents of elementary school children feel lost when math homework comes home. The methods have changed. The language is unfamiliar. And the pressure to help without harming your child's confidence is real.</p>

          <p>Here's what matters: you don't need to be good at math to support your child. You need to understand what they're being taught and how to talk about it calmly. That's what this guide is for.</p>

          <p className="help-inline-cta">If you need immediate help understanding a specific problem, <a href="/">try ParentMath</a>—it explains homework problems in plain language so you can guide your child with confidence.</p>
        </section>

        <section className="help-section">
          <h2>Why Math Homework Feels So Hard Now</h2>

          <p>The math your child brings home probably looks different from what you remember. Instead of memorizing steps, students are asked to explain their thinking. Instead of one method, they learn multiple strategies for the same problem.</p>

          <p>This isn't because schools are making things complicated on purpose. It's because research shows that understanding why something works matters more than just knowing how to do it quickly.</p>

          <p>The challenge for parents is that these methods weren't taught to us. We learned procedures. Our children are learning concepts. When we try to help using the old way, it creates confusion instead of clarity.</p>

          <p>Feeling confused doesn't mean you're failing. It means you're being asked to bridge two different approaches to teaching math. That's hard work, and it's normal to struggle with it.</p>
        </section>

        <section className="help-section">
          <h2>If Your Child Shuts Down During Math</h2>

          <p>You've seen it happen. Your child looks at the problem, their face changes, and they say "I can't do this" or "I'm stupid at math." They might cry, refuse to try, or suddenly need to use the bathroom.</p>

          <p>This isn't defiance. It's overwhelm. When a child shuts down during math, they're not being difficult. They're experiencing real stress, and their brain is trying to escape it.</p>

          <p>Many parents misinterpret this as a lack of effort or a sign that their child "isn't a math person." But most of the time, it's not about ability. It's about feeling unsafe with not knowing the answer.</p>

          <p>Here's what helps in the moment:</p>

          <ul>
            <li>Pause the problem. Put the pencil down. Take a breath together.</li>
            <li>Acknowledge that it feels hard right now. Don't try to convince them it's easy.</li>
            <li>Ask: "What part makes sense so far?" Start there, not at the stuck point.</li>
            <li>Avoid saying: "You know this," "Just think," or "We already went over this."</li>
            <li>Instead try: "Let's figure this out together," "I'm here with you," or "We can take our time."</li>
          </ul>

          <p>Your calm presence matters more than getting the right answer. When your child feels safe being confused, they're more likely to keep trying.</p>
        </section>

        <section className="help-section">
          <h2>How to Explain Math to Kids (Without Teaching a Full Lesson)</h2>

          <p>You don't need to become a math teacher. Your job isn't to reteach the lesson. It's to help your child think through what they already learned in class.</p>

          <p>The most effective way to do this is to ask questions instead of giving answers. When your child is stuck, resist the urge to solve it for them. Instead, guide them back to their own thinking.</p>

          <p>Here's a simple framework:</p>

          <ul>
            <li>Ask: "What is the problem asking us to find?"</li>
            <li>Ask: "What do we already know from the problem?"</li>
            <li>Ask: "What did your teacher show you in class for problems like this?"</li>
            <li>If they're still stuck, use a simpler example: "Let's try this with smaller numbers first."</li>
          </ul>

          <p>For example, if the problem is about fractions and they're confused, you might ask: "If we had a pizza cut into 4 slices and you ate 1, how much is left?" Use something they can picture. Then connect it back to the numbers on the page.</p>

          <p>You're not lecturing. You're helping them access what they already understand. That's the difference between explaining and teaching.</p>
        </section>

        <section className="help-section">
          <h2>When You're Bad at Math but Still Want to Help</h2>

          <p>Let's address this directly: if you think you're bad at math, you can still help your child succeed.</p>

          <p>You don't need to solve every problem yourself. You need to create an environment where your child feels supported, not judged. You need to help them organize their thinking. And you need to know when to say "Let's look this up together" instead of guessing.</p>

          <p>Your role is not to be the expert. Your role is to be:</p>

          <ul>
            <li>A translator between what the worksheet is asking and what your child understands</li>
            <li>A guide who helps them slow down and re-read the question</li>
            <li>An emotional anchor who stays calm when they feel frustrated</li>
          </ul>

          <p>Many parents who struggled with math in school end up being better homework helpers than those who found it easy. Why? Because they remember what it feels like to not understand. They have more patience. They don't assume things are obvious.</p>

          <p>If you don't know how to solve a problem, it's okay to say that. What's not okay is pretending to know and then confusing your child further. Instead, say: "I'm not sure about this method, but let's figure it out together."</p>

          <p>The shame you might feel about not understanding math doesn't need to be passed down. You can break that cycle by being honest, curious, and calm.</p>
        </section>

        <section className="help-section">
          <h2>Math Anxiety in Kids</h2>

          <p>Some children develop a fear of math that goes beyond normal frustration. This is called math anxiety, and it can start as early as first or second grade.</p>

          <p>Signs of math anxiety include:</p>

          <ul>
            <li>Avoidance (taking a long time to start, frequent bathroom breaks, "forgetting" homework)</li>
            <li>Physical symptoms (stomachaches, headaches, crying before math work)</li>
            <li>Negative self-talk ("I'm dumb," "I'll never get this," "I hate math")</li>
            <li>Rigid thinking (insisting there's only one right way, panicking over mistakes)</li>
          </ul>

          <p>Parents often make this worse without meaning to. Saying things like "I was bad at math too" might feel like solidarity, but it sends the message that struggling is permanent. Hovering over their work signals that you don't trust them to figure it out. Praising only correct answers teaches them that mistakes are failures.</p>

          <p>Small shifts that help rebuild confidence:</p>

          <ul>
            <li>Praise effort and thinking, not just right answers: "I like how you tried a different strategy."</li>
            <li>Normalize mistakes: "Mistakes help us learn. Let's see what this one teaches us."</li>
            <li>Give them space: Step back once they start working. Check in, don't hover.</li>
            <li>Keep homework time short: If it's taking too long, stop. Write a note to the teacher.</li>
          </ul>

          <p>Math anxiety doesn't mean your child isn't capable. It means they need more emotional safety around being wrong. You can provide that.</p>
        </section>

        <section className="help-section help-cta-section">
          <h2>When You Need More Than Patience</h2>

          <p>Sometimes the biggest barrier isn't your child's understanding—it's yours. You want to help, but you don't know what the worksheet is actually asking for. You don't understand the method they're supposed to use. And you're out of time.</p>

          <p>This is where ParentMath helps.</p>

          <p>Take a photo of the problem or type it in. Get a clear explanation of what's being asked and how to guide your child through it—using the method their teacher expects. No jargon. No lectures. Just the clarity you need to help your child think it through.</p>

          <p>ParentMath is built for parents, not students. It's not a tutoring service. It's support for you, so you can stay calm and confident during homework time.</p>

          <p className="help-cta-button-container">
            <a href="/" className="help-cta-button">Try ParentMath Free</a>
          </p>
        </section>

        <section className="help-section">
          <h2>Common Questions About Helping With Math Homework</h2>

          <div className="help-faq">
            <div className="faq-item">
              <h3>What if I don't understand the new math methods schools are teaching?</h3>
              <p>You don't need to master every method. Your role is to help your child organize their thinking and stay calm when they're stuck. Ask guiding questions instead of teaching. If you're unsure about a method, it's okay to say "Let's figure this out together" or use a tool like ParentMath to understand the approach their teacher expects.</p>
            </div>

            <div className="faq-item">
              <h3>How much should I help with elementary math homework?</h3>
              <p>Help your child understand the problem, not solve it for them. Ask questions like "What is this asking?" or "What did your teacher show you?" Your job is to guide their thinking, not to provide answers. If homework is taking too long or causing stress, stop and write a note to the teacher.</p>
            </div>

            <div className="faq-item">
              <h3>What if my child says they hate math or shuts down during homework?</h3>
              <p>This is often a sign of math anxiety, not a lack of ability. Pause the work. Acknowledge that it feels hard. Focus on effort over correct answers. Create emotional safety around making mistakes. If the pattern continues, talk to their teacher about what's causing the stress.</p>
            </div>

            <div className="faq-item">
              <h3>Can I teach my child the way I learned math instead?</h3>
              <p>Avoid this. Teaching a different method than what's being used in class creates confusion. Your child's teacher is building a foundation using specific strategies. If you introduce a conflicting approach, it can undermine their understanding. Instead, try to understand the method being taught, even if it seems unfamiliar.</p>
            </div>
          </div>
        </section>

        <section className="help-section help-final-section">
          <h2>Homework Time Doesn't Have to Feel This Hard</h2>

          <p>You care about your child's learning. You want to help without creating stress. You want them to feel confident, not anxious. That's why you're here.</p>

          <p>The truth is, most parents don't need to relearn elementary math. They need a translation layer between what schools are teaching and what makes sense to them. They need reassurance that confusion is normal. And they need a way to support their child without pretending to have all the answers.</p>

          <p>ParentMath gives you that. For $4.99 a month, you get clear explanations for every homework problem your child brings home. No pressure. No judgment. Just calm, practical guidance when you need it most.</p>

          <p>Homework time can feel lighter. Your child can feel more capable. And you can stop second-guessing yourself every time they ask for help.</p>

          <p className="help-cta-button-container">
            <button onClick={handleGetStartedClick} className="help-cta-button help-cta-button-primary">Get Started With ParentMath – $4.99/Month</button>
          </p>

          <p className="help-cta-subtext">Take a photo of the problem. Get clear guidance in seconds. No commitment required.</p>
        </section>

        {/* Footer */}
        <footer className="landing-footer-single">
          <p>Supports elementary math (grades K-5)</p>
          <p className="footer-support-text">
            Need help or have a question?<br />
            Email us at <a href="mailto:help@parentmath.com" className="footer-support-email">help@parentmath.com</a>
          </p>
        </footer>
      </article>
    </div>
  );
};

export default HelpYourChild;
