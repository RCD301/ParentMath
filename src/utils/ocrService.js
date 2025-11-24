/**
 * OCR Service using Claude Vision API
 * Extracts text from images of math worksheets
 */

import Anthropic from '@anthropic-ai/sdk';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

/**
 * Extracts text from an image using Claude Vision API
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mediaType - Image media type (image/jpeg, image/png, etc.)
 * @returns {Promise<string>} Extracted text from the image
 */
export const extractTextFromImage = async (base64Image, mediaType = 'image/jpeg') => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file');
  }

  const client = new Anthropic({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
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
              text: `Extract all text from this image. This is a math worksheet with one or more problems.

INSTRUCTIONS:
- Return ONLY the text you see, exactly as it appears
- Preserve line breaks and spacing
- Include problem numbers if present (1., 2., etc.)
- Do not add any commentary or explanations
- Do not solve the problems
- If you see multiple problems, keep them separated as they appear on the page

Return the raw text only.`
            }
          ]
        }
      ]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image. Please try again.');
  }
};
