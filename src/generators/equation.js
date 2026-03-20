import { getRandomElement, getRandomInt } from '../utils/random.js';

export function generateEquation() {
  const operator = getRandomElement(['+', '-', '*', ':']);
  let equation;
  let answer;

  switch (operator) {
    case '+': {
      answer = getRandomInt(10, 100);
      const known = getRandomInt(10, 100);
      equation = `y + ${known} = ${answer + known}`;
      break;
    }
    case '-': {
      answer = getRandomInt(20, 90);
      const known = getRandomInt(5, 30);
      equation = `y - ${known} = ${answer - known}`;
      break;
    }
    case '*': {
      answer = getRandomInt(2, 12);
      const known = getRandomInt(2, 10);
      equation = `y · ${known} = ${answer * known}`;
      break;
    }
    default: {
      answer = getRandomInt(2, 12);
      const known = getRandomInt(2, 10);
      equation = `${answer * known} : y = ${known}`;
      break;
    }
  }

  return {
    type: 'equation',
    answer,
    html: `
      <div class="equation-task">
        <div>${equation}</div>
        <div>y = <span class="answer-text">${answer}</span></div>
      </div>
    `,
  };
}
