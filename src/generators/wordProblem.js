import { getRandomInt } from '../utils/random.js';

export function generateWordProblem() {
  let first = getRandomInt(20, 90);
  const second = getRandomInt(10, 50);
  const divider = getRandomInt(2, 5);

  first -= (first + second) % divider;

  return {
    type: 'word_problem',
    answer: (first + second) / divider,
    html: `
      <div class="word-problem">
        Сумму чисел ${first} и ${second} уменьши в ${divider} раз.
        <br /><br />
        <span class="answer-text">Ответ: ${(first + second) / divider}</span>
      </div>
    `,
  };
}
