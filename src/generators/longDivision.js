import { getRandomInt } from '../utils/random.js';

export function generateLongDivision() {
  const divisor = getRandomInt(2, 9);
  const quotient = getRandomInt(12, 99);
  const dividend = divisor * quotient;

  return {
    type: 'long_division',
    answer: quotient,
    html: `
      <div class="compact-problem compact-problem--division">
        <div class="division-layout">
          <div class="division-divisor">${divisor}</div>
          <div class="division-bracket">
            <div class="division-quotient solution-space"></div>
            <div class="division-dividend">${dividend}</div>
          </div>
        </div>
        <div class="division-workline solution-space"></div>
        <div class="answer-text compact-answer">Частное: ${quotient}</div>
      </div>
    `,
  };
}
