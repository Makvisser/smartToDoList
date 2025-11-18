const tasks = [
    { id: 1, text: "Доделать стилизацию", completed: false },
    { id: 2, text: "сделать стилизацию формы добавления и еще немножко", completed: false },
    { id: 3, text: "Add to function add", completed: false },
    { id: 4, text: "to do commit", completed: false },
    { id: 5, text: "add to function edit", completed: false },
    { id: 6, text: "add to function delete", completed: false },
    { id: 7, text: "add to filter", completed: false },
    { id: 8, text: "Доделать стилизацию", completed: false },
    { id: 9, text: "сделать стилизацию формы добавлени", completed: false },
    { id: 10, text: "Add to function add", completed: false },
    { id: 11, text: "to do commit", completed: false },
    { id: 12, text: "add to function edit", completed: false },
    { id: 13, text: "add to function delete", completed: false },
    { id: 14, text: "add to filter", completed: false },
    { id: 15, text: "Add to function add", completed: false },
    { id: 16, text: "to do commit", completed: false },
    { id: 17, text: "add to function edit", completed: false },
    { id: 18, text: "add to function delete", completed: false },
    { id: 19, text: "add to filter", completed: false }
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


const addBtn = document.querySelector('.add-btn');
const addTaskForm = document.querySelector('.addTask');

addBtn.addEventListener('click', function () {
    addTaskForm.hidden = false;
});

const searchInput = document.querySelector('.search-input');
// const searchBtn = document.querySelector('search-btn');

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
        renderTasks(tasks); // fallback на все задачи
    }
});