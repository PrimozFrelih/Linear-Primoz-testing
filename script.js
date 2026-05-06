const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  todos.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo-item";

    const text = document.createElement("span");
    text.className = "todo-text" + (todo.completed ? " completed" : "");
    text.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.completed ? "Undo" : "Done";
    toggleBtn.className = "secondary";
    toggleBtn.onclick = () => toggleTodo(todo.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTodo(todo.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "danger";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    actions.appendChild(toggleBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(text);
    item.appendChild(actions);

    todoList.appendChild(item);
  });
}

function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    alert("Task cannot be empty.");
    return;
  }

  todos.push({
    id: Date.now(),
    text,
    completed: false
  });

  todoInput.value = "";
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  const newText = prompt("Edit task:", todo.text);

  if (newText === null) return;
  if (!newText.trim()) {
    alert("Task cannot be empty.");
    return;
  }

  todo.text = newText.trim();
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

renderTodos();