// Elements
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todosList = document.querySelector(".todos-list");

// Testing code
///////////////////////////////////////////////////////////////////////////
const clear = document.querySelector(".clear");
const local = document.querySelector(".get-local");

function Data(todos, checked) {
  this.todos = todos;
  this.checked = checked;
}

clear.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.clear();
});
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
  return (
    localStorage.getItem("todos") !== null &&
    localStorage.getItem("checked") !== null
  );
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
    todo.setAttribute("contenteditable", "true");
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
      let todos = JSON.parse(localStorage.getItem("todos"));
      todos[todos.indexOf(oldText)] = todo.textContent;
      localStorage.setItem("todos", JSON.stringify(todos));
      todo.setAttribute("contenteditable", "false");
      btnConfirm.remove();
    });
  }
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
