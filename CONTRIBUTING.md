# Contributing to ParentMath

Thank you for your interest in improving this project! This document provides guidelines for contributing.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your Anthropic API key
4. Start dev server: `npm run dev`

## Project Philosophy

This app is designed to:
- **Help parents, not students** - We're coaching parents to teach, not doing homework for kids
- **Build confidence** - Use warm, supportive language
- **Be accessible** - Mobile-first, simple UX, no unnecessary features
- **Stay focused** - K-5 math only (no advanced topics in MVP)

## Code Style

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Include descriptive comments for complex logic
- Use meaningful variable names

Example:
```javascript
/**
 * ManualInput Component
 * Allows users to type in math problems manually
 */
const ManualInput = ({ mode, onSubmit, onBack }) => {
  // Component logic here
};
```

### CSS

- Mobile-first approach (base styles for mobile, media queries for larger screens)
- Use CSS variables defined in `index.css` for colors and spacing
- Keep component styles in separate CSS files
- Use semantic class names

### File Organization

```
src/
├── components/     # React components (one per view)
├── services/       # External API integrations
├── utils/          # Helper functions and utilities
├── App.jsx         # Main app router/state manager
└── index.css       # Global styles and variables
```

## Feature Requests

Before submitting a feature request, consider:

1. **Is it in scope?** This MVP focuses on K-5 math only
2. **Does it help parents teach?** Features should support the parent-as-coach model
3. **Is it simple?** We avoid complexity in favor of ease of use

### Features NOT in MVP Scope

These may be considered for future versions:

- User accounts/login
- Saved explanations
- Progress tracking
- Multiple languages
- Advanced math topics
- Teacher accounts
- Video explanations
- Community features

## Bug Reports

When reporting bugs, please include:

1. **Description** - What happened vs. what you expected
2. **Steps to reproduce** - Detailed steps to recreate the issue
3. **Screenshots** - If applicable
4. **Environment** - Browser, device, OS version
5. **Console errors** - Check browser DevTools console

Example bug report:

```
**Bug**: Photo upload fails on iPhone Safari

**Steps**:
1. Open app on iPhone 12, Safari
2. Select "Take a Photo"
3. Grant camera permission
4. Take photo
5. Click "Analyze Problem"

**Expected**: Should show analysis
**Actual**: Shows error "Failed to process image"

**Console error**: [paste error here]
```

## Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**:
   - Test on mobile and desktop
   - Test both Parent and Kid modes
   - Test both photo and text input
   - Test with various problem types
5. **Build successfully**: `npm run build`
6. **Commit with clear messages**: `git commit -m "Add feature: [description]"`
7. **Push to your fork**: `git push origin feature/your-feature-name`
8. **Open a Pull Request** with a clear description

### Pull Request Template

```markdown
## Description
[Describe what this PR does]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] UI improvement
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested on mobile
- [ ] Tested on desktop
- [ ] Tested both modes (Parent/Kid)
- [ ] Tested both input methods (Photo/Text)
- [ ] Build succeeds

## Screenshots
[If applicable]
```

## Improving AI Prompts

The quality of the app depends heavily on the system prompts sent to Claude. These are in `src/services/anthropicService.js`.

### Guidelines for Prompt Engineering

1. **Be specific** - Tell Claude exactly what format and content to include
2. **Use examples** - Show Claude what good output looks like
3. **Set the tone** - Specify warm, conversational language
4. **Define structure** - Request specific sections (e.g., "Common Questions")
5. **Test thoroughly** - Try edge cases (problems equal to zero, complex fractions, etc.)

### Testing Prompts

When modifying prompts:

1. Test with at least 10 different problem types:
   - Simple addition (5 + 3)
   - Problems equal to zero (5 - 5)
   - Fractions with like denominators (1/2 + 1/2)
   - Fractions with unlike denominators (1/2 + 1/4)
   - Multiplication (25 × 4)
   - Division (12 ÷ 3)
   - Word problems
   - Multi-step problems
   - Problems with diagrams (photo input)
   - Unusual spacing (1/2+1/4)

2. Verify output quality:
   - Is it warm and supportive?
   - Does it explain the "why" not just the "what"?
   - Are analogies age-appropriate?
   - Does it anticipate common questions?
   - Is the answer included naturally?

## Code Quality Checklist

Before submitting:

- [ ] Code is well-commented
- [ ] No console.log statements left in
- [ ] No hardcoded API keys
- [ ] Error handling is present
- [ ] Loading states are handled
- [ ] Mobile responsiveness maintained
- [ ] Accessibility considered (alt text, keyboard navigation)
- [ ] No unused imports or variables

## Testing Checklist

### Desktop Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (Mac)
- [ ] Edge

### Mobile Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Different screen sizes (phone, tablet)

### Functionality Testing
- [ ] Landing page → Mode selection works
- [ ] Photo upload works (take photo + choose from gallery)
- [ ] Text input works
- [ ] API returns valid responses
- [ ] Error states display correctly
- [ ] Loading spinners appear during API calls
- [ ] "Try Another Problem" resets state
- [ ] Back buttons work correctly

## Documentation

When adding features:

1. Update [README.md](README.md) with new functionality
2. Update [SETUP.md](SETUP.md) if setup process changes
3. Add inline code comments for complex logic
4. Update this file if contribution process changes

## Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull request comments
- Suggest improvements to these guidelines

---

Thank you for contributing to ParentMath! Together we're helping parents feel confident teaching their kids. 🎉
