// Elements
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todosList = document.querySelector(".todos-list");
const clearAllBtn = document.querySelector(".clear-all");
const filterBtn = document.querySelector(".btn-group");

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
  fillEmptyContent();
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
  if (todosList.firstChild.classList.contains("empty-message")) {
    todosList.firstChild.remove();
  }
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
  let li, divTodo, checkbox, span, timestamp, buttonsDiv, btnEdit, btnDelete;

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
  span.textContent = todoValue;
  divTodo.appendChild(span);
  let tooltip = document.createElement("span");
  tooltip.classList.add("tooltip-edit", "hidden");
  tooltip.textContent = "Click text to edit";
  divTodo.appendChild(tooltip);
  li.appendChild(divTodo);
  // Timestamp
  timestamp = document.createElement("p");
  timestamp.classList.add("timestamp", "my-0");
  timestamp.innerHTML = `<i class="fas fa-info-circle text-secondary"></i> ${getTimestamp()}`;
  // Buttons
  buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");
  btnEdit = document.createElement("button");
  btnEdit.setAttribute("data-bs-toggle", "tooltip");
  btnEdit.setAttribute("data-bs-placement", "top");
  btnEdit.setAttribute("title", "Edit todo");
  btnEdit.classList.add("edit-button");
  btnEdit.innerHTML = `<i class="fas fa-pencil-alt text-info"></i>`;
  btnDelete = document.createElement("button");
  btnDelete.setAttribute("data-bs-toggle", "tooltip");
  btnDelete.setAttribute("data-bs-placement", "top");

  btnDelete.setAttribute("title", "Delete todo");
  btnDelete.classList.add("delete-button");
  btnDelete.innerHTML = `<i class="fas fa-trash-alt text-danger"></i>`;
  buttonsDiv.appendChild(btnEdit);
  buttonsDiv.appendChild(btnDelete);
  buttonsDiv.appendChild(timestamp);
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
    fillEmptyContent();
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
    btnConfirm.setAttribute("data-bs-toggle", "tooltip");
    btnConfirm.setAttribute("data-bs-placement", "top");
    btnConfirm.setAttribute("title", "Save changes");
    btnConfirm.classList.add("confirm-button");
    btnConfirm.innerHTML = `<i class="fas fa-check text-primary"></i>`;
    // Add button only once
    if (!buttonsDiv.children[0].classList.contains("confirm-button")) {
      buttonsDiv.prepend(btnConfirm);
    }
    // Add tooltip
    let tooltip = todo.nextElementSibling;
    tooltip.classList.remove("hidden");
    todo.addEventListener("click", function () {
      tooltip.classList.add("hidden");
    });
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
  if (confirm("Are you sure you want to delete all todos?")) {
    while (todosList.firstChild) {
      todosList.removeChild(todosList.firstChild);
    }
    todoInput.value = "";
    let todos = [],
      checked = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("checked", JSON.stringify(checked));
    fillEmptyContent();
  }
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

function fillEmptyContent() {
  if (todosList.children.length === 0) {
    let msg = document.createElement("p");
    msg.textContent = "Your list is empty :( Consider adding some tasks!";
    msg.classList.add("empty-message");
    todosList.appendChild(msg);
  }
}

function getTimestamp() {
  const d = new Date();
  let year = d.getFullYear();
  let mth = addZero(d.getMonth() + 1);
  let day = addZero(d.getDate());
  let hour = addZero(d.getHours() + 1);
  let min = addZero(d.getMinutes());

  let timestamp = day + "-" + mth + "-" + year + " " + hour + ":" + min;

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  return timestamp;
}
