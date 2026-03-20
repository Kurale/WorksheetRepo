import { generateColumnMath } from './columnMath.js';
import { generateComparison } from './comparison.js';
import { generateEquation } from './equation.js';
import { generateFraction } from './fraction.js';
import { generateLongDivision } from './longDivision.js';
import { generateLongMultiplication } from './longMultiplication.js';
import { generateWordProblem } from './wordProblem.js';

export const generatorRegistry = {
  column_add_sub: generateColumnMath,
  long_multiplication: generateLongMultiplication,
  long_division: generateLongDivision,
  comparison: generateComparison,
  equation: generateEquation,
  word_problem: generateWordProblem,
  fraction: generateFraction,
};
