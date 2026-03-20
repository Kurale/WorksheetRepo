import { getRandomInt } from '../utils/random.js';

function buildDigitsMarkup(value) {
  return String(value)
    .split('')
    .map((digit) => `<span class="digit-cell">${digit}</span>`)
    .join('');
}

function buildCompactColumn(first, second, operator, answer) {
  return `
    <div class="column-problem">
      <div class="column-row column-row--top">${buildDigitsMarkup(first)}</div>
      <div class="column-row column-row--underline">
        <span class="column-operator">${operator}</span>
        ${buildDigitsMarkup(second)}
      </div>
      <div class="column-solution-space"></div>
      <div class="answer-text compact-answer">${answer}</div>
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
    html: buildCompactColumn(first, second, isAddition ? '+' : '−', answer),
  };
}
