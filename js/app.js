// Elements
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todosList = document.querySelector(".todos-list");

// Event listeners
document.addEventListener("DOMContentLoaded", fillContent);
addTodoBtn.addEventListener("click", addTodo);
todosList.addEventListener("click", deleteTodo);

// Functions
function fillContent() {
  // Check if localStorage is not empty and create Todos
  if (checkStorage()) {
    let todos;
    todos = JSON.parse(localStorage.getItem("todos"));
    todos.forEach((todo) => {
      createTodo(todo);
    });
  }
}

function addTodo(e) {
  e.preventDefault();
  createTodo(todoInput.value);
  saveToLocal(todoInput.value);
  todoInput.value = "";
}

function checkStorage() {
  // Check if localStorage is empty
  return localStorage.getItem("todos") !== null;
}

function saveToLocal(todo) {
  let todos;
  if (checkStorage()) {
    todos = JSON.parse(localStorage.getItem("todos"));
  } else {
    todos = [];
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
// Create Todo element in DOM
function createTodo(todoContent) {
  let li, divTodo, checkbox, span, buttonsDiv, btnEdit, btnDelete;

  li = document.createElement("li");
  li.classList.add("list-group-item");
  divTodo = document.createElement("div");
  divTodo.classList.add("todo-content");
  checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("form-check-input", "me-2");
  divTodo.appendChild(checkbox);
  span = document.createElement("span");
  span.classList.add("todo");
  divTodo.appendChild(span);
  span.textContent = todoContent;
  li.appendChild(divTodo);

  //Buttons
  buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");
  btnEdit = document.createElement("button");
  btnEdit.classList.add("edit-button");
  btnEdit.innerHTML = `<i class="fas fa-pencil-alt text-info"></i>`;
  btnDelete = document.createElement("button");
  btnDelete.classList.add("delete-button");
  btnDelete.innerHTML = `<i class="fas fa-trash-alt text-danger"></i>`;
  buttonsDiv.appendChild(btnEdit);
  buttonsDiv.appendChild(btnDelete);
  li.appendChild(buttonsDiv);

  todosList.appendChild(li);
}

function deleteTodo(e) {
  let item = e.target.parentElement;

  if (e.target.classList.contains("delete-button")) {
    item.parentElement.remove(); // Remove from DOM
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoText = item.parentElement.textContent;
    // Remove todo from array using its index
    todos.splice(todos.indexOf(todoText), 1);
    // Save modified array to localStorage
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}
