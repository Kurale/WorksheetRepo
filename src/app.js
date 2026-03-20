import { DAYS, WORKSHEET_CONFIG } from './config.js';
import { generatorRegistry } from './generators/index.js';
import { getRandomElement } from './utils/random.js';

class WorksheetApp {
  constructor({ gridElement, answersButton }) {
    this.gridElement = gridElement;
    this.answersButton = answersButton;
    this.currentWorksheetData = [];
  }

  init() {
    this.bindControls();
    this.renderWorksheet();
  }

  bindControls() {
    document.querySelector('[data-action="generate"]').addEventListener('click', () => this.renderWorksheet());
    document.querySelector('[data-action="print"]').addEventListener('click', () => window.print());
    document.querySelector('[data-action="answers"]').addEventListener('click', () => this.toggleAnswers());
    document.querySelector('[data-action="export"]').addEventListener('click', () => this.exportJSON());
  }

  renderWorksheet() {
    this.gridElement.replaceChildren();
    this.currentWorksheetData = DAYS.map((day) => this.createDayRow(day));
    document.body.classList.remove('show-answers');
    this.answersButton.textContent = 'Показать ответы';
    this.answersButton.classList.remove('btn-primary');
  }

  createDayRow(day) {
    const row = document.createElement('div');
    row.className = 'day-row';

    const label = document.createElement('div');
    label.className = 'day-label';
    label.textContent = day;
    row.append(label);

    const tasks = [];

    for (let index = 0; index < WORKSHEET_CONFIG.tasksPerDay; index += 1) {
      const task = this.createTask(index + 1);
      tasks.push(task.data);
      row.append(task.element);
    }

    this.gridElement.append(row);

    return { day, tasks };
  }

  createTask(taskNumber) {
    const type = taskNumber === 1 ? WORKSHEET_CONFIG.forcedFirstTaskType : getRandomElement(WORKSHEET_CONFIG.weightedTaskPool);
    const taskDefinition = generatorRegistry[type]();

    const cell = document.createElement('div');
    cell.className = 'task-cell';

    const numberBadge = document.createElement('div');
    numberBadge.className = 'task-number';
    numberBadge.textContent = String(taskNumber);
    cell.append(numberBadge);

    const stack = document.createElement('div');
    stack.className = 'task-stack';
    stack.insertAdjacentHTML('beforeend', taskDefinition.html);

    if (taskDefinition.duplicate) {
      stack.insertAdjacentHTML('beforeend', taskDefinition.html);
    }

    cell.append(stack);

    return {
      element: cell,
      data: {
        type: taskDefinition.type,
        answer: taskDefinition.answer,
        html: taskDefinition.html.trim(),
      },
    };
  }

  toggleAnswers() {
    document.body.classList.toggle('show-answers');
    const hasAnswers = document.body.classList.contains('show-answers');
    this.answersButton.textContent = hasAnswers ? 'Скрыть ответы' : 'Показать ответы';
    this.answersButton.classList.toggle('btn-primary', hasAnswers);
  }

  exportJSON() {
    const data = JSON.stringify(this.currentWorksheetData, null, 2);
    const url = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'worksheet.json';
    document.body.append(link);
    link.click();
    link.remove();
  }
}

const app = new WorksheetApp({
  gridElement: document.getElementById('grid'),
  answersButton: document.querySelector('[data-answers-toggle]'),
});

window.addEventListener('DOMContentLoaded', () => app.init());
