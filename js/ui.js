const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const highTasks = document.getElementById("highTasks");
export function renderTasks(tasks, keyword = "") {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <p class="empty">
                No Tasks Available.
            </p>
        `;
        return;
    }
    taskList.innerHTML = "";
    tasks.forEach(task => {
        taskList.innerHTML += `
            <div class="task-card ${task.completed ? "completed" : ""}"
                 draggable="true"
                 data-id="${task.id}">
                <h3>
                    ${highlightText(task.title, keyword)}
                </h3>
                <p>
                    ${highlightText(task.description, keyword)}
                </p>
                <p>
                    <strong>Priority:</strong>
                    ${task.priority}
                </p>
                <p>
                    <strong>Due Date:</strong>
                    ${task.dueDate || "Not Set"}
                </p>
                <div class="task-buttons">
                    <button
                        class="complete-btn"
                        data-id="${task.id}">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                        class="edit-btn"
                        data-id="${task.id}">
                        Edit
                    </button>
                    <button
                        class="delete-btn"
                        data-id="${task.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
}
export function updateStats(tasks) {
    totalTasks.textContent = tasks.length;
    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;
    completedTasks.textContent =
        tasks.filter(task => task.completed).length;
    highTasks.textContent =
        tasks.filter(task => task.priority === "High").length;
}
function highlightText(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
   return text.replace(regex,"<mark>$1</mark>");
}
export function showLoading() {
    document
        .getElementById("loading")
        .classList.remove("hidden");
}
export function hideLoading() {
    document
        .getElementById("loading")
        .classList.add("hidden");
}