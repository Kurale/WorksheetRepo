import { generateColumnMath } from './columnMath.js';
import { generateComparison } from './comparison.js';
import { generateEquation } from './equation.js';
import { generateFraction } from './fraction.js';
import { generateWordProblem } from './wordProblem.js';

export const generatorRegistry = {
  column_math: generateColumnMath,
  comparison: generateComparison,
  equation: generateEquation,
  word_problem: generateWordProblem,
  fraction: generateFraction,
};
