import { getRandomInt } from '../utils/random.js';

function toDigitCells(value) {
  return String(value)
    .split('')
    .map((digit) => `<span class="digit-cell">${digit}</span>`)
    .join('');
}

function getPartialProducts(multiplicand, multiplier) {
  return String(multiplier)
    .split('')
    .reverse()
    .map((digit, index) => ({
      value: multiplicand * Number(digit),
      shift: index,
    }));
}

export function generateLongMultiplication() {
  const multiplicand = getRandomInt(120, 999);
  const multiplier = getRandomInt(12, 99);
  const partials = getPartialProducts(multiplicand, multiplier);
  const answer = multiplicand * multiplier;

  const partialMarkup = partials
    .map(({ value, shift }) => `
      <div class="digits-grid digits-grid--partial" style="--digit-shift:${shift};">
        ${toDigitCells(value)}
      </div>
    `)
    .join('');

  return {
    type: 'long_multiplication',
    answer,
    html: `
      <div class="compact-problem compact-problem--algorithm">
        <div class="digits-grid">${toDigitCells(multiplicand)}</div>
        <div class="digits-grid digits-grid--line"><span class="operator-glyph">×</span>${toDigitCells(multiplier)}</div>
        ${partialMarkup}
        <div class="digits-grid digits-grid--result solution-space"></div>
        <div class="answer-text compact-answer">${answer}</div>
      </div>
    `,
  };
}
