// Global variables
const todoInput = document.getElementById('input-container');

// Add new todo to dom
const addNewTodo = (e) => {
  e.preventDefault();

  const input = document.getElementById('addtodoitem');
  if (input.value.trim() === '') {
    alert('Please add todo item');
  } else {
    // console.log(input.value.trim());
  }

  createTodo(input.value.trim());

  input.value = '';
};

// Create todo element
function createTodo(text) {
  const todoContainer = document.getElementById('todo-Item-container');

  // create list element
  const li = document.createElement('li');
  li.classList = 'todo-item';
  li.innerHTML = `<div class="todo-item-txt-container">
              <input
                type="checkbox"
                name="checktodo"
                id="checktodo"
                class = "checktodo"
              />
              <p class="todo-txt">${capitalizeFirstWord(text)}</p>
            </div>
            <button class="remove-todo-btn">
              <img
                src="images/icon-cross.svg"
                alt=""
              />
            </button>`;
  todoContainer.appendChild(li);

  document
    .querySelectorAll('.checktodo')
    .forEach((item) => item.addEventListener('click', completeTodo));
  document
    .querySelectorAll('.todo-txt')
    .forEach((item) => item.addEventListener('click', completeTodo));
  document
    .querySelectorAll('.remove-todo-btn')
    .forEach((item) => item.addEventListener('click', removeTodo));
}

// Toggle todo check complete

const completeTodo = (e) => {
  if (e.target.classList.contains('checktodo')) {
    e.target.checked
      ? e.target.nextElementSibling.classList.add('checkcomplete')
      : e.target.nextElementSibling.classList.remove('checkcomplete');
  } else {
    e.target.previousElementSibling.checked =
      !e.target.previousElementSibling.checked;
    e.target.previousElementSibling.checked
      ? e.target.classList.add('checkcomplete')
      : e.target.classList.remove('checkcomplete');
  }
};

// RemoveTodo from dom

const removeTodo = (e) => {
  e.target.parentElement.parentElement.remove();
};

// Utility functions
function capitalizeFirstWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Eventlistener

todoInput.addEventListener('submit', addNewTodo);
