// Elements
const todoInput = document.querySelector(".todo-input");
const addTodoBtn = document.querySelector(".add-todo");
const todosList = document.querySelector(".todos-list");

// Event listeners
document.addEventListener("DOMContentLoaded", fillContent);
addTodoBtn.addEventListener("click", addTodo);
todosList.addEventListener("click", deleteTodo);
todosList.addEventListener("click", editTodo);
todosList.addEventListener("click", checkCompleted);

// Functions
function fillContent() {
  // Check if localStorage is not empty and create Todos
  if (checkStorage("todos")) {
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

function checkStorage(item) {
  // Check if localStorage is empty
  return localStorage.getItem(item) !== null;
}

function saveToLocal(todo) {
  let todos;
  if (checkStorage("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
  } else {
    todos = [];
    checked = [];
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
  let todo = e.target.parentElement.children[1];
  if (e.target.classList.contains("form-check-input")) {
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
  let checked, todos, indexOfTodo;
  if (checkStorage("checked")) {
    checked = JSON.parse(localStorage.getItem("checked"));
  } else {
    checked = [];
  }
  todos = JSON.parse(localStorage.getItem("todos"));
  indexOfTodo = todos.indexOf(todo);
  console.log("Todo Index: " + indexOfTodo);
  if (isChecked) {
    if (checked[indexOfTodo] !== null) {
      //   checked[indexOfTodo] = "true";
      // Work on array methods to save bool to array on exact position
      checked.splice(indexOfTodo, 0, "true");
    } else {
      checked.splice(indexOfTodo, 1, "true");
    }
    console.log(checked);
  }

  //   localStorage.setItem("checked", JSON.stringify(checked));
}
