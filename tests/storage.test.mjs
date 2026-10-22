import test from "node:test";
import assert from "node:assert/strict";
import { createTask, deleteTask, loadTasks, saveTasks, updateTask } from "../storage.js";

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
}

test("creates, persists, updates and deletes tasks", () => {
  const storage = new MemoryStorage();
  const task = createTask("  Review   feedback  ", "task-1", "2026-10-22T00:00:00Z");
  assert.equal(task.title, "Review feedback");
  saveTasks(storage, [task]);
  assert.deepEqual(loadTasks(storage), [task]);
  const updated = updateTask([task], task.id, true);
  assert.equal(updated[0].completed, true);
  assert.deepEqual(deleteTask(updated, task.id), []);
});

test("rejects invalid titles and ignores corrupt storage", () => {
  assert.throws(() => createTask("  "), /请输入/);
  assert.throws(() => createTask("x".repeat(121)), /120/);
  assert.deepEqual(loadTasks({ getItem: () => "broken" }), []);
});
