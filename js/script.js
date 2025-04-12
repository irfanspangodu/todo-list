document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const clearBtn = document.getElementById("clearBtn");
    const toggleThemeBtn = document.getElementById("toggleThemeBtn");
    const taskList = document.getElementById("taskList");
    const addSound = document.getElementById("addSound");
    const deleteSound = document.getElementById("deleteSound");
    const prioritySelect = document.getElementById("prioritySelect");
    const dueDateInput = document.getElementById("dueDateInput");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;

        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        const task = {
            text: taskText,
            priority: priority,
            dueDate: dueDate
        };

        tasks.push(task);
        renderTasks();
        taskInput.value = "";
        dueDateInput.value = "";
        addSound.play();
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.textContent = `${task.text} - ${task.priority} - Due: ${task.dueDate}`;
            li.dataset.priority = task.priority;
            li.draggable = true;
            li.addEventListener("dragstart", () => {
                li.classList.add("dragging");
            });
            li.addEventListener("dragend", () => {
                li.classList.remove("dragging");
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                renderTasks();
                deleteSound.play();
            });

            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    addBtn.addEventListener("click", addTask);
    clearBtn.addEventListener("click", () => {
        tasks = [];
        renderTasks();
    });

    toggleThemeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });

    // Drag and Drop
    taskList.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    taskList.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedItem = document.querySelector(".dragging");
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
        }
    });

    // Save tasks to local storage
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });
});
