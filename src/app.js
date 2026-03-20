import { DAYS, TASK_TYPES, WORKSHEET_CONFIG } from './config.js';
import { generatorRegistry } from './generators/index.js';
import { getRandomElement, shuffleArray } from './utils/random.js';

class WorksheetApp {
  constructor({ gridElement, answersButton, filtersForm }) {
    this.gridElement = gridElement;
    this.answersButton = answersButton;
    this.filtersForm = filtersForm;
    this.currentWorksheetData = [];
    this.enabledTaskTypes = new Set(WORKSHEET_CONFIG.defaultEnabledTaskTypes);
    this.taskPlan = [];
    this.taskCursor = 0;
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
    this.filtersForm.replaceChildren();

    Object.values(TASK_TYPES).forEach((taskType) => {
      const label = document.createElement('label');
      label.className = 'filter-chip';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'taskType';
      input.value = taskType.id;
      input.checked = this.enabledTaskTypes.has(taskType.id);

      const text = document.createElement('span');
      text.textContent = taskType.label;

      label.append(input, text);
      this.filtersForm.append(label);
    });
  }

  handleFilterChange(event) {
    const input = event.target;

    if (!(input instanceof HTMLInputElement) || input.name !== 'taskType') {
      return;
    }

    if (input.checked) {
      this.enabledTaskTypes.add(input.value);
    } else if (this.enabledTaskTypes.size > 1) {
      this.enabledTaskTypes.delete(input.value);
    } else {
      input.checked = true;
      return;
    }

    this.renderWorksheet();
  }

  renderWorksheet() {
    this.gridElement.replaceChildren();
    this.prepareTaskPlan();
    this.currentWorksheetData = DAYS.map((day) => this.createDayRow(day));
    document.body.classList.remove('show-answers');
    this.answersButton.textContent = 'Показать ответы';
    this.answersButton.classList.remove('btn-primary');
  }

  prepareTaskPlan() {
    const totalTasks = DAYS.length * WORKSHEET_CONFIG.tasksPerDay;
    const enabledTypes = [...this.enabledTaskTypes];
    const forcedType = this.enabledTaskTypes.has(WORKSHEET_CONFIG.forcedFirstTaskType)
      ? WORKSHEET_CONFIG.forcedFirstTaskType
      : enabledTypes[0];
    const weightedPool = enabledTypes.flatMap((type) => Array.from({ length: TASK_TYPES[type].weight }, () => type));

    this.taskPlan = [forcedType, ...shuffleArray(enabledTypes.filter((type) => type !== forcedType))];

    while (this.taskPlan.length < totalTasks) {
      this.taskPlan.push(getRandomElement(weightedPool));
    }

    this.taskCursor = 0;
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
    const type = this.taskPlan[this.taskCursor] ?? WORKSHEET_CONFIG.forcedFirstTaskType;
    this.taskCursor += 1;

    const cell = document.createElement('div');
    cell.className = 'task-cell';

    const badge = document.createElement('div');
    badge.className = 'task-number';
    badge.textContent = String(taskNumber);
    cell.append(badge);

    const stack = document.createElement('div');
    stack.className = 'task-stack';
    const instances = [];

    for (let index = 0; index < TASK_TYPES[type].duplicateCount; index += 1) {
      const task = generatorRegistry[type]();
      instances.push({ answer: task.answer, html: task.html.trim() });
      stack.insertAdjacentHTML('beforeend', task.html);
    }

    cell.append(stack);

    return {
      element: cell,
      data: {
        type,
        instances,
      },
    };
  }

  toggleAnswers() {
    document.body.classList.toggle('show-answers');
    const isVisible = document.body.classList.contains('show-answers');
    this.answersButton.textContent = isVisible ? 'Скрыть ответы' : 'Показать ответы';
    this.answersButton.classList.toggle('btn-primary', isVisible);
  }

  exportJSON() {
    const payload = JSON.stringify(this.currentWorksheetData, null, 2);
    const url = `data:text/json;charset=utf-8,${encodeURIComponent(payload)}`;
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
