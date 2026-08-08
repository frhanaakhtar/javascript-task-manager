const STORAGE_KEY = "taskManager";
const CURRENT_VERSION = 2;
export async function saveTasks(tasks) {
    return new Promise((resolve) => {
        const data = {
            version: CURRENT_VERSION,
            tasks: tasks
        };
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
        resolve();
    });
}
export async function loadTasks() {
    return new Promise((resolve) => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            resolve([]);
            return;
        }
        try {
            const parsed = JSON.parse(saved);
            // New Schema
            if (parsed.tasks) {
                const migrated = parsed.tasks.map(task => ({
                    id: task.id || Date.now(),
                    title: task.title || "",
                    description: task.description || "",
                    priority: task.priority || "Low",
                    dueDate: task.dueDate || "",
                    completed: task.completed ?? false
                }));
                resolve(migrated);
                return;
            }
            // Old Schema
            if (Array.isArray(parsed)) {
                const migrated = parsed.map(task => ({
                    id: task.id || Date.now(),
                    title: task.title || "",
                    description: task.description || "",
                    priority: task.priority || "Low",
                    dueDate: task.dueDate || "",
                    completed: task.completed ?? false
                }));
                resolve(migrated);
                return;
            }
            resolve([]);
        }
        catch {
            resolve([]);
        }
    });
}