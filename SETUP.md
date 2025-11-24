# Quick Setup Guide

Follow these steps to get ParentMath running on your machine.

## Step 1: Get an Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-ant-...`)

## Step 2: Configure Your API Key

1. Open the `.env` file in the project root
2. Replace `your_api_key_here` with your actual API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

3. Save the file

## Step 3: Start the Development Server

Run this command in your terminal:

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

## Step 4: Test the App

Try it out with a simple math problem:

1. Click "I Need Help" (Parent Mode)
2. Click "Type It In"
3. Enter: `1/2 + 1/4`
4. Click "Get Teaching Guidance"
5. You should see comprehensive teaching guidance appear!

## Troubleshooting

### "API key not configured" Error

- Double-check your `.env` file has the correct key
- Make sure there are no extra spaces or quotes around the key
- Restart the dev server (`Ctrl+C` then `npm run dev` again)

### Port Already in Use

If port 3000 is already taken, Vite will automatically try the next available port (3001, 3002, etc.)

### Module Not Found Errors

Run `npm install` again to ensure all dependencies are installed.

## Next Steps

Once it's working:

- Test with different types of problems (fractions, word problems, etc.)
- Try the Photo Upload feature (works best with clear images)
- Switch to "My Kid Needs Help" mode to see kid-friendly explanations
- Share the app with other parents!

## Building for Production

When you're ready to deploy:

```bash
npm run build
```

The production files will be in the `dist` folder. You can deploy this to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

---

Need more help? Check out the main [README.md](README.md) for detailed documentation.
