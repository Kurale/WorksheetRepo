import { getRandomInt } from '../utils/random.js';

export function generateLongDivision() {
  const divisor = getRandomInt(2, 9);
  const quotient = getRandomInt(12, 99);
  const dividend = divisor * quotient;

  return {
    type: 'long_division',
    answer: quotient,
    html: `
      <div class="division-problem">
        <div class="division-header">
          <span class="division-dividend-number">${dividend}</span>
          <span class="division-bracket-head"></span>
          <span class="division-quotient-number">${quotient}</span>
        </div>
        <div class="division-body">
          <span class="division-divisor-number">${divisor}</span>
          <span class="division-bracket-stem"></span>
          <span class="division-solution-space"></span>
        </div>
        <div class="answer-text compact-answer">${quotient}</div>
      </div>
    `,
  };
}
