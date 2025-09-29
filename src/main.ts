// import sortable for drag and drop

import Sortable from 'sortablejs';

// import image

import removeBtn from '/images/icon-cross.svg';
import darkModeIcon from '/images/icon-sun.svg';
import lightModeIcon from '/images/icon-moon.svg';

// Global variables
const todoInput = document.getElementById('input-container') as HTMLFormElement;
const statesBtn = document.querySelectorAll('#todo-active-state-toggle button');
const todoContainer = document.getElementById(
  'todo-Item-container'
) as HTMLElement;
const clearCompletedBtn = document.getElementById(
  'clear-completed-btn'
) as HTMLElement;
const darkModeBtn = document.getElementById('dark-mode') as HTMLImageElement;
const page = document.documentElement;

let isActive = 'all';

interface Todo {
  id: string;
  txt: string;
  isActive: boolean;
}
// Add new todo to dom

const addNewTodo = (e: SubmitEvent) => {
  e.preventDefault();

  let getItemFromStorage: Todo[] = JSON.parse(
    localStorage.getItem('todo') || '[]'
  );

  const input = document.getElementById('addtodoitem') as HTMLInputElement;
  const randomId = crypto.randomUUID().slice(-8);

  const todoItem = [...document.querySelectorAll('li .todo-txt')].map(
    (item) => item.textContent
  );

  if (input.value.trim() === '') {
    alert('Please add todo item');
  } else if (todoItem.includes(capitalizeFirstWord(input.value.trim()))) {
    alert('Todo already exist in the list');
  } else {
    createTodo(input.value.trim(), false, randomId);
    if (!getItemFromStorage) {
      getItemFromStorage = [];
    }
    getItemFromStorage.push({
      txt: input.value.trim(),
      isActive: false,
      id: randomId,
    });
  }

  localStorage.setItem('todo', JSON.stringify(getItemFromStorage));

  input.value = '';
  filterTodoStates();
  hideActiveContainer();
};
// display item to dom

const displayTodo = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');

  if (getItemFromStorage) {
    getItemFromStorage.forEach((item: Todo) =>
      createTodo(item.txt, item.isActive, item.id)
    );
  }
};
// Create todo element
function createTodo(text: string, isActive: boolean, id: string) {
  // create list element
  const li = document.createElement('li');
  li.classList = 'todo-item';
  li.id = 'todo-item-con';
  li.setAttribute('data-id', id);
  li.setAttribute('data-active', String(isActive));
  li.innerHTML = `<div class="todo-item-txt-container">
              <input
                type="checkbox"
                name="checktodo"
                class = "checktodo"
                ${isActive ? 'checked' : 'unchecked'}
              />
              <p class="${
                !isActive ? 'todo-txt' : 'todo-txt checkcomplete'
              }">${capitalizeFirstWord(text)}</p>
            </div>
            <button class="remove-todo-btn">
              <img
                src= ${removeBtn}
                alt="delete button"
              />
            </button>`;
  todoContainer.appendChild(li);

  document
    .querySelectorAll('.todo-item-txt-container')
    .forEach((item) => item.addEventListener('change', completeTodo));

  document
    .querySelectorAll('.remove-todo-btn')
    .forEach((item) => item.addEventListener('click', removeTodo));
}

// Toggle todo check complete

const completeTodo = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  const target = e.target as HTMLInputElement;
  const checkboxNextSibling = target?.nextElementSibling as HTMLElement;
  const checkboxPrevSibling =
    target?.previousElementSibling as HTMLInputElement;
  const todoId = currentTarget?.parentElement?.getAttribute(
    'data-id'
  ) as string;

  if (target.tagName === 'INPUT' || target.tagName === 'P') {
    if (target.classList.contains('checktodo')) {
      target?.checked
        ? checkboxNextSibling.classList.add('checkcomplete')
        : checkboxNextSibling.classList.remove('checkcomplete');
    } else {
      checkboxPrevSibling.checked = checkboxPrevSibling.checked;
      checkboxPrevSibling.checked
        ? checkboxPrevSibling.classList.add('checkcomplete')
        : checkboxPrevSibling.classList.remove('checkcomplete');
    }

    toggleActiveStateInStorage(todoId);
    filterTodoStates();
  }
};

// check and toggle active state for todo

function toggleActiveStateInStorage(todoId: string) {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');

  const updatedTodo = getItemFromStorage.map((todos: Todo) => {
    if (todos.id === todoId) {
      return {
        ...todos,
        isActive: !todos.isActive,
      };
    }
    return todos;
  });
  localStorage.setItem('todo', JSON.stringify(updatedTodo));
}

// RemoveTodo from dom

const removeTodo = (e: Event) => {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');
  const target = e.target as HTMLElement;
  const li = target.parentElement?.parentElement as HTMLElement;

  li.remove();
  // remove from storage
  const removedTodo = getItemFromStorage.filter(
    (todo: Todo) => todo.id !== li.getAttribute('data-id')
  );
  localStorage.setItem('todo', JSON.stringify(removedTodo));

  count();
  hideActiveContainer();
};

// remove all completed todo from storage
function clearCompletedFromStorage() {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');

  // remove complete from storage
  const removeComplete = getItemFromStorage.filter(
    (todo: Todo) => !todo.isActive
  );
  localStorage.setItem('todo', JSON.stringify(removeComplete));
}

// toggle between todo states btn to filter active states

const toggleStatesBtn = (e: Event) => {
  const btn = e.target as HTMLElement;

  statesBtn.forEach((item) => item.classList.remove('active-state'));
  btn.classList.add('active-state');

  if (btn.textContent === 'Active') {
    isActive = 'active';
  } else if (btn.textContent === 'Completed') {
    isActive = 'completed';
  } else {
    isActive = 'all';
  }

  filterTodoStates();
};

const filterTodoStates = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');

  todoContainer.innerHTML = '';

  const filterTodo = getItemFromStorage.filter((todo: Todo) => {
    if (isActive === 'all') {
      return true;
    }
    if (isActive === 'active') {
      return !todo.isActive;
    }

    if (isActive === 'completed') {
      return todo.isActive;
    }
  });

  filterTodo.forEach((item: Todo) =>
    createTodo(item.txt, item.isActive, item.id)
  );
  count();
};

//  count todo list in the dom
function count() {
  const li = document.querySelectorAll('ul li');
  const countElement = document.getElementById('count-num') as HTMLElement;

  countElement.textContent = String(li.length);
}

// check todo list and hide the active states container if list is empty

const hideActiveContainer = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');
  const statesBtnContainer = document.getElementById(
    'toggle-todo-section-container'
  ) as HTMLElement;
  const dragDrop = document.getElementById('drag-drop') as HTMLElement;

  if (getItemFromStorage.length === 0) {
    statesBtnContainer.style.display = 'none';
    dragDrop.style.display = 'none';
  } else {
    statesBtnContainer.style.display = 'grid';
    dragDrop.style.display = 'block';
  }
};

// clear todo thats completed from dom

const clearCompletedTodo = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem('todo') || '[]');

  const completedTodo = getItemFromStorage.filter(
    (todo: Todo) => todo.isActive
  );
  const nonCompletedTodo = getItemFromStorage.filter(
    (todo: Todo) => !todo.isActive
  );
  if (completedTodo.length === 0) {
    return;
  }
  if (confirm('Clear All Completed Todo')) {
    todoContainer.innerHTML = '';
    nonCompletedTodo.forEach((item: Todo) =>
      createTodo(item.txt, item.isActive, item.id)
    );
    clearCompletedFromStorage();
    count();
    filterTodoStates();
    hideActiveContainer();
  }
};

// Dark mode

const darkLightMode = () => {
  page.classList.toggle('dark-light-mode');

  if (page.classList.contains('dark-light-mode')) {
    darkModeBtn.src = lightModeIcon;
    darkModeBtn.title = 'light mode';
    localStorage.setItem('darklightMode', JSON.stringify('light'));
  } else {
    darkModeBtn.src = darkModeIcon;
    darkModeBtn.title = 'dark mode';
    localStorage.setItem('darklightMode', JSON.stringify('dark'));
  }
};

// get dark or light mode from storage

const getDarkModeFromStorage = () => {
  const darkModeFromStorage = JSON.parse(
    localStorage.getItem('darklightMode') || ''
  );

  darkModeFromStorage === 'light'
    ? page.classList.add('dark-light-mode')
    : page.classList.remove('dark-light-mode');
};

// set drag and drop for todo item

new Sortable(todoContainer, {
  animation: 150,
  onEnd: () => {
    updateStorage();
  },
});

// update todo in storage from drag and drop

const updateStorage = () => {
  const li = document.querySelectorAll('li');
  const newTodo: Todo[] = [];

  if (document.querySelector('.all-btn.active-state')) {
    li.forEach((item: HTMLElement) => {
      newTodo.push({
        txt: String(item.querySelector('p')?.textContent),
        isActive: item.getAttribute('data-active') === 'true' ? true : false,
        id: String(item.getAttribute('data-id')),
      });
    });

    localStorage.setItem('todo', JSON.stringify(newTodo));
  }
};

// Utility functions
function capitalizeFirstWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Eventlistener

function eventListeners() {
  todoInput.addEventListener('submit', addNewTodo);
  statesBtn.forEach((btn) => btn.addEventListener('click', toggleStatesBtn));
  document.addEventListener('DOMContentLoaded', () => {
    displayTodo();
    count();
    hideActiveContainer();
    getDarkModeFromStorage();
  });
  clearCompletedBtn.addEventListener('click', clearCompletedTodo);
  darkModeBtn.addEventListener('click', darkLightMode);
}

eventListeners();
