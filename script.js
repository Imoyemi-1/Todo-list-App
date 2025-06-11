// Global variables
const todoInput = document.getElementById("input-container");

// Add new todo to dom

const addNewTodo = (e) => {
  e.preventDefault();
  let getItemFromStorage = JSON.parse(localStorage.getItem("todo")) || [];

  const input = document.getElementById("addtodoitem");
  const randomId = crypto.randomUUID().slice(-8);

  const todoItem = getItemFromStorage.map((item) => item.txt);

  if (input.value.trim() === "") {
    alert("Please add todo item");
  } else if (todoItem.indexOf(input.value.trim()) !== -1) {
    alert("Todo already exist in the list");
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

  localStorage.setItem("todo", JSON.stringify(getItemFromStorage));

  input.value = "";
};
// display item to dom

const displayTodo = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));

  if (getItemFromStorage) {
    getItemFromStorage.forEach((item) =>
      createTodo(item.txt, item.isActive, item.id)
    );
  }
};
// Create todo element
function createTodo(text, isActive, id) {
  const todoContainer = document.getElementById("todo-Item-container");

  // create list element
  const li = document.createElement("li");
  li.classList = "todo-item";
  li.setAttribute("data-id", id);
  li.innerHTML = `<div class="todo-item-txt-container">
              <input
                type="checkbox"
                name="checktodo"
                class = "checktodo"
                ${isActive ? "checked" : "unchecked"}
              />
              <p class="${
                !isActive ? "todo-txt" : "todo-txt checkcomplete"
              }">${capitalizeFirstWord(text)}</p>
            </div>
            <button class="remove-todo-btn">
              <img
                src="images/icon-cross.svg"
                alt=""
              />
            </button>`;
  todoContainer.appendChild(li);

  document
    .querySelectorAll(".todo-item-txt-container")
    .forEach((item) => item.addEventListener("click", completeTodo));
  document
    .querySelectorAll(".remove-todo-btn")
    .forEach((item) => item.addEventListener("click", removeTodo));
}

// Toggle todo check complete

const completeTodo = (e) => {
  const todoId = e.currentTarget.parentElement.getAttribute("data-id");

  if (e.target.classList.contains("checktodo")) {
    e.target.checked
      ? e.target.nextElementSibling.classList.add("checkcomplete")
      : e.target.nextElementSibling.classList.remove("checkcomplete");
  } else {
    e.target.previousElementSibling.checked =
      !e.target.previousElementSibling.checked;
    e.target.previousElementSibling.checked
      ? e.target.classList.add("checkcomplete")
      : e.target.classList.remove("checkcomplete");
  }

  toggleActiveStateInStorage(todoId);
};

// check and toggle active state for todo

function toggleActiveStateInStorage(todoid) {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));

  const updatedTodo = getItemFromStorage.map((todos) => {
    if (todos.id === todoid) {
      return {
        ...todos,
        isActive: !todos.isActive,
      };
    }
    return todos;
  });
  localStorage.setItem("todo", JSON.stringify(updatedTodo));
}

// RemoveTodo from dom

const removeTodo = (e) => {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));
  const li = e.target.parentElement.parentElement;

  li.remove();
  // remove from storage
  const removedtodo = getItemFromStorage.filter(
    (todo) => todo.id !== li.getAttribute("data-id")
  );
  localStorage.setItem("todo", JSON.stringify(removedtodo));
};

// remove all completed todo from storage
function clearCompletedFromStorage() {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));

  // remove complete from storage
  const removeComplete = getItemFromStorage.filter((todo) => !todo.isActive);
  localStorage.setItem("todo", JSON.stringify(removeComplete));
}

// toggle between todo states btn to filter active states

const filterTodoStates = () => {};

// Utility functions
function capitalizeFirstWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Eventlistener

todoInput.addEventListener("submit", addNewTodo);
displayTodo();
