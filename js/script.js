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