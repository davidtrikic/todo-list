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
document.addEventListener("DOMContentLoaded", fillContent);
addTodoBtn.addEventListener("click", addTodo);
todosList.addEventListener("click", deleteTodo);
todosList.addEventListener("click", editTodo);
todosList.addEventListener("click", checkCompleted);

// Functions
function fillContent() {
  // Check if localStorage is not empty and create Todos
  if (checkStorage()) {
    let todos, checked;
    todos = JSON.parse(localStorage.getItem("todos"));
    checked = JSON.parse(localStorage.getItem("checked"));

    todos.forEach((todo, i) => {
      createTodo(todo, i, checked);
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
  return (
    localStorage.getItem("todos") !== null &&
    localStorage.getItem("checked") !== null
  );
}

function saveToLocal(todo) {
  let todos, checked;
  if (checkStorage()) {
    todos = JSON.parse(localStorage.getItem("todos"));
    checked = JSON.parse(localStorage.getItem("checked"));
  } else {
    todos = [];
    checked = [];
  }
  todos.push(todo);
  checked[todos.indexOf(todo)] = false;
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("checked", JSON.stringify(checked));
}

// Create Todo element in DOM
function createTodo(todoContent, todoIndex, checked) {
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
  // Load checked todos
  if (todoIndex != null && checked !== null) {
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
    let todos = JSON.parse(localStorage.getItem("todos"));
    let checked = JSON.parse(localStorage.getItem("checked"));
    let todoIndex = todos.indexOf(item.parentElement.textContent);
    item.parentElement.remove(); // Remove from DOM
    // Remove todo from array and corresponding value from checked, using its index
    todos.splice(todoIndex, 1);
    checked.splice(todoIndex, 1);
    // Save modified arrays to localStorage
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("checked", JSON.stringify(checked));
  }
}

function editTodo(e) {
  let buttonsDiv = e.target.parentElement;
  if (e.target.classList.contains("edit-button")) {
    let todo = buttonsDiv.previousElementSibling.children[1];
    let oldText = todo.textContent;

    todo.setAttribute("contenteditable", "true");
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
      btnConfirm.remove();
      todo.setAttribute("contenteditable", "false");
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

function saveChecked(todo, isChecked) {
  let todos, indexOfTodo, checked;
  todos = JSON.parse(localStorage.getItem("todos"));
  indexOfTodo = todos.indexOf(todo);

  if (checkStorage()) {
    checked = JSON.parse(localStorage.getItem("checked"));
  } else {
    checked = [];
  }

  if (isChecked) {
    if (
      checked[indexOfTodo] === undefined ||
      checked[indexOfTodo] === false ||
      checked[indexOfTodo] === null
    ) {
      checked[indexOfTodo] = true;
    }
  }
  if (!isChecked) {
    checked[indexOfTodo] = false;
  }
  localStorage.setItem("checked", JSON.stringify(checked));
}
