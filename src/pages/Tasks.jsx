import { useState } from "react";
import { FiTrash2, FiCheckCircle, FiEdit3, FiX, FiCheck, FiChevronUp, FiChevronDown } from "react-icons/fi";

/* ─── EDIT MODAL ─── */
function EditModal({ task, onSave, onClose, darkMode }) {
  const [title, setTitle]     = useState(task.title);
  const [course, setCourse]   = useState(task.course);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus]   = useState(task.status);

  const dm = darkMode;
  const input = dm
    ? "bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all w-full"
    : "bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-blue-100 transition-all w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative rounded-[28px] shadow-2xl p-8 w-full max-w-lg mx-4 z-10 border ${dm ? "bg-[#1e2235] border-white/10 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Edit Task</h2>
          <button onClick={onClose} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${dm ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"}`}>
            <FiX size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${dm ? "text-slate-400" : "text-slate-500"}`}>Task Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className={input} />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${dm ? "text-slate-400" : "text-slate-500"}`}>Course</label>
            <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course" className={input} />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${dm ? "text-slate-400" : "text-slate-500"}`}>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${dm ? "text-slate-400" : "text-slate-500"}`}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={input}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${dm ? "text-slate-400" : "text-slate-500"}`}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
                <option>To Do</option><option>In Progress</option><option>Done</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className={`flex-1 py-3 rounded-2xl font-bold ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title || !course || !dueDate) return;
              onSave({ ...task, title, course, dueDate, priority, status });
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
          >
            <FiCheck size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── TASKS PAGE ─── */
function Tasks({ tasks, setTasks, taskFilter, setTaskFilter, darkMode, onTaskComplete }) {
  const [title, setTitle]       = useState("");
  const [course, setCourse]     = useState("");
  const [dueDate, setDueDate]   = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus]     = useState("To Do");
  const [editingTask, setEditingTask] = useState(null);
  const [sortDir, setSortDir]   = useState("asc"); // asc = en yakın tarih önce

  const dm = darkMode;

  const addTask = () => {
    if (!title || !course || !dueDate) return;
    setTasks([...tasks, { id: Date.now(), title, course, dueDate, priority, status, completed: false }]);
    setTitle(""); setCourse(""); setDueDate(""); setPriority("Medium"); setStatus("To Do");
  };

  const toggleComplete = (id) => {
    const task = tasks.find((t) => t.id === id);
    const wasCompleted = task?.completed;
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? "Done" : "To Do" } : t
    ));
    if (!wasCompleted && onTaskComplete) onTaskComplete();
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const saveEdit = (updated) => {
    setTasks(tasks.map((t) => t.id === updated.id ? updated : t));
    setEditingTask(null);
  };

  /* ── Sort by date then filter ── */
  const sortedAndFiltered = [...tasks]
    .sort((a, b) => {
      const da = new Date(a.dueDate || "9999-12-31");
      const db = new Date(b.dueDate || "9999-12-31");
      return sortDir === "asc" ? da - db : db - da;
    })
    .filter((task) => {
      if (taskFilter === "completed") return task.completed;
      if (taskFilter === "pending")   return !task.completed;
      return true;
    });

  const getPriorityColor = (p) => {
    if (p === "High")   return dm ? "bg-red-500/20 text-red-400"    : "bg-red-100 text-red-600";
    if (p === "Low")    return dm ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600";
    return dm ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700";
  };

  const getStatusIcon = (s) => {
    if (s === "Done")        return "✅";
    if (s === "In Progress") return "⚡";
    return "🚀";
  };

  /* Date badge color — overdue / today / upcoming */
  const getDateBadge = (dueDate, completed) => {
    if (!dueDate) return "";
    const today = new Date(); today.setHours(0,0,0,0);
    const due   = new Date(dueDate);
    if (completed) return dm ? "bg-slate-500/20 text-slate-400" : "bg-slate-100 text-slate-500";
    if (due < today)  return dm ? "bg-red-500/20 text-red-400"    : "bg-red-100 text-red-600";
    if (due.toDateString() === today.toDateString()) return dm ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600";
    return dm ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600";
  };

  const card     = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white border border-slate-100";
  const cardForm = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white/70 backdrop-blur-xl border border-white/40";
  const input    = dm
    ? "bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
    : "bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all";
  const textMain = dm ? "text-white"     : "text-slate-900";
  const textSub  = dm ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-8">

      {/* EDIT MODAL */}
      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={saveEdit}
          onClose={() => setEditingTask(null)}
          darkMode={darkMode}
        />
      )}

      {/* HEADER */}
      <div>
        <h1 className={`text-5xl font-extrabold ${textMain}`}>Tasks</h1>
        <p className={`mt-3 text-lg ${textSub}`}>Organize your study workflow efficiently.</p>
      </div>

      {/* ADD TASK CARD */}
      <div className={`${cardForm} rounded-[32px] p-8 shadow-xl`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${textMain}`}>Create New Task</h2>
            <p className={`mt-1 ${textSub}`}>Add a new study task</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <input type="text"  placeholder="Task title" value={title}   onChange={(e) => setTitle(e.target.value)}   className={input} />
          <input type="text"  placeholder="Course"     value={course}  onChange={(e) => setCourse(e.target.value)}  className={input} />
          <input type="date"                           value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={input}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
            <option>To Do</option><option>In Progress</option><option>Done</option>
          </select>
        </div>
        <button onClick={addTask} className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all duration-300">
          Add Task
        </button>
      </div>

      {/* FILTERS + SORT */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "All",       filter: "all",       active: "bg-blue-500 text-white shadow-lg" },
            { label: "Completed", filter: "completed", active: "bg-green-500 text-white shadow-lg" },
            { label: "Pending",   filter: "pending",   active: "bg-orange-500 text-white shadow-lg" },
          ].map(({ label, filter, active }) => (
            <button key={filter} onClick={() => setTaskFilter(filter)}
              className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
                taskFilter === filter ? active : dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-white text-slate-600"
              }`}
            >{label}</button>
          ))}
        </div>

        {/* Sort by date toggle */}
        <button
          onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all text-sm ${
            dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          📅 Date
          {sortDir === "asc" ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {sortedAndFiltered.length === 0 ? (
          <div className={`${card} rounded-3xl p-10 text-center shadow-sm`}>
            <p className={`text-lg ${textSub}`}>No tasks found 📚</p>
          </div>
        ) : (
          sortedAndFiltered.map((task) => (
            <div key={task.id}
              className={`${card} rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${task.completed ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className={`text-xl font-bold ${task.completed ? "line-through text-slate-400" : textMain}`}>
                      {task.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className={`flex flex-wrap gap-4 mt-3 text-sm ${textSub}`}>
                    <span>📘 {task.course}</span>
                    <span className={`px-2.5 py-0.5 rounded-lg font-semibold text-xs ${getDateBadge(task.dueDate, task.completed)}`}>
                      📅 {task.dueDate}
                    </span>
                    <span>
                      {getStatusIcon(task.status)}{" "}
                      <span className={task.completed ? "text-green-400 font-semibold" : ""}>{task.status}</span>
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Edit */}
                  <button onClick={() => setEditingTask(task)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      dm ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/40" : "bg-blue-100 text-blue-500 hover:bg-blue-200"
                    }`}
                  ><FiEdit3 size={18} /></button>

                  {/* Complete */}
                  <button onClick={() => toggleComplete(task.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-green-500 text-white"
                        : dm ? "bg-white/10 text-slate-400 hover:bg-green-500/20 hover:text-green-400"
                               : "bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600"
                    }`}
                  ><FiCheckCircle size={20} /></button>

                  {/* Delete */}
                  <button onClick={() => deleteTask(task.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      dm ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                         : "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                  ><FiTrash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;