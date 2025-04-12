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

const clearBtn = document.getElementById("clearBtn");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");

clearBtn.addEventListener("click", () => {
    localStorage.removeItem("tasks");
    tasks = [];
    taskList.innerHTML = "";
});

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleThemeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Apply saved theme
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        toggleThemeBtn.textContent = "Light Mode";
    }
});

const addSound = document.getElementById("addSound");
const deleteSound = document.getElementById("deleteSound");

// Play sound on adding a task
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

    addSound.play(); // Play sound
});

// Play sound on deleting a task
li.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    li.remove();
    deleteTask(text);
    updateLocalStorage();

    deleteSound.play(); // Play sound
});

let draggedItem = null;

taskList.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "LI") {
        draggedItem = e.target;
    }
});

taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest("li");
    if (target && target !== draggedItem) {
        const bounding = target.getBoundingClientRect();
        const offset = bounding.y + (bounding.height / 2);
        if (e.clientY - offset > 0) {
            target.after(draggedItem);
        } else {
            target.before(draggedItem);
        }
    }
});

taskList.addEventListener("drop", () => {
    updateTasksFromDOM();
    updateLocalStorage();
});


function updateTasksFromDOM() {
    const allItems = document.querySelectorAll("#taskList li");
    tasks = Array.from(allItems).map(li => ({
        text: li.textContent,
        completed: li.classList.contains("completed"),
        priority: li.dataset.priority || "Medium", // keep priority if added
        due: li.dataset.due || "" // keep due date if added
    }));
}

const prioritySelect = document.getElementById("prioritySelect");

addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    if (taskText === "") return;

    createTaskElement(taskText, false, priority);
    tasks.push({ text: taskText, completed: false, priority });
    updateLocalStorage();
    taskInput.value = "";
    addSound.play();
});

function createTaskElement(text, completed, priority = "Medium", due = "") {
    const li = document.createElement("li");
    li.textContent = text;
    li.dataset.priority = priority;
    li.dataset.due = due;
    if (completed) li.classList.add("completed");
    li.setAttribute("draggable", true);

    taskList.appendChild(li);
}

