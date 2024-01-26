document.body.insertAdjacentHTML("afterbegin", `
    <button id="add-button">Add todo</button>
    <section id="todo-list"></section>
`);
const todoList = document.getElementById("todo-list");
const addButton = document.getElementById("add-button");

function addTodoEntry(todoEntry) {
    let html = `<article class="todo-entry">
        <span class="description">${todoEntry.description}</span>
        <span class="up icon material-symbols-outlined">keyboard_arrow_up</span>
        <span class="down icon material-symbols-outlined">keyboard_arrow_down</span>
        <span class="delete icon material-symbols-outlined">delete</span>
        <span class="done icon material-symbols-outlined">done_outline</span>
    </article>`;

    let ready1 = firstReady();
    if (ready1)
        ready1.insertAdjacentHTML("beforebegin", html);
    else
        todoList.insertAdjacentHTML("beforeend", html);
}

addButton.addEventListener("click", () => {
    const todoText = window.prompt("What to do:");
    addTodoEntry({ description: todoText });
});

function moveOneStep(entry, dir) {
    if (dir > 0)
        entry.nextElementSibling?.insertAdjacentElement("afterend", entry);
    else if (dir < 0) {
        entry.previousElementSibling?.insertAdjacentElement("beforebegin", entry);
    }
}

function getParentIcon(elem) {
    if (!elem || elem.classList.contains("icon"))
        return elem;
    return getParentEntry(elem.parentElement);
}
function getParentEntry(elem) {
    if (!elem || elem.tagName === "ARTICLE")
        return elem;
    return getParentEntry(elem.parentElement);
}
function firstReady() {
    for (let i = 0; i < todoList.children.length; i++) {
        if (todoList.children.item(i).classList.contains("ready"))
            return todoList.children.item(i);
    }
    return null;
}
function done(entry) {
    if (entry.classList.contains("ready"))
        return;

    let ready1 = firstReady();
    if (ready1)
        ready1.insertAdjacentElement("beforebegin", entry);
    else
        todoList.insertAdjacentElement("beforeend", entry);

    entry.classList.add("ready");

    entry.children.item(0).insertAdjacentHTML("afterbegin", '<span class="material-symbols-outlined">done</span>');
    //entry.children.item(0).innerHTML = '<span class="material-symbols-outlined">done</span>';
    // let desc = entry.children.item(0);
    // desc.innerHTML = '<span class="material-symbols-outlined">done</span>' + desc.innerText;
}
todoList.addEventListener("click", e => {
    const icon = getParentIcon(e.target);
    if (!icon) return;
    const entry = getParentEntry(icon);
    if (icon.classList.contains("up"))
        moveOneStep(entry, -1);
    else if (icon.classList.contains("down"))
        moveOneStep(entry, 1);
    else if (icon.classList.contains("delete"))
        entry.remove();
    else if (icon.classList.contains("done"))
        done(entry);
});
document.querySelectorAll(".up").forEach


addTodoEntry({description: "1. Do Todo list"});
addTodoEntry({description: "2. Learn React"});
addTodoEntry({description: "3. View Pluralsight course"});
addTodoEntry({description: "4. Fyra"});
addTodoEntry({description: "5. Fem"});
addTodoEntry({description: "6. Sex"});
addTodoEntry({description: "7. Sju"});
addTodoEntry({description: "8. Åtta"});
addTodoEntry({description: "9. Nio"});
addTodoEntry({ description: "10. Tio" });
for (let i = 11; i < 100; i++) {
    addTodoEntry({ description: `${i}-${i}-${i}-${i}-${i}-${i}` });
}

//Click visual response on icons (BAD!!!)
document.querySelectorAll(".icon").forEach(i => {
    i.addEventListener("click", e => {
        let preBkg = e.target.style.backgroundColor;
        e.target.style.backgroundColor = "yellow";
        setTimeout(() => e.target.style.backgroundColor = preBkg, 100);
    });
});