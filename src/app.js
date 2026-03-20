import { DAYS, TASK_TYPES, WORKSHEET_CONFIG } from './config.js';
import { generatorRegistry } from './generators/index.js';
import { getRandomElement } from './utils/random.js';

/** @typedef {{type: string, answer: string|number, html: string}} TaskDefinition */

class WorksheetApp {
  constructor({ gridElement, answersButton, filtersForm }) {
    this.gridElement = gridElement;
    this.answersButton = answersButton;
    this.filtersForm = filtersForm;
    this.currentWorksheetData = [];
    this.enabledTaskTypes = new Set(WORKSHEET_CONFIG.defaultEnabledTaskTypes);
  }

  init() {
    this.renderTaskFilters();
    this.bindControls();
    this.renderWorksheet();
  }

  bindControls() {
    document.querySelector('[data-action="generate"]').addEventListener('click', () => this.renderWorksheet());
    document.querySelector('[data-action="print"]').addEventListener('click', () => window.print());
    document.querySelector('[data-action="answers"]').addEventListener('click', () => this.toggleAnswers());
    document.querySelector('[data-action="export"]').addEventListener('click', () => this.exportJSON());
    this.filtersForm.addEventListener('change', (event) => this.handleFilterChange(event));
  }

  renderTaskFilters() {
    const fragment = document.createDocumentFragment();

    Object.values(TASK_TYPES).forEach((taskType) => {
      const label = document.createElement('label');
      label.className = 'task-filter';
      label.innerHTML = `
        <input type="checkbox" name="taskType" value="${taskType.id}" checked />
        <span>${taskType.label}</span>
      `;
      fragment.append(label);
    });

    this.filtersForm.replaceChildren(fragment);
  }

  handleFilterChange(event) {
    if (event.target.name !== 'taskType') {
      return;
    }

    const { value, checked } = event.target;

    if (checked) {
      this.enabledTaskTypes.add(value);
    } else if (this.enabledTaskTypes.size > 1) {
      this.enabledTaskTypes.delete(value);
    } else {
      event.target.checked = true;
      return;
    }

    this.renderWorksheet();
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
    const type = taskNumber === 1 && this.enabledTaskTypes.has(WORKSHEET_CONFIG.forcedFirstTaskType)
      ? WORKSHEET_CONFIG.forcedFirstTaskType
      : this.getRandomEnabledTaskType();
    const taskDefinition = generatorRegistry[type]();
    const duplicateCount = TASK_TYPES[type].duplicateCount;

    const cell = document.createElement('div');
    cell.className = 'task-cell';

    const numberBadge = document.createElement('div');
    numberBadge.className = 'task-number';
    numberBadge.textContent = String(taskNumber);
    cell.append(numberBadge);

    const stack = document.createElement('div');
    stack.className = 'task-stack';

    for (let index = 0; index < duplicateCount; index += 1) {
      const renderedTask = index === 0 ? taskDefinition : generatorRegistry[type]();
      stack.insertAdjacentHTML('beforeend', renderedTask.html);
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

  getRandomEnabledTaskType() {
    const weightedPool = Object.values(TASK_TYPES)
      .filter(({ id }) => this.enabledTaskTypes.has(id))
      .flatMap(({ id, weight }) => Array.from({ length: weight }, () => id));

    return getRandomElement(weightedPool);
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
  filtersForm: document.querySelector('[data-task-filters]'),
});

window.addEventListener('DOMContentLoaded', () => app.init());
