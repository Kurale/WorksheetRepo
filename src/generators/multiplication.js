import { getRandomInt } from '../utils/random.js';

export function generateMultiplication() {
  const examples = Array.from({ length: 4 }, () => {
    const left = getRandomInt(11, 99);
    const right = getRandomInt(2, 9);
    return {
      expression: `${left} · ${right} =`,
      answer: left * right,
    };
  });

  return {
    type: 'multiplication',
    answer: examples.map((item) => item.answer),
    html: `
      <div class="list-task">
        ${examples.map((item) => `<div class="list-row">${item.expression} <span class="answer-text">${item.answer}</span></div>`).join('')}
      </div>
    `,
  };
}
