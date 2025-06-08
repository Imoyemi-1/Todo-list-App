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
              />
              <p class="todo-txt">${capitalizeFirstWork(text)}</p>
            </div>
            <button class="remove-todo-btn">
              <img
                src="images/icon-cross.svg"
                alt=""
              />
            </button>`;
  todoContainer.appendChild(li);
}

// Utility functions
function capitalizeFirstWork(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Eventlistener

todoInput.addEventListener('submit', addNewTodo);
