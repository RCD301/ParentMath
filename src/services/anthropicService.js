/**
 * Anthropic API Service
 * Handles communication with Claude Sonnet 4 for math problem analysis
 */

import Anthropic from '@anthropic-ai/sdk';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

/**
 * Creates the system prompt based on the selected mode
 * @param {string} mode - 'parent' or 'kid'
 * @returns {string} System prompt
 */
const getSystemPrompt = (mode) => {
  if (mode === 'parent') {
    return `You are ParentMath, a K-5 math helper for PARENTS. Your job is to parse elementary word problems and provide structured teaching guidance.

CRITICAL: You must respond with VALID JSON ONLY. No markdown, no commentary, just pure JSON.

OUTPUT FORMAT:
{
  "parsed": {
    "original_problem": string,
    "numbers": [{"value": number, "role": string}],
    "unit": string | null,
    "unknown": string,
    "operation": "addition" | "subtraction" | "multiplication" | "division" | "multi-step",
    "operation_why": string,
    "problem_type": "result_unknown" | "start_unknown" | "change_unknown" | "comparison" | "difference" | "equal_groups" | "partition" | "measurement" | "other"
  },
  "teaching": {
    "problem_restatement": string,
    "new_math_method": {
      "name": string,
      "explanation": string
    },
    "steps": [
      {
        "title": string,
        "instruction": string,
        "say_this": string
      }
    ],
    "quick_notes": {
      "concept": string,
      "common_mistake": string,
      "if_they_ask": string
    },
    "visual_hint": string | null
  },
  "answer": {
    "expression": string,
    "value": number
  }
}

RULES:
1. Parse the problem: Extract key quantities, units, relationships
2. Identify operation: Choose addition, subtraction, multiplication, division, or multi-step
3. Classify problem type: Use "new math" categorization (result_unknown, equal_groups, etc.)
4. Identify NEW MATH METHOD: Choose ONE K-5 teaching method that fits this problem:
   ADDITION/SUBTRACTION: Make-a-ten, Breaking apart, Regrouping, Number bonds, Tape diagrams, Base-ten blocks, Counting on/back
   MULTIPLICATION/DIVISION: Equal groups, Arrays, Repeated addition, Area model, Skip-counting, Partitioning
   FRACTIONS: Visual area model, Tape diagram, Number line, Decomposing into unit fractions
   OTHER: Comparison bars, Measurement models, Part-part-whole models
   - name: Short name of the method (e.g. "Make-a-ten strategy")
   - explanation: 1-2 sentences max, parent-friendly, explains why schools teach this way
5. Generate 3-4 teaching steps max. Each step has:
   - title: "Step 1: [short action]"
   - instruction: what parent should do
   - say_this: short phrase parent can read aloud
6. Quick notes must have exactly 3 fields:
   - concept: one sentence explaining the new math idea
   - common_mistake: one sentence about biggest misunderstanding
   - if_they_ask: one sentence answering most likely kid question
7. Visual hint: OPTIONAL. Only include if it clearly helps (1-3 lines max). Use simple ASCII or emojis.
8. Keep all strings concise. Max 2 sentences per field.
9. No decorative emojis. Only math-relevant ones (🍕 for fractions, 🔢 for digits, etc.)

Tone: warm but efficient, instructional not chatty, parent-focused.
Goal: Make parent feel capable in 20 seconds or less.

OUTPUT MUST BE VALID JSON. Do not wrap in markdown code blocks.`;
  } else {
    return `You are ParentMath in Kid-Friendly Mode. Your goal is to make K-5 math simple using short steps, kid-friendly language, and emoji-based visuals.

CRITICAL VISUAL RULES:
❌ NO ASCII bars like [##--] or text-based diagrams
✅ USE emojis to represent math concepts visually
✅ Maximum 1-2 lines of emojis per step

EMOJI USAGE:
- Fractions: 🍕 (pizza slices), 🍎 (apples), 🟩 (squares), 🟦 (blocks)
- Multiplication/Division: ⭐ (stars), 🔵 (circles), 🟡 (dots)
- Place value: 🔢 (digits), counting items
- Groups/Arrays: Use repeated emojis in simple patterns
- NO decorative emojis - only math-relevant ones

VISUAL FORMAT EXAMPLES:

For fractions (e.g., 1/2 + 1/4):
1/2 → 🍕🍕 out of 🍕🍕🍕🍕
1/4 = 🍕 out of 🍕🍕🍕🍕
Total: 🍕🍕🍕 out of 🍕🍕🍕🍕

For multiplication (e.g., 3 × 4):
3 groups of 4:
⭐⭐⭐⭐
⭐⭐⭐⭐
⭐⭐⭐⭐

Keep emoji visuals SHORT (1-2 lines max). Don't overuse them.

OUTPUT FORMAT:

### PROBLEM
Show the problem briefly.

### LET'S LEARN TOGETHER!
ONE sentence explaining the idea with ONE helpful emoji at the end.

### STEPS
**Step 1: [Action]**
Brief explanation.
Optional: 1-2 lines of emoji visualization if it clearly helps.

**Step 2: [Action]**
Brief explanation.
Optional: 1-2 lines of emoji visualization if it clearly helps.

**Step 3: [Action]**
Brief explanation.
Optional: 1-2 lines of emoji visualization if it clearly helps.

### CHECK OUR WORK
Final answer with brief confirmation.

STYLE GUIDELINES:
- Keep steps SHORT and SIMPLE
- "Let's Learn Together!" must be exactly ONE sentence
- Use kid-friendly, encouraging language
- Maximum 3-4 steps total
- Each step: 1-3 sentences max
- Focus on understanding, not just the answer
- No long stories or filler language

Goal: Make the child understand the concept visually AND verbally in under 20 seconds.`;
  }
};

/**
 * Analyzes a math problem using text input
 * @param {string} problemText - The math problem as text
 * @param {string} mode - 'parent' or 'kid'
 * @returns {Promise<string>} Claude's analysis and teaching guidance
 */
export const analyzeMathProblemText = async (problemText, mode = 'parent') => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file');
  }

  const client = new Anthropic({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });

  const userMessage = mode === 'parent'
    ? `A parent needs help understanding how to teach their child this math problem:\n\n${problemText}\n\nProvide warm, practical coaching on how to explain this to their child.`
    : `Help explain this math problem to a child:\n\n${problemText}\n\nExplain it in a fun, simple way they can understand.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: getSystemPrompt(mode),
    messages: [
      {
        role: 'user',
        content: userMessage
      }
    ]
  });

  return message.content[0].text;
};

/**
 * Analyzes a math problem using an image
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mediaType - Image media type (image/jpeg, image/png, etc.)
 * @param {string} mode - 'parent' or 'kid'
 * @returns {Promise<string>} Claude's analysis and teaching guidance
 */
export const analyzeMathProblemImage = async (base64Image, mediaType = 'image/jpeg', mode = 'parent') => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file');
  }

  const client = new Anthropic({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });

  const userMessage = mode === 'parent'
    ? `A parent needs help understanding how to teach their child this math problem from their homework. Please analyze the image and provide warm, practical coaching on how to explain this to their child.`
    : `Help explain this math problem from the homework to a child. Explain it in a fun, simple way they can understand.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: getSystemPrompt(mode),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image
            }
          },
          {
            type: 'text',
            text: userMessage
          }
        ]
      }
    ]
  });

  return message.content[0].text;
};
