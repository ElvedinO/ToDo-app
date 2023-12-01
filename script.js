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

document.addEventListener('DOMContentLoaded', getTodos);
createTodo.addEventListener('click', createTask);
showPopup.addEventListener('click', openPopup);
overlay.addEventListener('click', closePopup);

//Functions
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

function appendTodoToDOM(todo) {
  const todoDiv = document.createElement('div');
  todoDiv.classList.add(
    'd-flex',
    'justify-content-between',
    'mb-1',
    'me-4',
    'ms-4',
    'ps-3',
    'mt-3',
    'bg-dark',
    'rounded-5',
    'bg-opacity-10',
    'todo'
  );

  const newTodo = document.createElement('li');
  newTodo.classList.add('value-text', 'text-wrap', 'text-light');
  newTodo.innerText = todo.text;
  todoDiv.appendChild(newTodo);

  const checkButton = Object.assign(document.createElement('button'), {
    className: 'complete-btn btn btn-outline-success rounded-5 me-1',
    innerHTML: '<i class="bi bi-check-circle-fill"></i>',
    onclick: () => {
      toggleCompletionStatus(todoDiv, todo.text);
    },
  });
  todoDiv.appendChild(checkButton);

  const deleteButton = Object.assign(document.createElement('button'), {
    className: 'btn btn-outline-danger rounded-5',
    innerHTML: '<i class="bi bi-trash-fill"></i>',
    onclick: () => {
      deleteDiv(todoDiv);
      deleteStorage(todo.text);
    },
  });
  todoDiv.appendChild(deleteButton);

  todoList.appendChild(todoDiv);

  // Set the 'completed' class based on the completion status
  if (todo.completed) {
    todoDiv.classList.add('completed');
  }
}

function clearTodoList() {
  // Clear the existing todos in the todoList
  todoList.innerHTML = '';
}

function openPopup() {
  popUp.classList.remove('d-none');
  popUp.classList.add('d-flex');
  overlay.classList.remove('d-none');
}

function closePopup() {
  popUp.classList.add('d-none');
  overlay.classList.add('d-none');
}

function createTask() {
  const todoText = inputVal.value.trim();

  if (todoText !== '') {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add(
      'd-flex',
      'justify-content-between',
      'mb-1',
      'me-4',
      'ms-4',
      'ps-3',
      'mt-3',
      'bg-dark',
      'rounded-5',
      'bg-opacity-10',
      'todo'
    );

    const newTodo = document.createElement('li');
    newTodo.classList.add('value-text', 'text-wrap', 'text-light');
    todoDiv.appendChild(newTodo);
    newTodo.innerText = todoText;
    inputVal.value = '';

    saveLocalTodos(newTodo.innerText, false);

    const checkButton = Object.assign(document.createElement('button'), {
      className: 'complete-btn btn btn-outline-success rounded-5 me-1',
      innerHTML: '<i class="bi bi-check-circle-fill"></i>',
      onclick: () => {
        toggleCompletionStatus(todoDiv, newTodo.innerText);
      },
    });

    const deleteButton = Object.assign(document.createElement('button'), {
      className: 'btn btn-outline-danger rounded-5',
      innerHTML: '<i class="bi bi-trash-fill"></i>',
      onclick: () => {
        deleteDiv(todoDiv);
        deleteStorage(newTodo.innerText);
      },
    });

    todoDiv.appendChild(checkButton);
    todoDiv.appendChild(deleteButton);

    closePopup();
    todoList.appendChild(todoDiv);
  }
}

function deleteDiv(divToDelete) {
  todoList.removeChild(divToDelete);
}

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
}

function getLocalTodos() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}

function saveLocalTodos(todoText, completed) {
  let todos = getLocalTodos();
  todos.push({ text: todoText, completed: completed });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  let todos = getLocalTodos();
  todos.forEach((todo) => {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add(
      'd-flex',
      'justify-content-between',
      'mb-1',
      'me-4',
      'ms-4',
      'ps-3',
      'mt-3',
      'bg-dark',
      'rounded-5',
      'bg-opacity-10',
      'todo'
    );

    const newTodo = document.createElement('li');
    newTodo.classList.add('value-text', 'text-wrap', 'text-light');
    todoDiv.appendChild(newTodo);
    newTodo.innerText = todo.text;

    const checkButton = Object.assign(document.createElement('button'), {
      className: 'complete-btn btn btn-outline-success rounded-5 me-1',
      innerHTML: '<i class="bi bi-check-circle-fill"></i>',
      onclick: () => {
        toggleCompletionStatus(todoDiv, todo.text);
      },
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
    todoDiv.appendChild(deleteButton);

    if (todo.completed) {
      todoDiv.classList.add('completed');
    }

    todoList.appendChild(todoDiv);
  });
}
