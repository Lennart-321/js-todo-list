class TodoEntry {
    id;
    description;
    created;
    isDone;
    constructor(description, id, created, isDone) {
        this.description = description;
        this.id = id ? id : nextEntryId++;
        this.created = created ? created : Date.now();
        this.isDone = typeof isDone === "boolean" ? isDone : false;
    }
}

const todoList = document.getElementById("todo-list");
console.log(todoList);
const addButton = document.getElementById("add-button");

let nextEntryId = 1;

// document.body.insertAdjacentHTML(
//     "afterbegin",
//     `
//     <button id="add-button">Add todo</button>
//     <section id="todo-list"></section>
// `
// );
let all;
let temp = window.localStorage.getItem("todoListAllEntries");
console.log("From localStorage:", temp);
function setNextId() {
    let max = 0;
    all.forEach(e => {
        if (e.id > max) max = e.id;
    });
    nextEntryId = max + 1;
}
if (!temp) {
    all = [];
} else {
    all = JSON.parse(temp);
    console.log("Loaded:", all);
    setNextId();
    let html = "";
    all.forEach(e => (html += makeEntryHTML(e)));
    todoList.insertAdjacentHTML("beforeend", html);
}
function store() {
    const json = JSON.stringify(all);
    console.log(json);
    window.localStorage.setItem("todoListAllEntries", json);
}

function findEntryIx(id) {
    for (let i = 0; i < all.length; i++) {
        if (all[i].id == id) return i;
    }
}

function addTodoEntry(todoEntry) {
    const insertedAt = addTodoEntryHTML(todoEntry);
    all.splice(insertedAt, 0, todoEntry);
    store();
}
function makeEntryHTML(todoEntry) {
    return `<article id="${todoEntry.id}" class="todo-entry${todoEntry.isDone ? " ready" : ""}">
        <span class="description">${todoEntry.description}</span>
        <span>&nbsp;${todoEntry.created}</span>
        <span class="up icon material-symbols-outlined">keyboard_arrow_up</span>
        <span class="down icon material-symbols-outlined">keyboard_arrow_down</span>
        <span class="delete icon material-symbols-outlined">delete</span>
        <span class="done icon material-symbols-outlined">done_outline</span>
    </article>`;
}
function addTodoEntryHTML(todoEntry) {
    let html = makeEntryHTML(todoEntry);
    let [ix, ready1] = firstReady();
    if (ready1) ready1.insertAdjacentHTML("beforebegin", html);
    else todoList.insertAdjacentHTML("beforeend", html);

    return ix >= 0 ? ix : todoList.length - 1;
}

addButton.addEventListener("click", () => {
    const todoText = window.prompt("What to do:");
    addTodoEntry(new TodoEntry(todoText));
});

function moveOneStep(entry, dir) {
    if (dir > 0) {
        entry.nextElementSibling?.insertAdjacentElement("afterend", entry);
    } else if (dir < 0) {
        entry.previousElementSibling?.insertAdjacentElement("beforebegin", entry);
    }

    let ixA = findEntryIx(entry.id);
    let tmp = all[ixA];
    all[ixA] = all[ixA + dir];
    all[ixA + dir] = tmp;

    store();
}

function getParentIcon(elem) {
    if (!elem || elem.classList.contains("icon")) return elem;
    return getParentEntry(elem.parentElement);
}
function getParentEntry(elem) {
    if (!elem || elem.tagName === "ARTICLE") return elem;
    return getParentEntry(elem.parentElement);
}
function firstReady() {
    for (let i = 0; i < todoList.children.length; i++) {
        if (todoList.children.item(i).classList.contains("ready")) return [i, todoList.children.item(i)];
    }
    return [-1, null];
}
function done(entry) {
    if (entry.classList.contains("ready")) return;

    let ixA = findEntryIx(entry.id);
    let [ixR, ready1] = firstReady();
    //console.log("ERROR: Entry index mismatch", ix1, ix2, entry.description);
    if (ready1) {
        ready1.insertAdjacentElement("beforebegin", entry);
        all.splice(ixR, 0, all[ixA]);
    } else {
        todoList.insertAdjacentElement("beforeend", entry);
        all.push(all[ixA]);
    }
    all.splice(ixA, 1);

    entry.classList.add("ready");
    all[ixA].isDone = true;

    entry.children.item(0).insertAdjacentHTML("afterbegin", '<span class="material-symbols-outlined">done</span>');
    //entry.children.item(0).innerHTML = '<span class="material-symbols-outlined">done</span>';
    // let desc = entry.children.item(0);
    // desc.innerHTML = '<span class="material-symbols-outlined">done</span>' + desc.innerText;

    store();
}
function remove(entry) {
    let ix = findEntryIx(entry.id);
    entry.remove();
    all.splice(ix, 1);
    store();
}
todoList.addEventListener("click", e => {
    const icon = getParentIcon(e.target);
    if (!icon) return;
    const entry = getParentEntry(icon);
    if (icon.classList.contains("up")) moveOneStep(entry, -1);
    else if (icon.classList.contains("down")) moveOneStep(entry, 1);
    else if (icon.classList.contains("delete")) entry.remove();
    else if (icon.classList.contains("done")) done(entry);
});
document.querySelectorAll(".up").forEach;

// addTodoEntry({ description: "1. Do Todo list" });
// addTodoEntry({ description: "2. Learn React" });
// addTodoEntry({ description: "3. View Pluralsight course" });
// addTodoEntry({ description: "4. Fyra" });
// addTodoEntry({ description: "5. Fem" });
// addTodoEntry({ description: "6. Sex" });
// addTodoEntry({ description: "7. Sju" });
// addTodoEntry({ description: "8. Åtta" });
// addTodoEntry({ description: "9. Nio" });
// addTodoEntry({ description: "10. Tio" });
// for (let i = 11; i < 100; i++) {
//     addTodoEntry({ description: `${i}-${i}-${i}-${i}-${i}-${i}` });
// }

//Click visual response on icons (BAD!!!)
document.querySelectorAll(".icon").forEach(i => {
    i.addEventListener("click", e => {
        let preBkg = e.target.style.backgroundColor;
        e.target.style.backgroundColor = "yellow";
        setTimeout(() => (e.target.style.backgroundColor = preBkg), 100);
    });
});
