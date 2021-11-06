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
  saveToLocal(todoInput.value);
  todoInput.value = "";
}

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
  btnEdit = document.createElement("a");
  btnEdit.classList.add("edit-button");
  btnEdit.innerHTML = `<i class="fas fa-pencil-alt"></i>`;
  btnDelete = document.createElement("a");
  btnDelete.classList.add("delete-button");
  btnDelete.innerHTML = `<i class="fas fa-trash-alt"></i>`;
  buttonsDiv.appendChild(btnEdit);
  buttonsDiv.appendChild(btnDelete);
  li.appendChild(buttonsDiv);

  todosList.appendChild(li);
}
