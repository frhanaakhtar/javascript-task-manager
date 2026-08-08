import { searchTasks, filterTasks, sortTasks } from "./search.js";
import { saveTasks, loadTasks } from "./storage.js";
import {
    renderTasks,
    updateStats,
    showLoading,
    hideLoading
} from "./ui.js";
import { enableDrag } from "./drag.js";
import { saveState, undo, redo } from "./history.js";
// =========================//DOM ELEMENTS//=========================
const form = document.getElementById("taskForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filter = document.getElementById("filter");
const sort = document.getElementById("sort");
const clearSearch = document.getElementById("clearSearch");
//=========================//URL PARAMETERS//=========================
const params = new URLSearchParams(window.location.search);
searchInput.value = params.get("search") || "";
filter.value = params.get("filter") || "all";
sort.value = params.get("sort") || "newest";
// =========================//TASK DATA//=========================
let tasks = [];
//=========================//EDIT MODE//=========================
let editingId = null;
//=========================//INITIALIZE APP//=========================
init();
async function init() {
    showLoading();
    try {
        tasks = await loadTasks();
        render();
    } catch (error) {
        console.error("Failed to load tasks:", error);
    } finally {
        hideLoading();
    }
}
//=========================//ADD / UPDATE TASK//=========================
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskTitle = title.value.trim();
    if (!taskTitle) {
        alert("Please enter a task title.");
        title.focus();
        return;
    }
    // UPDATE EXISTING TASK
    if (editingId !== null) {
        saveState(tasks);
        tasks = tasks.map(task => {
            if (task.id === editingId) {
                return {
                    ...task,
                    title: taskTitle,
                    description: description.value.trim(),
                    priority: priority.value,
                    dueDate: dueDate.value
                };
            }
            return task;
        });
        editingId = null;
    }
    // ADD NEW TASK
    else {
        saveState(tasks);
        const newTask = {
            id: Date.now(),
            title: taskTitle,
            description: description.value.trim(),
            priority: priority.value,
            dueDate: dueDate.value,
            completed: false
        };
        tasks.push(newTask);
    }
    await saveTasks(tasks);
    form.reset();
    render();
});
//=========================//TASK BUTTONS//========================
taskList.addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);
// =====================//DELETE//=====================
    if (button.classList.contains("delete-btn")) {
        saveState(tasks);
        tasks = tasks.filter(task => task.id !== id);
        await saveTasks(tasks);
        render();
        return;
    }
//=====================//COMPLETE / UNDO//=====================
    if (button.classList.contains("complete-btn")) {
        saveState(tasks);
        tasks = tasks.map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }
            return task;
        });
        await saveTasks(tasks);
        render();
        return;
    }
//=====================//EDIT//=====================
    if (button.classList.contains("edit-btn")) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;
        title.value = task.title;
        description.value = task.description;
        priority.value = task.priority;
        dueDate.value = task.dueDate;
        editingId = id;
        title.focus();
        return;
    }
});
// =========================//SEARCH//=========================
let searchTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        render();
    }, 300);
});
// =========================//FILTER//=========================
filter.addEventListener("change", () => {
    render();
});
// =========================//SORT//=========================
sort.addEventListener("change", () => {
    render();
});
// =========================// CLEAR SEARCH / FILTER// =========================
clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    filter.value = "all";
    sort.value = "newest";
    render();
});
// =========================//RENDER// =========================
function render() {
    let filteredTasks = [...tasks];
    // SEARCH
    filteredTasks = searchTasks(
        filteredTasks,
        searchInput.value
    );
    // FILTER
    filteredTasks = filterTasks(
        filteredTasks,
        filter.value
    );
    // SORT
    filteredTasks = sortTasks(
        filteredTasks,
        sort.value
    );
// =====================// SAVE FILTERS IN URL// =====================
    const params = new URLSearchParams();
    if (searchInput.value) {
        params.set("search", searchInput.value);
    }
    if (filter.value !== "all") {
        params.set("filter", filter.value);
    }
    if (sort.value !== "newest") {
        params.set("sort", sort.value);
    }
    const query = params.toString();
    history.replaceState(
        null,
        "",
        query ? `?${query}` : window.location.pathname
    );
//=====================//DISPLAY// =====================
    renderTasks(
        filteredTasks,
        searchInput.value
    );
    updateStats(tasks);
//=====================//DRAG & DROP//=====================
    enableDrag(
        taskList,
        tasks,
        saveTasks,
        render
    );
}
// =========================//KEYBOARD SHORTCUTS//=========================
document.addEventListener("keydown", async (e) => {
    // CTRL + Z
    if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        const previousTasks = undo(tasks);
        if (previousTasks !== tasks) {
            tasks = previousTasks;
            await saveTasks(tasks);
            render();
        }
    }
    // CTRL + Y
    if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        const nextTasks = redo(tasks);
        if (nextTasks !== tasks) {
            tasks = nextTasks;
            await saveTasks(tasks);
            render();
        }
    }
});