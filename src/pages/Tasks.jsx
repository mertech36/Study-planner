import { useState, useRef, useEffect, useMemo } from "react";
import { FiTrash2, FiCheckCircle, FiEdit3, FiX, FiCheck, FiChevronUp, FiChevronDown } from "react-icons/fi";

/* ---------- Yardımcı fonksiyonlar ---------- */

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["To Do", "In Progress", "Done"];

// "2026-10-07" -> yerel saatle Date (UTC kayması olmasın diye)
function parseDate(value) {
  if (!value) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return isNaN(d) ? null : d;
}

function formatDate(value) {
  const d = parseDate(value);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date";
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Status ile completed her zaman birlikte gider
const withStatus = (task, status) => ({ ...task, status, completed: status === "Done" });

// Dashboard'dan eklenen görevlerde priority/course/dueDate boş olabilir
const normalize = (t) => ({ ...t, priority: t.priority || "Medium", course: t.course || "", dueDate: t.dueDate || "" });

function dateTone(task) {
  const due = parseDate(task.dueDate);
  if (!due) return "none";
  if (task.completed) return "done";
  const today = startOfToday();
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";
  return "future";
}

const statusIcon = (s) => (s === "Done" ? "✅" : s === "In Progress" ? "⚡" : "🚀");

/* ---------- Düzenleme penceresi ---------- */

function EditModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(normalize(task));
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    if (!form.title.trim()) { setError("Task title is required."); return; }
    onSave(withStatus({ ...form, title: form.title.trim() }, form.status));
  };

  return (
    <div className="tk-modal-wrap">
      <div className="tk-backdrop" onClick={onClose} />
      <div className="tk-modal" role="dialog" aria-modal="true" aria-labelledby="edit-title">
        <div className="tk-modal-head">
          <h2 id="edit-title">Edit task</h2>
          <button className="tk-square" onClick={onClose} aria-label="Close">
            <FiX size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="tk-fields">
          <div className="tk-field">
            <label htmlFor="e-title">Task title</label>
            <input id="e-title" ref={titleRef} type="text" value={form.title} onChange={set("title")} />
          </div>
          <div className="tk-field">
            <label htmlFor="e-course">Course</label>
            <input id="e-course" type="text" value={form.course} onChange={set("course")} />
          </div>
          <div className="tk-field">
            <label htmlFor="e-date">Due date</label>
            <input id="e-date" type="date" value={form.dueDate} onChange={set("dueDate")} />
          </div>
          <div className="tk-two">
            <div className="tk-field">
              <label htmlFor="e-prio">Priority</label>
              <select id="e-prio" value={form.priority} onChange={set("priority")}>
                {PRIORITIES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="tk-field">
              <label htmlFor="e-status">Status</label>
              <select id="e-status" value={form.status} onChange={set("status")}>
                {STATUSES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="tk-error" role="alert">{error}</p>}
        </div>

        <div className="tk-modal-actions">
          <button className="tk-ghost" onClick={onClose}>Cancel</button>
          <button className="tk-primary grow" onClick={save}>
            <FiCheck size={14} aria-hidden="true" /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Görevler sayfası ---------- */

function Tasks({ tasks, setTasks, taskFilter, setTaskFilter, darkMode, onTaskComplete }) {
  const [form, setForm] = useState({ title: "", course: "", dueDate: "", priority: "Medium", status: "To Do" });
  const [formError, setFormError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message, undo) => {
    clearTimeout(toastTimer.current);
    setToast({ message, undo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  /* ----- İşlemler ----- */
  const addTask = () => {
    if (!form.title.trim()) { setFormError("Enter a task title to add it."); return; }
    setFormError("");
    const task = withStatus(
      { id: Date.now(), title: form.title.trim(), course: form.course.trim(), dueDate: form.dueDate, priority: form.priority },
      form.status
    );
    setTasks((prev) => [...prev, task]);
    setForm({ title: "", course: "", dueDate: "", priority: "Medium", status: "To Do" });
  };

  const toggleComplete = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next = task.completed ? "To Do" : "Done";
    setTasks((prev) => prev.map((t) => (t.id === id ? withStatus(t, next) : t)));
    if (next === "Done" && onTaskComplete) onTaskComplete();
  };

  const deleteTask = (id) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted "${task.title}"`, () => {
      setTasks((prev) => {
        const copy = [...prev];
        copy.splice(Math.min(index, copy.length), 0, task);
        return copy;
      });
      setToast(null);
    });
  };

  const saveEdit = (updated) => {
    const was = tasks.find((t) => t.id === updated.id);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (was && !was.completed && updated.completed && onTaskComplete) onTaskComplete();
    setEditingTask(null);
  };

  /* ----- Liste: önce filtre, sonra sıralama; tarihsizler hep sonda ----- */
  const visible = useMemo(() => {
    return tasks
      .map(normalize)
      .filter((t) => {
        if (taskFilter === "completed") return t.completed;
        if (taskFilter === "pending") return !t.completed;
        return true;
      })
      .sort((a, b) => {
        const da = parseDate(a.dueDate);
        const db = parseDate(b.dueDate);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return sortDir === "asc" ? da - db : db - da;
      });
  }, [tasks, taskFilter, sortDir]);

  const filters = [
    { label: "All", id: "all" },
    { label: "Completed", id: "completed" },
    { label: "Pending", id: "pending" },
  ];

  return (
    <div className={`tk ${darkMode ? "dark" : "light"}`}>
      <style>{css}</style>

      {editingTask && (
        <EditModal task={editingTask} onSave={saveEdit} onClose={() => setEditingTask(null)} />
      )}

      <div className="tk-inner">
        <header>
          <h1>Tasks</h1>
          <p className="muted small">Organize your study workflow efficiently.</p>
        </header>

        {/* Yeni görev */}
        <section className="card" aria-labelledby="create-title">
          <h2 id="create-title">Create new task</h2>
          <p className="muted xs">Only the title is required.</p>

          <div className="tk-form">
            <input type="text" placeholder="Task title" aria-label="Task title" value={form.title}
              onChange={setField("title")} onKeyDown={(e) => e.key === "Enter" && addTask()} />
            <input type="text" placeholder="Course" aria-label="Course" value={form.course} onChange={setField("course")} />
            <input type="date" aria-label="Due date" value={form.dueDate} onChange={setField("dueDate")} />
            <select aria-label="Priority" value={form.priority} onChange={setField("priority")}>
              {PRIORITIES.map((o) => <option key={o}>{o}</option>)}
            </select>
            <select aria-label="Status" value={form.status} onChange={setField("status")}>
              {STATUSES.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          {formError && <p className="tk-error" role="alert">{formError}</p>}
          <button className="tk-primary" onClick={addTask}>Add task</button>
        </section>

        {/* Filtre + sıralama */}
        <div className="tk-toolbar">
          <div className="tk-chips" role="group" aria-label="Filter tasks">
            {filters.map((f) => (
              <button key={f.id} className={`tk-chip ${taskFilter === f.id ? "active" : ""}`}
                onClick={() => setTaskFilter(f.id)} aria-pressed={taskFilter === f.id}>
                {f.label}
              </button>
            ))}
          </div>
          <button className="tk-sort" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            aria-label={`Sort by due date, currently ${sortDir === "asc" ? "earliest first" : "latest first"}`}>
            📅 Date {sortDir === "asc" ? <FiChevronUp size={13} aria-hidden="true" /> : <FiChevronDown size={13} aria-hidden="true" />}
          </button>
        </div>

        {/* Liste */}
        {visible.length === 0 ? (
          <div className="card empty">No tasks found 📚</div>
        ) : (
          <ul className="tk-list">
            {visible.map((task) => (
              <li key={task.id} className={`tk-item ${task.completed ? "is-done" : ""}`}>
                <div className="tk-main">
                  <div className="tk-title-row">
                    <span className="tk-title">{task.title}</span>
                    <span className={`pill prio-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>
                  <div className="tk-meta">
                    {task.course && <span className="muted xs">📘 {task.course}</span>}
                    <span className={`date-tag ${dateTone(task)}`}>📅 {formatDate(task.dueDate)}</span>
                    <span className={`xs ${task.completed ? "ok" : "muted"}`}>
                      {statusIcon(task.status)} {task.status}
                    </span>
                  </div>
                </div>

                <div className="tk-actions">
                  <button className="tk-square" onClick={() => setEditingTask(task)} aria-label={`Edit "${task.title}"`}>
                    <FiEdit3 size={13} aria-hidden="true" />
                  </button>
                  <button className={`tk-square check ${task.completed ? "on" : ""}`} onClick={() => toggleComplete(task.id)}
                    aria-label={task.completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
                    aria-pressed={task.completed}>
                    <FiCheckCircle size={14} aria-hidden="true" />
                  </button>
                  <button className="tk-square danger" onClick={() => deleteTask(task.id)} aria-label={`Delete "${task.title}"`}>
                    <FiTrash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && (
        <div className="tk-toast" role="status">
          <span>{toast.message}</span>
          <button onClick={toast.undo}>Undo</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Stiller ---------- */

const css = `
.tk {
  --page-bg: #FDE8D8; --card-bg: #FFFFFF; --card-alt: #FAF3EC; --border: #EDD9C8;
  --text: #1A0E05; --muted: #9C7A5A; --orange: #C85A1A; --row-hover: #FFF5EE; --input-bg: #FAF3EC;
  --danger-bg: #FEE8E8; --danger: #C0392B; --green: #2E7D32; --green-bg: #E8F5E9;
  --high-bg: #FEE8E8; --med-bg: #FFF8E1; --med: #F57F17; --low-bg: #E8F5E9;
  --today-bg: #FDEEE4; --future-bg: #EEF2FF; --future: #3949AB; --done-bg: #F5F5F5;
  background: var(--page-bg); color: var(--text);
  min-height: 100vh; width: 100%; font-family: Inter, sans-serif; transition: background .3s;
}
.tk.dark {
  --page-bg: #1A110A; --card-bg: #2A1A0F; --card-alt: #241508; --border: #3D2410;
  --text: #F5E6D5; --muted: #8C6A4A; --row-hover: #321A0A; --input-bg: #1A110A;
  --danger-bg: #4A1A1A; --green-bg: #1A2A1A; --high-bg: #3D1010; --med-bg: #3D2E10; --low-bg: #0F2E1A;
  --today-bg: #3D2410; --future-bg: #1A1A3D; --done-bg: #2A2A2A;
}
.tk *, .tk *::before, .tk *::after { box-sizing: border-box; }
.tk button, .tk input, .tk select { font-family: inherit; }
.tk h1, .tk h2, .tk p, .tk ul { margin: 0; padding: 0; }
.tk ul { list-style: none; }
.tk :focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }

.tk-inner { padding: 28px 40px 40px 80px; display: flex; flex-direction: column; gap: 20px; }
.tk h1 { font-size: 26px; font-weight: 700; }
.muted { color: var(--muted); }
.ok { color: var(--green); }
.small { font-size: 13px; margin-top: 4px; }
.xs { font-size: 12px; }

.card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; }
.card h2 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.card.empty { text-align: center; color: var(--muted); font-size: 14px; padding: 32px 0; border-radius: 12px; }

.tk input, .tk select { width: 100%; padding: 9px 13px; border-radius: 10px; border: 1px solid var(--border); background: var(--input-bg); color: var(--text); font-size: 13px; }
.tk-form { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; gap: 10px; margin-top: 14px; }
.tk-error { color: var(--danger); font-size: 12px; margin-top: 8px; }

.tk-primary { display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 12px; padding: 9px 20px; border-radius: 10px; border: none; background: var(--orange); color: #FFF; font-weight: 700; font-size: 13px; cursor: pointer; }
.tk-primary:hover { filter: brightness(1.08); }
.tk-primary.grow { flex: 1; margin-top: 0; padding: 10px 0; }
.tk-ghost { flex: 1; padding: 10px 0; border-radius: 10px; border: 1px solid var(--border); background: none; color: var(--muted); font-weight: 600; font-size: 13px; cursor: pointer; }

.tk-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.tk-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.tk-chip { padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border); background: none; color: var(--muted); font-weight: 600; font-size: 12px; cursor: pointer; transition: all .15s; }
.tk-chip.active { background: var(--orange); border-color: var(--orange); color: #FFF; }
.tk-sort { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--card-bg); color: var(--muted); font-size: 12px; font-weight: 600; cursor: pointer; }

.tk-list { display: flex; flex-direction: column; gap: 8px; }
.tk-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 16px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; transition: background .15s; }
.tk-item:hover { background: var(--row-hover); }
.tk-item.is-done { opacity: .7; }
.tk-item.is-done .tk-title { text-decoration: line-through; }
.tk-main { flex: 1; min-width: 0; }
.tk-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tk-title { font-size: 14px; font-weight: 600; overflow-wrap: anywhere; }
.tk-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; margin-top: 5px; }

.pill { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.prio-high { background: var(--high-bg); color: var(--danger); }
.prio-medium { background: var(--med-bg); color: var(--med); }
.prio-low { background: var(--low-bg); color: var(--green); }

.date-tag { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; }
.date-tag.none { color: var(--muted); font-weight: 500; }
.date-tag.done { background: var(--done-bg); color: var(--muted); }
.date-tag.overdue { background: var(--high-bg); color: var(--danger); }
.date-tag.today { background: var(--today-bg); color: var(--orange); }
.date-tag.future { background: var(--future-bg); color: var(--future); }

.tk-actions { display: flex; gap: 6px; flex-shrink: 0; }
.tk-square { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border); background: none; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.tk-square:hover { border-color: var(--orange); color: var(--orange); }
.tk-square.check { border: none; background: var(--green-bg); color: var(--green); }
.tk-square.check.on { background: var(--green); color: #FFF; }
.tk-square.danger { border: none; background: var(--danger-bg); color: var(--danger); }

.tk-modal-wrap { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; }
.tk-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(4px); }
.tk-modal { position: relative; width: 100%; max-width: 480px; max-height: 92vh; overflow-y: auto; margin: 0 16px; padding: 28px 32px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.tk-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.tk-modal-head h2 { font-size: 18px; font-weight: 700; margin: 0; }
.tk-fields { display: flex; flex-direction: column; gap: 12px; }
.tk-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tk-field label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 5px; }
.tk-modal-actions { display: flex; gap: 10px; margin-top: 24px; }

.tk-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; max-width: calc(100% - 32px); padding: 12px 18px; border-radius: 12px; background: #1A0E05; color: #F5E6D5; font-size: 13px; box-shadow: 0 6px 24px rgba(0,0,0,.25); z-index: 40; }
.dark .tk-toast { background: #F5E6D5; color: #1A0E05; }
.tk-toast button { background: none; border: none; color: #F0A272; font-weight: 700; font-size: 13px; cursor: pointer; }
.dark .tk-toast button { color: #C85A1A; }

@media (max-width: 900px) {
  .tk-inner { padding: 20px 20px 32px 76px; }
  .tk-form { grid-template-columns: 1fr 1fr; }
  .tk-form > :first-child { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .tk-inner { padding: 16px 12px 28px 64px; }
  .tk h1 { font-size: 21px; }
  .tk-form { grid-template-columns: 1fr; }
  .tk-item { align-items: flex-start; flex-direction: column; }
  .tk-actions { align-self: flex-end; }
  .tk-modal { padding: 22px 18px; }
}
@media (prefers-reduced-motion: reduce) { .tk, .tk-item, .tk-chip { transition: none; } }
`;

export default Tasks;