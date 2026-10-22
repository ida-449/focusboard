export const STORAGE_KEY = "focusboard.tasks.v1";

export function loadTasks(storage) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter(validTask) : [];
  } catch {
    return [];
  }
}

export function saveTasks(storage, tasks) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createTask(title, id = crypto.randomUUID(), now = new Date().toISOString()) {
  const normalized = typeof title === "string" ? title.trim().replace(/\s+/g, " ") : "";
  if (!normalized) throw new Error("请输入任务名称。");
  if (normalized.length > 120) throw new Error("任务名称不能超过 120 个字符。");
  return { id, title: normalized, completed: false, createdAt: now };
}

export function updateTask(tasks, id, completed) {
  if (typeof completed !== "boolean") throw new Error("任务状态无效。");
  return tasks.map((task) => task.id === id ? { ...task, completed } : task);
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

function validTask(task) {
  return task && typeof task.id === "string" && typeof task.title === "string" && typeof task.completed === "boolean";
}
