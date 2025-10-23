const tasks = [
    {id: 1, text: "Доделать стилизацию", completed: false},
    {id: 2, text: "сделать стилизацию формы добавлени", completed: false},
    {id: 3, text: "Add to function add", completed: false},
    {id: 4, text: "to do commit", completed: false},
    {id: 5, text: "add to function edit", completed: false},
    {id: 6, text: "add to function delete", completed: false},
    {id: 7, text: "add to filter", completed: false}
]

function renderTasks() {
    const tasksList = document.querySelector('.tasks-list');
    const template = document.getElementById('task-template');
    
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
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