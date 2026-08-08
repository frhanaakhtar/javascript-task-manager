const LIMIT = 20;
let undoStack = [];
let redoStack = [];
export function saveState(tasks) {
    undoStack.push(
        JSON.stringify(tasks)
    );
    if (undoStack.length > LIMIT) {
        undoStack.shift();
    }
    redoStack = [];
}
export function undo(currentTasks) {
    if (undoStack.length === 0)
        return currentTasks;
    redoStack.push(
        JSON.stringify(currentTasks)
    );
    return JSON.parse(
        undoStack.pop()
    );
}
export function redo(currentTasks) {
    if (redoStack.length === 0)
        return currentTasks;
    undoStack.push(
        JSON.stringify(currentTasks)
    );
    return JSON.parse(
        redoStack.pop()
    );
}