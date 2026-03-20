import { getRandomElement, getRandomInt } from '../utils/random.js';

const UNIT_DEFINITIONS = [
  { label: 'мм', multiplier: 1 },
  { label: 'см', multiplier: 10 },
  { label: 'дм', multiplier: 100 },
  { label: 'м', multiplier: 1000 },
];

function getComparisonSign(left, right) {
  if (left > right) return '>';
  if (left < right) return '<';
  return '=';
}

export function generateComparison() {
  const variant = getRandomElement(['math', 'units']);

  if (variant === 'math') {
    const a = getRandomInt(10, 50);
    const b = getRandomInt(2, 9);
    const c = getRandomInt(10, 50);
    const d = getRandomInt(2, 9);
    const answer = getComparisonSign(a + b, c + d);

    return {
      type: 'comparison',
      answer,
      html: `<div class="comparison-row">${a} + ${b} <span class="box" data-answer="${answer}"></span> ${c} + ${d}</div>`,
    };
  }

  const leftUnit = getRandomElement(UNIT_DEFINITIONS);
  const rightUnit = getRandomElement(UNIT_DEFINITIONS);
  const leftValue = getRandomInt(1, 100);
  const rightValue = getRandomInt(1, 100);
  const answer = getComparisonSign(leftValue * leftUnit.multiplier, rightValue * rightUnit.multiplier);

  return {
    type: 'comparison',
    answer,
    html: `<div class="comparison-row">${leftValue} ${leftUnit.label} <span class="box" data-answer="${answer}"></span> ${rightValue} ${rightUnit.label}</div>`,
  };
}
