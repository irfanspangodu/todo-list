const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const li = document.createElement("li");
    li.textContent = taskText;

    // Toggle complete on click
    li.addEventListener("click", () => {
        li.classList.toggle("completed")
    });

    // Right-click to delete 
    li.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        li.remove();
    });

    taskList.appendChild(li);
    taskInput.value = "";
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load tasks on page load
window.onload = () => {
    tasks.forEach(task => createTaskElement(task.text, task.completed));
};

addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskElement(taskText, false);
    tasks.push({
        text: taskText, 
        completed: false
    });
    updateLocalStorage();
    taskInput.value = "";
});

function createTaskElement(text, completed) {
    const li = document.createElement("li");
    li.textContent = text;
    if (completed) li.classList.add("completed");

    li.addEventListener("click", () => {
        li.classList.toggle("completed");
        updateTaskStatus(text);
        updateLocalStorage();
    });

    li.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        li.remove();
        deleteTask(text);
        updateLocalStorage();
    });

    taskList.appendChild(li);
}

function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStatus(taskText) {
    tasks = tasks.map(task =>
        task.text === taskText ? {
            ...task, 
            completed: !task.completed
        } : task
    );
}

function deleteTask(taskText) {
    tasks = tasks.filter(task => task.text !== taskText);
}