import { DAYS, TASK_TYPES, WORKSHEET_CONFIG } from './config.js';
import { generatorRegistry } from './generators/index.js';
import { getRandomElement, shuffleArray } from './utils/random.js';

/** @typedef {{type: string, answer: string|number, html: string}} TaskDefinition */

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
      label.className = 'task-filter';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'taskType';
      input.value = taskType.id;
      input.checked = this.enabledTaskTypes.has(taskType.id);

      const marker = document.createElement('span');
      marker.className = 'task-filter-marker';
      marker.textContent = taskType.label;

      label.append(input, marker);
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
    const guaranteedTypes = enabledTypes.filter((type) => type !== forcedType);
    const weightedPool = this.buildWeightedPool(enabledTypes);
    const plan = [forcedType];

    plan.push(...shuffleArray(guaranteedTypes));

    while (plan.length < totalTasks) {
      plan.push(getRandomElement(weightedPool));
    }

    this.taskPlan = plan.slice(0, totalTasks);
    this.taskCursor = 0;
  }

  buildWeightedPool(types) {
    return types.flatMap((type) => Array.from({ length: TASK_TYPES[type].weight }, () => type));
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

    const renderedTasks = [];

    for (let index = 0; index < duplicateCount; index += 1) {
      const renderedTask = generatorRegistry[type]();
      renderedTasks.push({
        answer: renderedTask.answer,
        html: renderedTask.html.trim(),
      });
      stack.insertAdjacentHTML('beforeend', renderedTask.html);
    }

    cell.append(stack);

    return {
      element: cell,
      data: {
        type,
        instances: renderedTasks,
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
  filtersForm: document.querySelector('[data-task-filters]'),
});

window.addEventListener('DOMContentLoaded', () => app.init());
