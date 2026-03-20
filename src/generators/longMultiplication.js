import { getRandomInt } from '../utils/random.js';

function buildDigitsMarkup(value) {
  return String(value)
    .split('')
    .map((digit) => `<span class="digit-cell">${digit}</span>`)
    .join('');
}

export function generateLongMultiplication() {
  const multiplicand = getRandomInt(108, 987);
  const multiplier = getRandomInt(2, 9);
  const answer = multiplicand * multiplier;

  return {
    type: 'long_multiplication',
    answer,
    html: `
      <div class="multiply-problem">
        <div class="multiply-grid">
          <div class="multiply-row multiply-row--top">
            <span class="multiply-symbol">×</span>
            ${buildDigitsMarkup(multiplicand)}
          </div>
          <div class="multiply-row multiply-row--underline">
            <span class="multiply-symbol">&nbsp;</span>
            ${buildDigitsMarkup(multiplier)}
          </div>
          <div class="multiply-workarea"></div>
        </div>
        <div class="answer-text compact-answer">${answer}</div>
      </div>
    `,
  };
}
