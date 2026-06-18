import { addDays, addWeeks, addMonths, format } from 'date-fns';

export function generateNextOccurrence(task) {
  if (!task.recurrence || task.recurrence === 'None') return null;

  const baseDue = task.dueDate ? new Date(task.dueDate) : new Date();
  let nextDue;

  if (task.recurrence === 'Daily') nextDue = addDays(baseDue, 1);
  else if (task.recurrence === 'Weekly') nextDue = addWeeks(baseDue, 1);
  else if (task.recurrence === 'Monthly') nextDue = addMonths(baseDue, 1);
  else return null;

  return {
    ...task,
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'To Do',
    dueDate: format(nextDue, 'yyyy-MM-dd'),
    parentTaskId: task.id,
    createdAt: new Date().toISOString(),
    comments: [],
  };
}
