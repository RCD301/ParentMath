# Deployment Guide

This guide explains how to deploy ParentMath to various hosting platforms.

## Important: API Key Security

**⚠️ SECURITY WARNING**: The current MVP uses client-side API calls with `dangerouslyAllowBrowser: true`. This is acceptable for:
- Personal use
- Testing/demos
- MVPs with limited users

**For production with multiple users, you MUST:**
1. Create a backend proxy to hide your API key
2. Implement rate limiting
3. Add user authentication if needed

## Option 1: Vercel (Recommended - Easiest)

Vercel offers free hosting for static sites and is perfect for React apps.

### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build your app**
```bash
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables**
- Go to your Vercel dashboard
- Navigate to your project settings
- Add `VITE_ANTHROPIC_API_KEY` under Environment Variables
- Redeploy

**Important**: Don't commit `.env` to Git. Set environment variables in Vercel's dashboard.

## Option 2: Netlify

Netlify is another excellent free option for static sites.

### Steps:

1. **Build your app**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **Or use Netlify Drop**
- Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
- Drag and drop your `dist` folder

4. **Set Environment Variables**
- Go to Site settings → Build & deploy → Environment
- Add `VITE_ANTHROPIC_API_KEY`

## Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

### Steps:

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update vite.config.js**

Add the base URL (replace `your-repo-name`):

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

3. **Add deploy scripts to package.json**

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

**Note**: GitHub Pages doesn't support environment variables, so you'll need to hardcode the API key (not recommended for production).

## Option 4: Backend Proxy (Production-Ready)

For a production app, set up a backend to keep your API key secure.

### Example Backend (Node.js/Express):

```javascript
// server.js
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.post('/api/analyze-text', async (req, res) => {
  try {
    const { problemText, mode } = req.body;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: getSystemPrompt(mode),
      messages: [{
        role: 'user',
        content: `Analyze this math problem: ${problemText}`
      }]
    });

    res.json({ result: message.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### Update Frontend:

In `src/services/anthropicService.js`, change the API calls to use your backend:

```javascript
export const analyzeMathProblemText = async (problemText, mode = 'parent') => {
  const response = await fetch('/api/analyze-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemText, mode })
  });

  const data = await response.json();
  return data.result;
};
```

## Environment Variables Checklist

Before deploying, ensure:

- [ ] `.env` is in `.gitignore` (already done)
- [ ] API key is set in hosting platform's environment variables
- [ ] `.env` file is NOT committed to Git
- [ ] Production build works locally (`npm run build && npm run preview`)

## Post-Deployment Testing

After deploying, test:

1. ✅ Landing page loads correctly
2. ✅ Mode selection works (Parent/Kid)
3. ✅ Text input analyzes problems successfully
4. ✅ Photo upload works (if applicable on your platform)
5. ✅ Results display properly
6. ✅ Mobile responsiveness is maintained
7. ✅ API key is secure (check browser DevTools → Network tab)

## Cost Monitoring

Keep an eye on your Anthropic API usage:

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Check the Usage section
3. Set up billing alerts if available

**Claude Sonnet 4 Pricing (as of 2025):**
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

Average cost per problem analysis: $0.01-0.05

## Rate Limiting (Production)

For production, implement rate limiting:

```javascript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/', limiter);
```

## Domain Setup

Once deployed, you can:

1. Get a custom domain (e.g., mathtranslator.app)
2. Point it to your hosting platform
3. Enable HTTPS (usually automatic on Vercel/Netlify)

## Monitoring & Analytics

Consider adding:

- **Google Analytics** - Track usage
- **Sentry** - Error monitoring
- **LogRocket** - Session replay
- **Hotjar** - User behavior

---

## Quick Deploy Commands Summary

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod
```

**GitHub Pages:**
```bash
npm run deploy
```

---

Need help? Check the [README.md](README.md) for more information.
