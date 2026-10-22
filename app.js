import { createTask, deleteTask, loadTasks, saveTasks, updateTask } from "./storage.js";

const elements = {
  form: document.querySelector("#task-form"), input: document.querySelector("#task-title"),
  list: document.querySelector("#task-list"), empty: document.querySelector("#empty"),
  message: document.querySelector("#message"), remaining: document.querySelector("#remaining"), today: document.querySelector("#today"),
};
let tasks = loadTasks(localStorage);

elements.today.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());

function persist() {
  try { saveTasks(localStorage, tasks); return true; }
  catch { elements.message.textContent = "浏览器无法保存数据，请检查隐私或存储设置。"; return false; }
}

function render() {
  elements.list.replaceChildren();
  for (const task of tasks) {
    const item = document.createElement("li"); item.className = `task-item${task.completed ? " completed" : ""}`;
    const toggle = document.createElement("button"); toggle.className = "toggle"; toggle.type = "button";
    toggle.setAttribute("aria-label", task.completed ? `恢复“${task.title}”` : `完成“${task.title}”`);
    toggle.addEventListener("click", () => { tasks = updateTask(tasks, task.id, !task.completed); persist(); render(); });
    const title = document.createElement("span"); title.className = "task-title"; title.textContent = task.title;
    const remove = document.createElement("button"); remove.className = "delete"; remove.type = "button"; remove.textContent = "删除";
    remove.setAttribute("aria-label", `删除“${task.title}”`);
    remove.addEventListener("click", () => { tasks = deleteTask(tasks, task.id); persist(); render(); });
    item.append(toggle, title, remove); elements.list.append(item);
  }
  elements.empty.hidden = tasks.length > 0;
  elements.remaining.textContent = String(tasks.filter((task) => !task.completed).length);
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault(); elements.message.textContent = "";
  try {
    tasks.unshift(createTask(elements.input.value));
    if (persist()) { elements.input.value = ""; elements.input.focus(); render(); }
  } catch (error) { elements.message.textContent = error.message; }
});

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
render();
