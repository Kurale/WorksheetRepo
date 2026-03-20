import { getRandomInt } from '../utils/random.js';

export function generateDivision() {
  const examples = Array.from({ length: 4 }, () => {
    const divisor = getRandomInt(2, 9);
    const quotient = getRandomInt(2, 20);
    const dividend = divisor * quotient;
    return {
      expression: `${dividend} : ${divisor} =`,
      answer: quotient,
    };
  });

  return {
    type: 'division',
    answer: examples.map((item) => item.answer),
    html: `
      <div class="list-task">
        ${examples.map((item) => `<div class="list-row">${item.expression} <span class="answer-text">${item.answer}</span></div>`).join('')}
      </div>
    `,
  };
}
