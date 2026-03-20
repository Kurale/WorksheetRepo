import { getRandomElement, getRandomInt } from '../utils/random.js';

function createSliceMarkup(parts, filled) {
  const angle = 360 / parts;

  return Array.from({ length: parts }, (_, index) => {
    const isFilled = index < filled;
    const stroke = isFilled ? '#f472b6' : '#ffffff';
    const dash = (angle / 360) * 157;

    return `
      <circle r="25" cx="50" cy="50" fill="none" stroke="${stroke}" stroke-width="50" stroke-dasharray="${dash} 157" transform="rotate(${index * angle - 90} 50 50)" />
      <line x1="50" y1="50" x2="50" y2="0" stroke="#333" stroke-width="1" transform="rotate(${index * angle} 50 50)" />
    `;
  }).join('');
}

export function generateFraction() {
  const parts = getRandomElement([3, 4, 5, 6, 8]);
  const filled = getRandomInt(1, parts - 1);

  return {
    type: 'fraction',
    answer: `${filled}/${parts}`,
    html: `
      <div class="fraction-task">
        <svg width="60" height="60" viewBox="0 0 100 100" style="border-radius: 50%; border: 2px solid #333; background: #fff;">
          ${createSliceMarkup(parts, filled)}
        </svg>
        <div class="fraction-answer">
          <span class="answer-text fraction-line">${filled}</span>
          <span class="answer-text">${parts}</span>
          <span class="fraction-placeholder">&nbsp;</span>
        </div>
      </div>
    `,
  };
}
