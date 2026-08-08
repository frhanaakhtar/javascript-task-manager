export function searchTasks(tasks, keyword) {
    keyword = keyword.trim().toLowerCase();
    if (!keyword) return tasks;
    return tasks.filter(task =>
        task.title.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword)
    );
}
export function filterTasks(tasks, filter) {
    switch (filter) {
        case "completed":
            return tasks.filter(task => task.completed);
        case "pending":
            return tasks.filter(task => !task.completed);
        default:
            return tasks;
    }
}
export function sortTasks(tasks, sort) {
    const sorted = [...tasks];
    switch (sort) {
        case "oldest":
            sorted.sort((a, b) => a.id - b.id);
            return sorted;
        case "priority":
            const priorityOrder = {
                High: 3,
                Medium: 2,
                Low: 1
            };
            sorted.sort(
                (a, b) =>
                priorityOrder[b.priority] -
                priorityOrder[a.priority]
            );
            return sorted;
        case "date":
            sorted.sort(
                (a, b) =>
                new Date(a.dueDate || 0) -
                new Date(b.dueDate || 0)
            );
            return sorted;
        default:
            return tasks;
    }
}