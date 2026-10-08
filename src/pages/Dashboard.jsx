import { useState, useRef, useEffect, useMemo } from "react";
import { FiCheckCircle, FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";
import AIChat from "../components/AIChat";

function getGreeting(name) {
  const h = new Date().getHours(), n = name ? name.split(" ")[0] : "there";
  if (h >= 5 && h < 12) return `Good morning, ${n}`;
  if (h >= 12 && h < 17) return `Good afternoon, ${n}`;
  if (h >= 17 && h < 21) return `Good evening, ${n}`;
  return `Good night, ${n}`;
}

function getDateLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });
}

function parseDate(value) {
  if (!value) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value) {
  const d = parseDate(value);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : value;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function byDueDate(a, b) {
  const da = parseDate(a.dueDate), db = parseDate(b.dueDate);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return da - db;
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "week", label: "This week" },
  { id: "overdue", label: "Overdue" }
];

function Dashboard({
  tasks = [], setTasks, exams = [], courses = [],
  setPage, setTaskFilter, darkMode, setDarkMode, userName = ""
}) {
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message, undo) => {
    clearTimeout(toastTimer.current);
    setToast({ message, undo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  const pendingTasks = useMemo(
    () => tasks.filter(t => !t.completed).sort(byDueDate),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const today = startOfToday(), weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return pendingTasks.filter(t => {
      const d = parseDate(t.dueDate);
      if (filter === "overdue") return d && d < today;
      if (filter === "week") return d && d >= today && d <= weekEnd;
      return true;
    });
  }, [pendingTasks, filter]);

  const upcomingExams = useMemo(() => {
    const today = startOfToday();
    return exams
      .filter(e => {
        const d = parseDate(e.examDate);
        return !d || d >= today;
      })
      .sort((a, b) => {
        const da = parseDate(a.examDate), db = parseDate(b.examDate);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da - db;
      });
  }, [exams]);

  const toggleComplete = id => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const oldCompleted = task.completed, oldStatus = task.status;

    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, status: !t.completed ? "Done" : "To Do" }
        : t
    ));

    if (!oldCompleted) {
      showToast(`Completed "${task.title}"`, () => {
        setTasks(prev => prev.map(t =>
          t.id === id
            ? { ...t, completed: oldCompleted, status: oldStatus }
            : t
        ));
        setToast(null);
      });
    }
  };

  const deleteTask = id => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    const task = tasks[index];
    setTasks(prev => prev.filter(t => t.id !== id));

    showToast(`Deleted "${task.title}"`, () => {
      setTasks(prev => {
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, task);
        return next;
      });
      setToast(null);
    });
  };

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;

    setTasks(prev => [...prev, {
      id: Date.now(), title, completed: false,
      status: "To Do", dueDate: "", course: ""
    }]);
    setNewTask("");
  };

  const goTasks = f => {
    setTaskFilter(f);
    setPage("tasks");
  };

  const stats = [
    ["Pending", pendingTasks.length, "", () => goTasks("all")],
    ["Completed", completedCount, "good", () => goTasks("completed")],
    ["Exams ahead", upcomingExams.length, "", () => setPage("exams")],
    ["Courses", courses.length, "", () => setPage("courses")]
  ];

  const emptyMessage =
    filter === "overdue" ? "Nothing overdue." :
    filter === "week" ? "No tasks due in the next 7 days." :
    "No pending tasks. Add one above.";

  return (
    <div className={`dash ${darkMode ? "dark" : "light"}`}>
      <style>{css}</style>

      <div className="dash-inner">
        <header className="dash-header">
          <div>
            <h1>{getGreeting(userName)}</h1>
            <p className="muted small">{getDateLabel()}</p>
          </div>

          <div className="header-right">
            <span className="muted small">
              {pendingTasks.length} task{pendingTasks.length !== 1 ? "s" : ""} pending
            </span>

            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className="dash-grid">
          <section className="card tasks-card" aria-labelledby="tasks-title">
            <div className="card-head">
              <h2 id="tasks-title">Upcoming tasks</h2>
              <button className="link-btn" onClick={() => goTasks("all")}>
                View all <FiArrowRight size={13} />
              </button>
            </div>

            <div className="quick-add">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="New task, press Enter to add"
                aria-label="New task"
              />
              <button className="primary-btn" onClick={addTask}>
                <FiPlus size={14} /> Add
              </button>
            </div>

            <div className="chips" role="group" aria-label="Filter tasks">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`chip ${filter === f.id ? "active" : ""}`}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {visibleTasks.length === 0 ? (
              <p className="empty">{emptyMessage}</p>
            ) : (
              <ul>
                {visibleTasks.map(task => {
                  const due = parseDate(task.dueDate);
                  const overdue = due && due < startOfToday();

                  return (
                    <li key={task.id} className="task-row">
                      <div className="task-text">
                        <span className="task-title">{task.title}</span>

                        {(task.dueDate || task.course) && (
                          <span className="task-meta">
                            {task.course && <span>{task.course}</span>}
                            {task.dueDate && (
                              <span className={overdue ? "overdue" : ""}>
                                {overdue ? "Overdue: " : "Due "}
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="task-actions">
                        <button
                          className="round-btn"
                          onClick={() => toggleComplete(task.id)}
                          aria-label={`Mark "${task.title}" as done`}
                        >
                          <FiCheckCircle size={14} />
                        </button>

                        <button
                          className="round-btn danger"
                          onClick={() => deleteTask(task.id)}
                          aria-label={`Delete "${task.title}"`}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="side">
            <div className="card alt stats">
              {stats.map(([label, value, tone, action]) => (
                <button key={label} className="stat" onClick={action}>
                  <span className={`stat-value ${tone}`}>{value}</span>
                  <span className="stat-label">{label}</span>
                </button>
              ))}
            </div>

            <section className="card" aria-labelledby="exams-title">
              <button className="card-head head-btn" onClick={() => setPage("exams")}>
                <h2 id="exams-title">Upcoming exams</h2>
                <FiArrowRight size={15} />
              </button>

              {upcomingExams.length === 0 ? (
                <p className="empty compact">No upcoming exams</p>
              ) : (
                <ul className="mini-list">
                  {upcomingExams.slice(0, 4).map(exam => (
                    <li key={exam.id} className="mini-item bordered">
                      <strong>{exam.examTitle}</strong>
                      <span className="accent small">
                        {formatDate(exam.examDate)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card" aria-labelledby="courses-title">
              <button className="card-head head-btn" onClick={() => setPage("courses")}>
                <h2 id="courses-title">Courses</h2>
                <FiArrowRight size={15} />
              </button>

              {courses.length === 0 ? (
                <p className="empty compact">No courses added</p>
              ) : (
                <ul className="mini-list">
                  {courses.map(course => (
                    <li key={course.id} className="mini-item row">
                      <strong>{course.name}</strong>
                      <span className="muted small">{course.semester}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        <AIChat darkMode={darkMode} />
      </div>

      {toast && (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          <button onClick={toast.undo}>Undo</button>
        </div>
      )}
    </div>
  );
}

const css = `
.dash{
  --page-bg:#FDE8D8;--card-bg:#FFF;--card-alt:#FAF3EC;--border:#EDD9C8;
  --text:#1A0E05;--muted:#9C7A5A;--orange:#C85A1A;--orange-light:#FDEEE4;
  --orange-border:#F0C4A8;--green:#2E7D32;--row-hover:#FFF5EE;
  --danger-bg:#FEE8E8;--input-bg:#FAF3EC;
  background:var(--page-bg);color:var(--text);min-height:100vh;width:100%;
  box-sizing:border-box;font-family:Inter,sans-serif;transition:.3s;
}
.dash.dark{
  --page-bg:#1A110A;--card-bg:#2A1A0F;--card-alt:#241508;--border:#3D2410;
  --text:#F5E6D5;--muted:#8C6A4A;--orange-light:#3D2410;
  --orange-border:#5A2E10;--green:#4CAF72;--row-hover:#321A0A;
  --danger-bg:#4A1A1A;--input-bg:#1A110A;
}
.dash *{box-sizing:border-box}
.dash button,.dash input{font-family:inherit;color:inherit}
.dash button:focus-visible,.dash input:focus-visible{
  outline:2px solid var(--orange);outline-offset:2px
}
.dash h1,.dash h2,.dash p,.dash ul{margin:0;padding:0}
.dash ul{list-style:none}
.dash-inner{
  padding:28px 40px 40px 80px;display:flex;flex-direction:column;gap:24px
}
.dash-header{
  display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:52px
}
.dash-header h1{font-size:26px;font-weight:700;line-height:1.2}
.dash-header p{margin-top:4px}
.header-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
.muted{color:var(--muted)}
.accent{color:var(--orange);font-weight:500}
.small{font-size:13px}
.dash-grid{
  display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start
}
.side{display:flex;flex-direction:column;gap:16px;min-width:0}
.card{
  background:var(--card-bg);border:1px solid var(--border);border-radius:16px;
  padding:20px 24px;min-width:0;transition:.3s
}
.card.alt{background:var(--card-alt)}
.tasks-card{padding:24px 28px}
.card-head{
  display:flex;align-items:center;justify-content:space-between;margin-bottom:14px
}
.card-head h2{font-size:15px;font-weight:700}
.tasks-card .card-head h2{font-size:16px}
.head-btn,.link-btn{
  background:none;border:none;cursor:pointer
}
.head-btn{width:100%;padding:0;text-align:left}
.head-btn:hover{color:var(--orange)}
.link-btn{
  display:flex;align-items:center;gap:4px;font-size:13px;color:var(--muted)!important
}
.link-btn:hover{color:var(--orange)!important}
.icon-btn{
  width:36px;height:36px;border-radius:8px;border:1px solid var(--border);
  background:var(--card-bg);cursor:pointer;font-size:18px;
  display:flex;align-items:center;justify-content:center
}
.quick-add{display:flex;gap:8px;margin-bottom:14px}
.quick-add input{
  flex:1;min-width:0;padding:10px 14px;border-radius:10px;
  border:1px solid var(--border);background:var(--input-bg);
  color:var(--text);font-size:13px
}
.primary-btn{
  display:flex;align-items:center;gap:5px;padding:10px 20px;border-radius:10px;
  border:none;background:var(--orange);color:#FFF!important;font-weight:700;
  font-size:13px;cursor:pointer;white-space:nowrap
}
.primary-btn:hover{filter:brightness(1.08)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.chip{
  padding:4px 14px;border-radius:20px;border:1px solid var(--border);
  background:transparent;color:var(--muted)!important;font-size:12px;
  font-weight:600;cursor:pointer
}
.chip:hover{border-color:var(--orange-border)}
.chip.active{
  background:var(--orange-light);color:var(--orange)!important;border-color:var(--orange-border)
}
.task-row{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:13px 8px;border-bottom:1px solid var(--border);border-radius:8px
}
.task-row:hover{background:var(--row-hover)}
.task-row:last-child{border-bottom:none}
.task-text{display:flex;flex-direction:column;gap:3px;min-width:0}
.task-title{font-size:14px;font-weight:500;overflow-wrap:anywhere}
.task-meta{
  display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--muted)
}
.task-meta .overdue{color:#C0392B;font-weight:600}
.task-actions{display:flex;gap:8px;flex-shrink:0}
.round-btn{
  width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border);
  background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
  color:var(--muted)!important
}
.round-btn:hover{color:var(--green)!important;border-color:var(--green)}
.round-btn.danger{
  border:none;border-radius:7px;background:var(--danger-bg);color:#C0392B!important
}
.round-btn.danger:hover{filter:brightness(.95)}
.empty{
  color:var(--muted);font-size:14px;text-align:center;padding:32px 0
}
.empty.compact{font-size:13px;padding:16px 0}
.stats{
  display:grid;grid-template-columns:1fr 1fr;gap:16px 24px
}
.stat{
  text-align:left;background:none;border:none;padding:0;cursor:pointer;
  display:flex;flex-direction:column;gap:3px
}
.stat-value{font-size:32px;font-weight:700;line-height:1.1}
.stat-value.good{color:var(--green)}
.stat-label{font-size:11px;font-weight:600;color:var(--muted)}
.stat:hover .stat-label{color:var(--orange)}
.mini-list{display:flex;flex-direction:column;gap:8px}
.mini-item{
  padding:8px 12px;border-radius:10px;background:var(--card-alt);
  display:flex;flex-direction:column;gap:4px
}
.mini-item.bordered{padding:10px 14px;border:1px solid var(--border)}
.mini-item.row{
  flex-direction:row;align-items:center;justify-content:space-between;gap:8px
}
.mini-item strong{font-size:13px;font-weight:600}
.toast{
  position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
  display:flex;align-items:center;gap:16px;max-width:calc(100% - 32px);
  padding:12px 18px;border-radius:12px;background:#1A0E05;color:#F5E6D5;
  font-size:13px;box-shadow:0 6px 24px rgba(0,0,0,.25);z-index:50
}
.dark .toast{background:#F5E6D5;color:#1A0E05}
.toast button{
  background:none;border:none;color:#F0A272!important;font-weight:700;
  font-size:13px;cursor:pointer
}
.dark .toast button{color:#C85A1A!important}
@media(max-width:900px){
  .dash-inner{padding:20px 20px 32px 76px}
  .dash-grid{grid-template-columns:1fr}
}
@media(max-width:520px){
  .dash-inner{padding:16px 12px 28px 64px;gap:18px}
  .dash-header{flex-wrap:wrap}
  .dash-header h1{font-size:21px}
  .tasks-card{padding:18px 16px}
  .quick-add{flex-direction:column}
  .primary-btn{justify-content:center}
}
@media(prefers-reduced-motion:reduce){
  .dash,.card{transition:none}
}
`;

export default Dashboard;