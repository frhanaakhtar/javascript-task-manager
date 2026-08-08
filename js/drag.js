export function enableDrag(taskList, tasks, saveTasks, render) {
    let draggedId = null;
    const cards = taskList.querySelectorAll(".task-card");
    cards.forEach(card => {
        //=========================//DRAG START//=========================
        card.addEventListener("dragstart", (e) => {
            draggedId = Number(card.dataset.id);
            card.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData(
                "text/plain",
                String(draggedId)
            );
        });
        //=========================//DRAG END//=========================
        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
            draggedId = null;
            cards.forEach(item => {
                item.classList.remove("drag-over");
            });
        });
        card.addEventListener("dragenter", (e) => {
            if (Number(card.dataset.id) !== draggedId) {
                e.preventDefault();
                card.classList.add("drag-over");
            }
        });//=========================//DRAG OVER//=========================
        card.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (Number(card.dataset.id) !== draggedId) {
                card.classList.add("drag-over");
            }
        });//=========================//DRAG LEAVE//=========================
        card.addEventListener("dragleave", () => {
            card.classList.remove("drag-over");
        });
        // =========================// DROP// =========================
        card.addEventListener("drop", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            card.classList.remove("drag-over");
            const targetId = Number(card.dataset.id);
            if (draggedId === null || draggedId === targetId) return;
            const fromIndex = tasks.findIndex(
                task => task.id === draggedId
            );
            const toIndex = tasks.findIndex(
                task => task.id === targetId
            );
            if (fromIndex === -1 || toIndex === -1) return;
            const [movedTask] = tasks.splice(fromIndex, 1);
            tasks.splice(toIndex, 0, movedTask);
            await saveTasks(tasks);
            render();
        });
    });
}