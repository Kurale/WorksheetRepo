import { generateColumnMath } from './columnMath.js';
import { generateComparison } from './comparison.js';
import { generateDivision } from './division.js';
import { generateEquation } from './equation.js';
import { generateFraction } from './fraction.js';
import { generateMultiplication } from './multiplication.js';
import { generateWordProblem } from './wordProblem.js';

export const generatorRegistry = {
  column_add_sub: generateColumnMath,
  multiplication: generateMultiplication,
  division: generateDivision,
  comparison: generateComparison,
  equation: generateEquation,
  word_problem: generateWordProblem,
  fraction: generateFraction,
};
