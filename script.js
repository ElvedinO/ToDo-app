'use strict';

//Selectors
const showPopup = document.querySelector('.open-add');
const popUp = document.querySelector('.popup');
const overlay = document.querySelector('.overlay');
const todoList = document.querySelector('.todo-list');
const createTodo = document.querySelector('.add');
const inputVal = document.getElementById('inputVal');

const activeBtn = document.getElementById('activeBtn');
const completedBtn = document.getElementById('completedBtn');
const allBtn = document.getElementById('allBtn');

//Event listeners
activeBtn.addEventListener('click', showActiveTodos);
completedBtn.addEventListener('click', showCompletedTodos);
allBtn.addEventListener('click', showAllTodos);

document.addEventListener('DOMContentLoaded', appendTodoToDOM);
document.addEventListener('DOMContentLoaded', showActiveTodos);
createTodo.addEventListener('click', createTask);
showPopup.addEventListener('click', openPopup);
overlay.addEventListener('click', closePopup);

//Functions

function openPopup() {
  popUp.classList.remove('d-none');
  popUp.classList.add('d-flex');
  overlay.classList.remove('d-none');
}

function closePopup() {
  popUp.classList.add('d-none');
  overlay.classList.add('d-none');
  location.reload();
}

function showActiveTodos() {
  clearTodoList();
  activeBtn.classList.add('active');
  completedBtn.classList.remove('active');
  allBtn.classList.remove('active');
  const todos = getLocalTodos();
  todos.forEach((todo) => {
    if (!todo.completed) {
      appendTodoToDOM(todo);
    }
  });
}

function showCompletedTodos() {
  clearTodoList();
  completedBtn.classList.add('active');
  activeBtn.classList.remove('active');
  allBtn.classList.remove('active');
  const todos = getLocalTodos();
  todos.forEach((todo) => {
    if (todo.completed) {
      appendTodoToDOM(todo);
    }
  });
}

function showAllTodos() {
  clearTodoList();
  allBtn.classList.add('active');
  activeBtn.classList.remove('active');
  completedBtn.classList.remove('active');
  const todos = getLocalTodos();
  todos.forEach((todo) => {
    appendTodoToDOM(todo);
  });
}

function clearTodoList() {
  // Clear the existing todos in the todoList
  todoList.innerHTML = '';
}

function handleEditButtonClick(todo, newTodoInput) {
  const editButton = event.target;

  if (editButton.innerHTML === 'Uredi') {
    editButton.innerHTML = 'Spremi';
    newTodoInput.removeAttribute('readonly');
    newTodoInput.focus();
  } else {
    editButton.innerHTML = 'Uredi';
    newTodoInput.setAttribute('readonly', 'readonly');

    // Save the updated value in local storage
    saveLocalTodos(newTodoInput.value, todo.completed, todo.text);
    location.reload();
  }
}

function createTodoDiv(todo, isCompleted) {
  const todoDiv = document.createElement('div');
  todoDiv.classList.add(
    'd-flex',
    'justify-content-between',
    'mb-1',
    'me-4',
    'ms-4',
    'ps-3',
    'mt-3',
    'bg-light',
    'rounded-5',
    'bg-opacity-75'
  );

  const newTodoInput = document.createElement('input');
  newTodoInput.classList.add(
    'value-text',
    'text-wrap',
    'text-dark',
    'border-0',
    'new-input-bg',
    'w-100'
  );
  newTodoInput.type = 'text';
  newTodoInput.value = todo.text;
  newTodoInput.setAttribute('readonly', 'readonly');

  todoDiv.appendChild(newTodoInput);

  const checkButton = Object.assign(document.createElement('button'), {
    className: 'complete-btn btn btn-outline-success rounded-5 ',
    innerHTML: '<i class="bi bi-check-circle-fill"></i>',
    onclick: () => {
      toggleCompletionStatus(todoDiv, newTodoInput.value);
    },
  });

  const editButton = document.createElement('button');
  editButton.className = 'btn btn-outline-primary rounded-5 ms-1 me-1';
  editButton.innerHTML = 'Uredi';
  editButton.addEventListener('click', () => {
    handleEditButtonClick(todo, newTodoInput);
  });

  const deleteButton = Object.assign(document.createElement('button'), {
    className: 'btn btn-outline-danger rounded-5',
    innerHTML: '<i class="bi bi-trash-fill"></i>',
    onclick: () => {
      deleteDiv(todoDiv);
      deleteStorage(todo.text);
    },
  });

  todoDiv.appendChild(checkButton);
  todoDiv.appendChild(editButton);
  todoDiv.appendChild(deleteButton);

  // Set the 'completed' class based on the completion status
  if (isCompleted) {
    newTodoInput.classList.add('completed');
    editButton.classList.add('d-none');
    deleteButton.classList.add('ms-1');
    checkButton.innerHTML = '<i class="bi bi-arrow-return-left"></i>';
  }

  return todoDiv;
}

function appendTodoToDOM(todo) {
  const todoDiv = createTodoDiv(todo, todo.completed);
  todoList.appendChild(todoDiv);
}

function createTask() {
  const todoText = inputVal.value.trim();

  if (todoText !== '') {
    const todoDiv = createTodoDiv({ text: todoText }, false);
    inputVal.value = '';
    saveLocalTodos(todoText, false);
    closePopup();
    todoList.appendChild(todoDiv);
  }
}

function deleteDiv(divToDelete) {
  todoList.removeChild(divToDelete);
}

//Accesing Localstorage
function deleteStorage(todoText) {
  let todos = getLocalTodos();
  todos = todos.filter((todo) => todo.text !== todoText);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleCompletionStatus(todoDiv, todoText) {
  todoDiv.classList.toggle('completed');

  let todos = getLocalTodos();
  todos = todos.map((todo) => {
    if (todo.text === todoText) {
      return { text: todo.text, completed: !todo.completed };
    }

    return todo;
  });

  localStorage.setItem('todos', JSON.stringify(todos));
  location.reload();
}

function getLocalTodos() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}

function saveLocalTodos(todoText, completed, oldTodoText) {
  let todos = getLocalTodos();

  // If oldTodoText is provided, it means we are editing an existing todo
  if (oldTodoText) {
    todos = todos.map((todo) => {
      if (todo.text === oldTodoText) {
        return { text: todoText, completed: completed };
      }
      return todo;
    });
  } else {
    todos.push({ text: todoText, completed: completed });
  }

  localStorage.setItem('todos', JSON.stringify(todos));
}
