// Elements
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todosList = document.querySelector(".todos-list");
const clearAllBtn = document.querySelector(".clear-all");
const filterBtn = document.querySelector(".btn-group");

// Testing code
///////////////////////////////////////////////////////////////////////////

const local = document.querySelector(".get-local");

function Data(todos, checked) {
  this.todos = todos;
  this.checked = checked;
}

local.addEventListener("click", function (e) {
  e.preventDefault();
  let todos = JSON.parse(localStorage.getItem("todos"));
  let checked = JSON.parse(localStorage.getItem("checked"));
  //   console.table(todos);
  //   console.table(checked);
  var me = new Data(todos, checked);
  console.table(me);
});

///////////////////////////////////////////////////////////////////////////

// Event listeners
document.addEventListener("DOMContentLoaded", createContent);
addTodoBtn.addEventListener("click", addTodo);
todosList.addEventListener("click", deleteTodo);
todosList.addEventListener("click", editTodo);
todosList.addEventListener("click", checkCompleted);
clearAllBtn.addEventListener("click", clearAll);
filterBtn.addEventListener("click", filterTodos);

// Functions

function createContent() {
  // Set storage
  if (!checkStorage()) {
    let todos = [],
      checked = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("checked", JSON.stringify(checked));
  }
  // Read storage
  todos = JSON.parse(localStorage.getItem("todos"));
  checked = JSON.parse(localStorage.getItem("checked"));

  todos.forEach((todo, index) => {
    createTodo(todo, index, checked);
  });
}

function checkStorage() {
  // Check if localStorage is empty
  return localStorage.getItem("todos") !== null && localStorage.getItem("checked") !== null;
}

function addTodo(e) {
  e.preventDefault();
  createTodo(todoInput.value);
  let isSave = true;
  saveToLocal(todoInput.value, isSave);
  todoInput.value = "";
}

function saveToLocal(todoValue, isSave) {
  let todos, checked;
  // Read from storage
  todos = JSON.parse(localStorage.getItem("todos"));
  checked = JSON.parse(localStorage.getItem("checked"));
  // Store value
  if (isSave) {
    todos.push(todoValue);
    checked[todos.indexOf(todoValue)] = false;
  }
  if (!isSave) {
    let todoIndex = todos.indexOf(todoValue);
    todos.splice(todoIndex, 1);
    checked.splice(todoIndex, 1);
  }
  // Save to storage
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("checked", JSON.stringify(checked));
}

// Create Todo element in DOM
function createTodo(todoValue, todoIndex, checked) {
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
  span.textContent = todoValue;
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
  // Check todo if completed
  if (todoIndex != null && checked !== null) {
    // If function is called without parameters
    if (checked[todoIndex] === true) {
      checkbox.checked = true;
      span.style.textDecoration = "line-through";
      span.style.color = "#555";
    }
  }
}

function deleteTodo(e) {
  let item = e.target.parentElement;

  if (e.target.classList.contains("delete-button")) {
    let todoValue = item.parentElement.textContent;
    // Remove from DOM
    item.parentElement.remove();
    let isSave = false;
    // Store changes
    saveToLocal(todoValue, isSave);
  }
}

function editTodo(e) {
  let buttonsDiv = e.target.parentElement;
  if (e.target.classList.contains("edit-button")) {
    let todo = buttonsDiv.previousElementSibling.children[1];
    let oldText = todo.textContent;
    todo.contentEditable = "true";
    // Set style
    todo.addEventListener("focus", function () {
      this.classList.add("is-focused");
    });
    todo.addEventListener("blur", function () {
      this.classList.remove("is-focused");
    });
    // Add edit confirmation button
    let btnConfirm = document.createElement("button");
    btnConfirm.classList.add("confirm-button");
    btnConfirm.innerHTML = `<i class="fas fa-check text-primary"></i>`;
    // Add button only once
    if (!buttonsDiv.children[0].classList.contains("confirm-button")) {
      buttonsDiv.prepend(btnConfirm);
    }
    // Save edited todo
    btnConfirm.addEventListener("click", function () {
      saveEdited(todo, oldText, btnConfirm);
    });
    todo.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdited(todo, oldText, btnConfirm);
        todo.classList.remove("is-focused");
      }
    });
  }
}

function saveEdited(todo, oldText, button) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  todos[todos.indexOf(oldText)] = todo.textContent;
  localStorage.setItem("todos", JSON.stringify(todos));
  todo.contentEditable = "false";
  button.remove();
}

function checkCompleted(e) {
  if (e.target.classList.contains("form-check-input")) {
    let todo = e.target.parentElement.children[1];
    if (e.target.checked) {
      todo.style.textDecoration = "line-through";
      todo.style.color = "#555";
    }
    if (!e.target.checked) {
      todo.style.textDecoration = "initial";
      todo.style.color = "#212529";
    }
    saveChecked(todo.textContent, e.target.checked);
  }
}

function saveChecked(todoValue, isChecked) {
  let todos, checked, indexOfTodo;
  todos = JSON.parse(localStorage.getItem("todos"));
  checked = JSON.parse(localStorage.getItem("checked"));
  indexOfTodo = todos.indexOf(todoValue);

  if (isChecked) checked[indexOfTodo] = true;
  if (!isChecked) checked[indexOfTodo] = false;
  localStorage.setItem("checked", JSON.stringify(checked));
}
function clearAll(e) {
  e.preventDefault();
  while (todosList.firstChild) {
    todosList.removeChild(todosList.firstChild);
  }
  todoInput.value = "";
  let todos = [],
    checked = [];
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("checked", JSON.stringify(checked));
}

function filterTodos(e) {
  let list = todosList.childNodes;
  for (let li of list) {
    if (e.target.classList.contains("all")) {
      li.style.display = "flex";
    }
    if (e.target.classList.contains("completed")) {
      if (li.childNodes[0].firstChild.checked) {
        li.style.display = "flex";
      } else {
        li.style.display = "none";
      }
    }
    if (e.target.classList.contains("uncompleted")) {
      if (li.childNodes[0].firstChild.checked) {
        li.style.display = "none";
      } else {
        li.style.display = "flex";
      }
    }
  }
  // Display top border if only one li element displayed (bootstrap's quirk)
  let count = 0;
  list.forEach((li) => {
    if (li.style.display === "flex") count++;
  });
  if (count === 1) todosList.classList.add("top-border");
  else todosList.classList.remove("top-border");
}
