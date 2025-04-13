window.addEventListener("load", () => {
    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const clearBtn = document.getElementById("clearBtn");
    const toggleThemeBtn = document.getElementById("toggleThemeBtn");
    const taskList = document.getElementById("taskList");
    const addSound = document.getElementById("addSound");
    const deleteSound = document.getElementById("deleteSound");
    const prioritySelect = document.getElementById("prioritySelect");
    const dueDateInput = document.getElementById("dueDateInput");

    if (!taskInput || !addBtn || !clearBtn || !toggleThemeBtn || !taskList || !addSound || !deleteSound || !prioritySelect || !dueDateInput) {
        console.error("One or more elements are not found in the DOM.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.map(task => {
        return {
            ...task,
            completed: false // Initialize completed property to false
        };
    });

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
            dueDate: dueDate,
            completed: false // Initialize completed property to false
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

            li.addEventListener("touchstart", () => {
                task.completed = !task.completed;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                li.classList.toggle("completed");
            });

            li.addEventListener("click", () => {
                task.completed = !task.completed;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                li.classList.toggle("completed");
            });

            li.appendChild(deleteBtn);
            taskList.appendChild(li);

            if (task.completed) {
                li.classList.add("completed");
            }
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
            const target = e.target.closest("li");
            if (target) {
                const draggedIndex = Array.from(taskList.children).indexOf(draggedItem);
                const targetIndex = Array.from(taskList.children).indexOf(target);
                if (draggedIndex < targetIndex) {
                    tasks.splice(targetIndex + 1, 0, tasks.splice(draggedIndex, 1)[0]);
                } else {
                    tasks.splice(targetIndex, 0, tasks.splice(draggedIndex, 1)[0]);
                }
                renderTasks();
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }
    });

    // Save tasks to local storage
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    // Render tasks on page load
    renderTasks();
});
