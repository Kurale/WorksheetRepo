export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const TASK_TYPES = {
  column_add_sub: {
    id: 'column_add_sub',
    label: 'Сложение / вычитание',
    weight: 3,
    duplicateCount: 2,
  },
  long_multiplication: {
    id: 'long_multiplication',
    label: 'Умножение в столбик',
    weight: 2,
    duplicateCount: 3,
  },
  long_division: {
    id: 'long_division',
    label: 'Деление в столбик',
    weight: 2,
    duplicateCount: 2,
  },
  comparison: {
    id: 'comparison',
    label: 'Сравнение',
    weight: 1,
    duplicateCount: 1,
  },
  equation: {
    id: 'equation',
    label: 'Уравнения',
    weight: 1,
    duplicateCount: 1,
  },
  word_problem: {
    id: 'word_problem',
    label: 'Текстовые задачи',
    weight: 1,
    duplicateCount: 1,
  },
  fraction: {
    id: 'fraction',
    label: 'Дроби',
    weight: 1,
    duplicateCount: 1,
  },
};

export const WORKSHEET_CONFIG = {
  tasksPerDay: 3,
  forcedFirstTaskType: 'column_add_sub',
  defaultEnabledTaskTypes: Object.keys(TASK_TYPES),
};
