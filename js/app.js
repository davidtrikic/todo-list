// Elements
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todosList = document.querySelector(".todos-list");

// Event listeners
document.addEventListener("DOMContentLoaded", fillContent);
addTodoBtn.addEventListener("click", addTodo);

// Functions
function addTodo(e) {
  e.preventDefault();
  createTodo(todoInput.value);
  // Add to localStorage if not empty
  saveToLocal(todoInput.value);
  todoInput.value = "";
}

function createTodo(todoContent) {
  let todo;
  todo = document.createElement("li");
  todo.innerText = todoContent;
  todosList.appendChild(todo);
}

function fillContent() {
  // Check for local content, if not empty, fill page with createTodo function
  if (checkStorage()) {
    // Forreach item in array, call createTodo function
    console.log(localStorage);
  }
}

function checkStorage() {
  // CHECK if there are todos saved
  return localStorage.getItem("todos") !== null;
}

function saveToLocal(todo) {
  console.log(todo);
  let todos;
  if (checkStorage()) {
    todos = JSON.parse(localStorage.getItem("todos"));
  } else {
    todos = [];
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
