# ParentMath

**Tagline:** Homework help for parents, not kids

A mobile-first web app that translates modern elementary math problems into simple, parent-friendly teaching guidance. It's like having an elementary school teacher whispering in your ear, telling you exactly what to say and how to explain it to your child.

## Overview

ParentMath helps parents understand and explain their child's elementary math homework (grades K-5, ages 5-11). When parents encounter problems they don't understand or aren't sure how to explain, they can take a photo or type in the problem to get comprehensive teaching guidance.

### Features

- **Dual Input Methods**
  - 📸 Take a photo of homework
  - ✏️ Type in problems manually

- **Two Explanation Modes**
  - 👨‍🏫 **Parent Coach Mode**: Step-by-step guidance on how to teach the concept
  - 👧 **Kid-Friendly Mode**: Child-friendly explanations to read together

- **Smart Analysis**
  - Handles all spacing variations (1/2+1/2, 1/2 + 1/2, etc.)
  - Works with problems that equal zero (1-1, 5-5)
  - Recognizes fractions, multiplication, division, word problems
  - Provides real-world analogies and teaching strategies

- **Teaching-Focused Output**
  - Not just answers - full pedagogical guidance
  - Concrete examples using pizza, toys, cookies, etc.
  - Conversational, warm, confidence-building tone
  - Common misconceptions and how to address them

## Technology Stack

- **Frontend**: React 18 with Vite
- **AI**: Claude Sonnet 4 via Anthropic API
- **Image Processing**: Canvas-based compression and base64 encoding
- **Styling**: Custom CSS with mobile-first responsive design
- **Deployment**: Static site (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone or download this repository**

```bash
cd ParentMath
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up your API key**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

> **Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

4. **Start the development server**

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder. You can preview it with:

```bash
npm run preview
```

## Project Structure

```
ParentMath/
├── src/
│   ├── components/          # React components
│   │   ├── Landing.jsx      # Landing page (mode selection)
│   │   ├── InputMethod.jsx  # Choose photo or text input
│   │   ├── PhotoInput.jsx   # Photo upload interface
│   │   ├── ManualInput.jsx  # Text input interface
│   │   └── Results.jsx      # Display teaching guidance
│   ├── services/
│   │   └── anthropicService.js  # API integration
│   ├── utils/
│   │   └── imageProcessor.js    # Image compression utilities
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## User Flow

1. **Landing**: Choose between "I Need Help" (Parent Mode) or "My Kid Needs Help" (Kid Mode)
2. **Input Method**: Select "Take a Photo" or "Type It In"
3. **Submit Problem**: Upload image or enter text
4. **Get Guidance**: Receive comprehensive teaching guidance
5. **Try Another**: Reset to try another problem

## API Usage

This app uses the Anthropic API with Claude Sonnet 4. The API is called client-side using the `dangerouslyAllowBrowser` flag, which is acceptable for an MVP or personal use.

### For Production Deployment

For a production app with multiple users, you should:

1. **Create a backend proxy** to keep your API key secure
2. **Implement rate limiting** to prevent abuse
3. **Add user authentication** if needed
4. **Monitor API usage** and costs

Example backend proxy endpoint:

```javascript
// server.js (Node.js/Express example)
app.post('/api/analyze', async (req, res) => {
  const { problemData, mode } = req.body;

  // Call Anthropic API server-side
  const result = await anthropicClient.messages.create({
    // ... API call
  });

  res.json({ result });
});
```

## Supported Math Topics

- Addition and subtraction (single/multi-digit)
- Multiplication and division (basic facts and algorithms)
- Fractions (addition, subtraction, comparison)
- Word problems
- Place value
- Common Core math methods
- Visual/diagram-based problems

## Troubleshooting

### API Key Issues

If you see "API key not configured":
- Check that your `.env` file exists
- Verify `VITE_ANTHROPIC_API_KEY` is set correctly
- Restart the dev server after changing `.env`

### Image Upload Issues

If photos aren't working:
- Try using manual text input instead (more reliable)
- Ensure the image is under 10MB
- Check that the image format is JPG, PNG, or WebP
- Make sure the problem is clearly visible and well-lit

### Mobile Camera Access

If camera doesn't open on mobile:
- Grant camera permissions when prompted
- Try using HTTPS (camera requires secure context)
- Use "Choose from Gallery" as an alternative

## Future Enhancements (Not in MVP)

- User accounts and saved explanations
- Progress tracking
- Multiple languages
- Advanced math (algebra, geometry)
- Teacher/classroom version
- Offline mode
- Voice input
- Video explanations

## Contributing

This is an MVP project. Feedback and suggestions are welcome!

## License

MIT License - Feel free to use and modify for your needs.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the Anthropic API documentation
- Ensure all dependencies are properly installed

## Acknowledgments

- Built with React and Vite
- Powered by Claude Sonnet 4 (Anthropic)
- Designed for parents of elementary school children

---

**Made with ❤️ for parents who want to help their kids with homework**

Stripe checkout wired up