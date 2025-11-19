const tasks = [
    { id: 1, text: "Доделать стилизацию", completed: false },
    { id: 2, text: "сделать стилизацию формы добавления и еще немножко", completed: false },
    { id: 3, text: "Add to function add", completed: true },
    { id: 4, text: "to do commit", completed: true },
    { id: 5, text: "add to function edit", completed: true },
    { id: 6, text: "add to function delete", completed: true },
    { id: 7, text: "add to filter", completed: true },
    { id: 8, text: "Доделать стилизацию", completed: false },
    { id: 9, text: "сделать стилизацию формы добавлени", completed: false },
    { id: 10, text: "Add to function add", completed: true },
    { id: 11, text: "to do commit", completed: true },
    { id: 12, text: "add to function edit", completed: true },
    { id: 13, text: "add to function delete", completed: true },
    { id: 14, text: "add to filter", completed: true },
    { id: 15, text: "Add to function add", completed: true },
    { id: 16, text: "to do commit", completed: true },
    { id: 17, text: "add to function edit", completed: true },
    { id: 18, text: "add to function delete", completed: true },
    { id: 19, text: "add to filter", completed: true }
]

function renderTasks(taskToRender = tasks) {
    if (!Array.isArray(taskToRender)) {
        console.log('taskToRender is not array, using default tasks');
        taskToRender = tasks;
    }
    const tasksList = document.querySelector('.tasks-list');
    const template = document.getElementById('task-template');

    tasksList.innerHTML = '';

    taskToRender.forEach(task => {
        const taskElement = template.content.cloneNode(true);
        const checkbox = taskElement.querySelector('.task-checkbox');
        const label = taskElement.querySelector('.task-text');

        checkbox.id = `task-${task.id}`;
        checkbox.checked = task.completed;
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.text;

        tasksList.appendChild(taskElement);
    });
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', renderTasks);

function addNewTask(text) {
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
}
const addBtn = document.querySelector('.add-btn');

addBtn.addEventListener('click', function () {
    addTaskForm.hidden = false;
    const backdrop = document.createElement('div');
    backdrop.className = 'addTask-backdrop';
    document.body.appendChild(backdrop);
});

const addTaskForm = document.querySelector('.addTask');
const taskInput = addTaskForm.querySelector('input[type="text"]');
const cancelBtn = addTaskForm.querySelector('button[type="button"]');
const submitBtn = addTaskForm.querySelector('button[type="submit"]');

submitBtn.addEventListener('click', function (event) {
    event.preventDefault();

    addNewTask(taskInput.value);
    taskInput.value = '';
    closeAddTaskForm();
})

function closeAddTaskForm() {
    addTaskForm.hidden = true;
    const backdrop = document.querySelector('.addTask-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

cancelBtn.addEventListener('click', function () {
    taskInput.value = '';
    closeAddTaskForm();
});

const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('input', function (event) {
    const searchValue = event.target.value.toLowerCase();
    console.log(searchValue);

    let foundItems;

    if (searchValue === '') {
        foundItems = tasks;
    } else {
        foundItems = tasks.filter(item =>
            item.text.toLowerCase().includes(searchValue));
    }

    console.log(foundItems);

    if (Array.isArray(foundItems)) {
        renderTasks(foundItems);
    } else {
        console.error('foundItems is not an array:', foundItems);
        renderTasks(tasks);
    }
});

const filterSelect = document.querySelector('.filter-select');
filterSelect.addEventListener('change', function (event) {
    const filterValue = event.target.value;
    console.log(filterValue);

    let filterItems;
    if (filterValue === "all") {
        filterItems = tasks;
    };
    if (filterValue === "complete") {
        filterItems = tasks.filter(item =>
            item.completed === true);
    }
    if (filterValue === "incomplete") {
        filterItems = tasks.filter(item =>
            item.completed === false);
    }

    renderTasks(filterItems);
});

