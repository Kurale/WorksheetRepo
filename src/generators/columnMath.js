import { getRandomInt } from '../utils/random.js';

export function generateColumnMath() {
  const isAddition = Math.random() > 0.5;
  const first = getRandomInt(100, 9999);
  const second = getRandomInt(10, first);
  const answer = isAddition ? first + second : first - second;
  const operator = isAddition ? '+' : '-';

  return {
    type: 'column_math',
    answer,
    duplicate: true,
    html: `
      <div class="math-column">
        <div>${first}</div>
        <div class="line"><span class="operator">${operator}</span>${second}</div>
        <div class="answer-text">${answer}</div>
      </div>
    `,
  };
}
