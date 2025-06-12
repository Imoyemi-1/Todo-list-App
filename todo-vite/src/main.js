// import sortable for drag and drop

import Sortable from "sortablejs";

// Global variables
const todoInput = document.getElementById("input-container");
const statesbtn = document.querySelectorAll("#todo-active-state-toggle button");
const todoContainer = document.getElementById("todo-Item-container");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const darkModeBtn = document.getElementById("dark-mode");
const page = document.documentElement;

let isActive = "all";

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
  filterTodoStates();
  hideActiveContainer();
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
  // create list element
  const li = document.createElement("li");
  li.classList = "todo-item";
  li.id = "todo-item-con";
  li.setAttribute("data-id", id);
  li.setAttribute("data-active", isActive);
  li.setAttribute("draggable", true);
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

  if (e.target.tagName === "INPUT" || e.target.tagName === "P") {
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
    filterTodoStates();
  }
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

  count();
  hideActiveContainer();
};

// remove all completed todo from storage
function clearCompletedFromStorage() {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));

  // remove complete from storage
  const removeComplete = getItemFromStorage.filter((todo) => !todo.isActive);
  localStorage.setItem("todo", JSON.stringify(removeComplete));
}

// toggle between todo states btn to filter active states

const toggleStatesBtn = (e) => {
  const btn = e.target;

  statesbtn.forEach((item) => item.classList.remove("active-state"));
  btn.classList.add("active-state");

  if (btn.textContent === "Active") {
    isActive = "active";
  } else if (btn.textContent === "Completed") {
    isActive = "completed";
  } else {
    isActive = "all";
  }

  filterTodoStates();
};

const filterTodoStates = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));

  todoContainer.innerHTML = "";

  const filterTodo = getItemFromStorage.filter((todo) => {
    if (isActive === "all") {
      return true;
    }
    if (isActive === "active") {
      return !todo.isActive;
    }

    if (isActive === "completed") {
      return todo.isActive;
    }
  });

  filterTodo.forEach((item) => createTodo(item.txt, item.isActive, item.id));
  count();
};

//  count todo list in the dom
function count() {
  const li = document.querySelectorAll("ul li");

  document.getElementById("count-num").textContent = li.length;
}

// check todo list and hide the active states container if list is empty

const hideActiveContainer = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo")) || [];
  const statesBtnContainer = document.getElementById(
    "toggle-todo-section-container"
  );
  const dragDrop = document.getElementById("drag-drop");

  if (getItemFromStorage.length === 0) {
    statesBtnContainer.style.display = "none";
    dragDrop.style.display = "none";
  } else {
    statesBtnContainer.style.display = "grid";
    dragDrop.style.display = "block";
  }
};

// clear todo thats completed from dom

const clearCompletedTodo = () => {
  const getItemFromStorage = JSON.parse(localStorage.getItem("todo"));

  const completedTodo = getItemFromStorage.filter((todo) => todo.isActive);
  const nonCompletedTodo = getItemFromStorage.filter((todo) => !todo.isActive);
  if (completedTodo.length === 0) {
    return;
  }
  if (confirm("Clear All Completed Todo")) {
    todoContainer.innerHTML = "";
    nonCompletedTodo.forEach((item) =>
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
  page.classList.toggle("dark-light-mode");

  if (page.classList.contains("dark-light-mode")) {
    darkModeBtn.src = "images/icon-moon.svg";
    darkModeBtn.title = "light mode";
    localStorage.setItem("darklightMode", JSON.stringify("light"));
  } else {
    darkModeBtn.src = "images/icon-sun.svg";
    darkModeBtn.title = "dark mode";
    localStorage.setItem("darklightMode", JSON.stringify("dark"));
  }
};

// get dark or light mode from storage

const getDarkModeFromStorage = () => {
  const darkModeFromStorage = JSON.parse(localStorage.getItem("darklightMode"));

  darkModeFromStorage === "light"
    ? page.classList.add("dark-light-mode")
    : page.classList.remove("dark-light-mode");
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
  const li = document.querySelectorAll("li");
  const newTodo = [];

  if (document.querySelector(".all-btn.active-state")) {
    li.forEach((item) => {
      newTodo.push({
        txt: item.querySelector("p").textContent,
        isActive: item.getAttribute("data-active") === "true" ? true : false,
        id: item.getAttribute("data-id"),
      });
    });

    localStorage.setItem("todo", JSON.stringify(newTodo));
  }
};

// Utility functions
function capitalizeFirstWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Eventlistener

function eventListeners() {
  todoInput.addEventListener("submit", addNewTodo);
  statesbtn.forEach((btn) => btn.addEventListener("click", toggleStatesBtn));
  document.addEventListener("DOMContentLoaded", () => {
    displayTodo();
    count();
    hideActiveContainer();
    getDarkModeFromStorage();
  });
  clearCompletedBtn.addEventListener("click", clearCompletedTodo);
  darkModeBtn.addEventListener("click", darkLightMode);
}

eventListeners();
