const firebaseConfig = {
    apiKey: "AIzaSyCCwXT0H6y5R_DLyX5Ra1ak6Yhlwb5xuKE",
    authDomain: "todo-list-88530.firebaseapp.com",
    projectId: "todo-list-88530",
    storageBucket: "todo-list-88530.firebasestorage.app",
    messagingSenderId: "820286679484",
    appId: "1:820286679484:web:cca7d8a276519b0edf23b9",
    measurementId: "G-6ZP6302WC2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

console.log('Firebase initialized!', db);

let tasks = [];

async function loadTasksFromFirestore() {
    try {
        const snapshot = await db.collection('tasks').get();
        tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderTasks();
    } catch (error) {
        console.log('Error loading tasks:', error);
    }
}

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
        const editBtn = taskElement.querySelector('.edit');
        const deleteBtn = taskElement.querySelector('.delete');

        checkbox.id = `task-${task.id}`;
        checkbox.checked = task.completed;
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.text;

        // Обработчик для чекбокса
        checkbox.addEventListener('change', () => {
            updateTaskStatus(task.id, checkbox.checked);
        });

        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        tasksList.appendChild(taskElement);
    });
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', async function () {
    await loadTasksFromFirestore();
});

async function addNewTask(text) {
    try {
        const newTask = {
            text: text,
            completed: false,
            createAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('tasks').add(newTask);
        console.log('Task added with ID:', docRef.id)

        await loadTasksFromFirestore();
    } catch (error) {
        console.error('Error adding task:', error);
    }
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

    if (taskInput.value.trim() === '') {
        taskInput.style.borderColor = 'red';
        setTimeout(() => {
            taskInput.style.borderColor = '';
        }, 2000);
        return;
    }

    addNewTask(taskInput.value);
    taskInput.value = '';
    closeAddTaskForm();
});

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

async function deleteTask(taskId) {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'delete-confirm';
    confirmModal.innerHTML = `
        <p>Are you sure you want to delete this task?</p>
        <div class="delete-confirm-actions">
            <button class="delete-confirm-cancel">CANCEL</button>
            <button class="delete-confirm-delete">DELETE</button>
        </div>
    `;

    const backdrop = document.createElement('div');
    backdrop.className = 'addTask-backdrop';

    document.body.appendChild(backdrop);
    document.body.appendChild(confirmModal);

    return new Promise((resolve) => {
        confirmModal.querySelector('.delete-confirm-cancel').addEventListener('click', () => {
            confirmModal.remove();
            backdrop.remove();
            resolve(false);
        });

        confirmModal.querySelector('.delete-confirm-delete').addEventListener('click', async () => {
            try {
                await db.collection('tasks').doc(taskId).delete();
                await loadTasksFromFirestore();
                confirmModal.remove();
                backdrop.remove();
                resolve(true);
            } catch (error) {
                console.log('Error deleting task:', error);
                confirmModal.remove();
                backdrop.remove();
                resolve(false);
            }
        });
    });
}


async function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const taskElement = document.querySelector(`[for="task-${taskId}"]`).closest('.task-item');
    const label = taskElement.querySelector('.task-text');
    const currentText = label.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.style.cssText = `
        border: 1px solid var(--button-color);
        border-radius: 5px;
        padding: 5px 10px;
        font-family: inherit;
        font-size: inherit;
        flex: 1;
        outline: none;
    `;

    label.style.display = 'none';
    label.parentNode.insertBefore(input, label);
    input.focus();

    const saveEdit = async () => {
        const newText = input.value.trim();
        if (newText && newText !== currentText){
            try{
                await db.collection('tasks').doc(taskId).update({
                    text: newText
                });
                await loadTasksFromFirestore();
            } catch(error){
                console.log('Error updating task:', error);
            }
        }else{
            input.remove();
            label.style.display = 'block';
        }
    };

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter'){
            saveEdit();
        }
    });

    input.addEventListener('blur', saveEdit);

}

async function updateTaskStatus(taskId, completed) {
    try {
        await db.collection('tasks').doc(taskId).update({
            completed: completed
        });

        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = completed;
        }

        const filterSelect = document.querySelector('.filter-select');
        const filterValue = filterSelect.value;

        if(filterValue !== "all"){
            let filterItems;
            if(filterValue === "complete"){
                filterItems = tasks.filter(item => item.completed === true);
            } else if (filterValue === "incomplete"){
                filterItems = tasks.filter(item => item.completed === false);
            }
            renderTasks(filterItems);
        }

    } catch (error) {
        console.log('Error updating task status:', error);
    }
}