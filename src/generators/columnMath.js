import { getRandomInt } from '../utils/random.js';

function padNumber(value, width) {
  return String(value).padStart(width, ' ');
}

function buildCompactColumn(first, second, operator, answer) {
  const width = Math.max(String(first).length, String(second).length + 1, String(answer).length);

  return `
    <div class="compact-problem compact-problem--column">
      <div class="digits-row">${padNumber(first, width).replace(/ /g, '&nbsp;')}</div>
      <div class="digits-row digits-row--line"><span class="operator-glyph">${operator}</span>${padNumber(second, width - 1).replace(/ /g, '&nbsp;')}</div>
      <div class="solution-space"></div>
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
