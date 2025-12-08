/**
 * GEORGIA BIOLOGY MONITOR - PSYCHOMETRIC ENGINE
 * Implements 3-Parameter Logistic (3-PL) IRT Model for Adaptive Testing
 */

// 1. Probability Function (3-PL Model)
// Calculates the probability P of a correct response given theta (ability)
export function calculateProbability(theta: number, b: number, a: number = 1, c: number = 0): number {
  const e = Math.exp(a * (theta - b));
  return c + (1 - c) * (e / (1 + e));
}

// 2. Fisher Information Function
// Determines how much "information" an item provides at a specific ability level.
// CAT uses this to select the "best" next item (Max Info).
export function calculateInformation(theta: number, b: number, a: number = 1, c: number = 0): number {
  const P = calculateProbability(theta, b, a, c);
  const Q = 1 - P;
  return (a * a * Q * (P - c) * (P - c)) / (P * (1 - c) * (1 - c));
}

// 3. Theta Estimation (simplified EAP/Bayesian update)
// Updates the student's ability estimate after a response.
// For real-time CAT, we use a simplified iterative update.
export function updateTheta(
  currentTheta: number,
  itemDifficulty: number,
  itemDiscrimination: number,
  isCorrect: boolean
): number {
  const learningRate = 0.5; // Controls how aggressively the score moves
  const probability = calculateProbability(currentTheta, itemDifficulty, itemDiscrimination);
  
  // If correct, score goes up based on how hard the question was.
  // If wrong, score goes down based on how easy the question was.
  const direction = isCorrect ? 1 : -1;
  const surpriseFactor = isCorrect ? (1 - probability) : probability;
  
  // Calculate new Theta
  let newTheta = currentTheta + (direction * surpriseFactor * learningRate);
  
  // Clamp Theta to realistic bounds (-3.0 to +3.0 is standard for IRT)
  return Math.max(-3.0, Math.min(3.0, newTheta));
}
