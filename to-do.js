const STORAGE_KEY = 'advancedTaskManager.tasks';
const THEME_KEY = 'advancedTaskManager.theme';
let tasks = [];

const elements = {
  form: document.getElementById('task-form'),
  title: document.getElementById('task-title'),
  category: document.getElementById('task-category'),
  deadline: document.getElementById('task-deadline'),
  priority: document.getElementById('task-priority'),
  desc: document.getElementById('task-desc'),
  clearButton: document.getElementById('clear-form'),
  themeToggle: document.getElementById('theme-toggle'),
  openList: document.getElementById('tasks-open'),
  completedList: document.getElementById('tasks-completed'),
  countOpen: document.getElementById('count-open'),
  countCompleted: document.getElementById('count-completed'),
  countOverdue: document.getElementById('count-overdue'),
};

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Unable to load tasks from localStorage', error);
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  if (window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyTheme(theme) {
  if (document.body) {
    document.body.classList.toggle('dark', theme === 'dark');
  }
  if (elements.themeToggle) {
    elements.themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

function toggleTheme() {
  const nextTheme = document.body && document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
}

function isOverdue(task) {
  if (task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(task.deadline);
  deadline.setHours(0, 0, 0, 0);
  return deadline < today;
}

function priorityBadgeClass(priority) {
  switch (priority) {
    case 'High':
      return 'priority-high';
    case 'Medium':
      return 'priority-medium';
    default:
      return 'priority-low';
  }
}

function createTaskCard(task) {
  const card = document.createElement('article');
  card.className = 'task-item';
  card.dataset.id = task.id;
  card.draggable = !task.completed;

  const overdue = isOverdue(task);
  card.innerHTML = `
    <div class="task-item-header">
      <div>
        <h3 class="task-title">${task.title}</h3>
        <div class="task-meta">
          <span class="badge category">${task.category}</span>
          <span class="badge ${priorityBadgeClass(task.priority)}">${task.priority}</span>
          <span class="badge status">${task.completed ? 'Done' : overdue ? 'Overdue' : 'Open'}</span>
        </div>
      </div>
      <div class="task-date${overdue ? ' overdue' : ''}">${formatDate(task.deadline)}</div>
    </div>
    <p class="task-desc">${task.description || '&nbsp;'}</p>
    <div class="task-controls">
      <button type="button" class="complete-button">${task.completed ? 'Undo' : 'Complete'}</button>
      <button type="button" class="delete-button">Delete</button>
    </div>
  `;

  card.querySelector('.complete-button').addEventListener('click', () => toggleComplete(task.id));
  card.querySelector('.delete-button').addEventListener('click', () => deleteTask(task.id));

  if (!task.completed) {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  }

  return card;
}

function renderTasks() {
  elements.openList.innerHTML = '';
  elements.completedList.innerHTML = '';

  const openTasks = tasks.filter((task) => !task.completed).sort((a, b) => a.order - b.order);
  const completedTasks = tasks.filter((task) => task.completed).sort((a, b) => b.completedAt - a.completedAt);

  openTasks.forEach((task) => elements.openList.appendChild(createTaskCard(task)));
  completedTasks.forEach((task) => elements.completedList.appendChild(createTaskCard(task)));

  elements.countOpen.textContent = openTasks.length;
  elements.countCompleted.textContent = completedTasks.length;
  elements.countOverdue.textContent = tasks.filter(isOverdue).length;
}

function addTask(event) {
  event.preventDefault();

  const newTask = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title: elements.title.value.trim(),
    category: elements.category.value,
    deadline: elements.deadline.value,
    priority: elements.priority.value,
    description: elements.desc.value.trim(),
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
    order: tasks.filter((task) => !task.completed).length,
  };

  if (!newTask.title || !newTask.deadline) {
    return;
  }

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  elements.form.reset();
}

function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id !== id) return task;
    const isNowCompleted = !task.completed;
    return {
      ...task,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? Date.now() : null,
      order: isNowCompleted ? task.order : tasks.filter((item) => !item.completed).length,
    };
  });
  reorderOpenTasks();
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  reorderOpenTasks();
  saveTasks();
  renderTasks();
}

function reorderOpenTasks() {
  tasks
    .filter((task) => !task.completed)
    .sort((a, b) => a.order - b.order)
    .forEach((task, index) => {
      task.order = index;
    });
}

function handleDragStart(event) {
  event.currentTarget.classList.add('dragging');
  event.dataTransfer.setData('text/plain', event.currentTarget.dataset.id);
  event.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove('dragging');
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function handleDragOver(event) {
  event.preventDefault();
  const afterElement = getDragAfterElement(elements.openList, event.clientY);
  const draggingElement = document.querySelector('.dragging');
  if (!draggingElement) return;

  if (afterElement == null) {
    elements.openList.appendChild(draggingElement);
  } else {
    elements.openList.insertBefore(draggingElement, afterElement);
  }
}

function handleDrop(event) {
  event.preventDefault();
  const openItems = [...elements.openList.querySelectorAll('.task-item')];
  const order = openItems.map((item) => item.dataset.id);
  tasks
    .filter((task) => !task.completed)
    .forEach((task) => {
      task.order = order.indexOf(task.id);
    });
  saveTasks();
  renderTasks();
}

function setTodayMinDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  elements.deadline.min = `${year}-${month}-${day}`;
}

function init() {
  loadTasks();
  setTodayMinDate();
  renderTasks();
  applyTheme(getInitialTheme());

  elements.form.addEventListener('submit', addTask);
  elements.clearButton.addEventListener('click', () => elements.form.reset());
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', toggleTheme);
  }
  elements.openList.addEventListener('dragover', handleDragOver);
  elements.openList.addEventListener('drop', handleDrop);
}

init();
