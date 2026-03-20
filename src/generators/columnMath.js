import { getRandomInt } from '../utils/random.js';

function buildColumnExample(first, second, operator, answer) {
  return `
    <div class="column-example">
      <div class="column-line">${first}</div>
      <div class="column-line column-line--underline"><span class="column-operator">${operator}</span>${second}</div>
      <div class="column-line column-line--answer answer-text">${answer}</div>
    </div>
  `;
}

export function generateColumnMath() {
  const isAddition = Math.random() > 0.45;
  const first = getRandomInt(100, 999);
  const second = isAddition ? getRandomInt(10, 999) : getRandomInt(10, first - 1);
  const answer = isAddition ? first + second : first - second;

  return {
    type: 'column_add_sub',
    answer,
    html: buildColumnExample(first, second, isAddition ? '+' : '−', answer),
  };
}
