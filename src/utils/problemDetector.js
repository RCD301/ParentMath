/**
 * Problem Detection Heuristic
 * Splits OCR text into individual math problems
 */

/**
 * Detects and splits text into individual math problems
 * @param {string} rawText - Raw OCR text from image
 * @returns {Array<{id: string, text: string, label: string}>} Array of detected problems
 */
export const detectProblems = (rawText) => {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  const lines = rawText.split('\n');
  const problems = [];
  let currentProblem = [];
  let problemCount = 0;

  // Patterns for numbered problems
  const numberPatterns = [
    /^\s*(\d+)\.\s+(.+)$/,           // "1. Problem text"
    /^\s*(\d+)\)\s+(.+)$/,           // "1) Problem text"
    /^\s*\((\d+)\)\s+(.+)$/,         // "(1) Problem text"
    /^\s*(\d+[a-z]?)\.\s+(.+)$/,    // "1a. Problem text" or "1. Problem text"
    /^\s*Problem\s+(\d+):?\s+(.+)$/i // "Problem 1: text"
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if this line starts a new numbered problem
    let isNumberedProblem = false;
    let problemNumber = null;
    let problemText = null;

    for (const pattern of numberPatterns) {
      const match = line.match(pattern);
      if (match) {
        isNumberedProblem = true;
        problemNumber = match[1];
        problemText = match[2];
        break;
      }
    }

    if (isNumberedProblem) {
      // Save previous problem if exists
      if (currentProblem.length > 0) {
        const text = currentProblem.join('\n').trim();
        if (text) {
          problemCount++;
          problems.push({
            id: `problem-${problemCount}`,
            text: text,
            label: `Problem ${problemCount}`
          });
        }
        currentProblem = [];
      }

      // Start new problem with the detected number
      currentProblem.push(problemText);
    } else if (trimmedLine === '') {
      // Blank line - potential separator
      // If we have accumulated text and next non-blank line exists, this might be a separator
      if (currentProblem.length > 0) {
        // Look ahead to see if there's more content
        let hasMoreContent = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim()) {
            hasMoreContent = true;
            break;
          }
        }

        // If there's more content and we've accumulated significant text, split here
        if (hasMoreContent && currentProblem.join('\n').trim().length > 5) {
          const text = currentProblem.join('\n').trim();
          problemCount++;
          problems.push({
            id: `problem-${problemCount}`,
            text: text,
            label: `Problem ${problemCount}`
          });
          currentProblem = [];
        }
      }
    } else {
      // Regular line - add to current problem
      currentProblem.push(line);
    }
  }

  // Don't forget the last problem
  if (currentProblem.length > 0) {
    const text = currentProblem.join('\n').trim();
    if (text) {
      problemCount++;
      problems.push({
        id: `problem-${problemCount}`,
        text: text,
        label: `Problem ${problemCount}`
      });
    }
  }

  // If no problems were detected using patterns, treat entire text as one problem
  if (problems.length === 0 && rawText.trim()) {
    return [{
      id: 'problem-1',
      text: rawText.trim(),
      label: 'Problem 1'
    }];
  }

  return problems;
};

/**
 * Validates if detected problems seem reasonable
 * @param {Array} problems - Array of detected problems
 * @returns {boolean} True if detection seems valid
 */
export const validateDetection = (problems) => {
  if (!problems || problems.length === 0) {
    return false;
  }

  // Check if problems have reasonable length (not too short)
  const hasValidLength = problems.every(p => p.text.length >= 3);

  // Check if we didn't over-split (too many tiny fragments)
  const hasReasonableCount = problems.length <= 20;

  return hasValidLength && hasReasonableCount;
};
