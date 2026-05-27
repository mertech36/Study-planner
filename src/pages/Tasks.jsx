import { useState } from "react";
import { FiPlus, FiTrash2, FiCheckCircle } from "react-icons/fi";

function Tasks({ tasks, setTasks, taskFilter, setTaskFilter, darkMode, onTaskComplete }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");

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
      t.id === id
        ? { ...t, completed: !t.completed, status: !t.completed ? "Done" : "To Do" }
        : t
    ));

    // Sadece tamamlanırken (false → true) Firestore'a kaydet
    if (!wasCompleted && onTaskComplete) {
      onTaskComplete();
    }
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "completed") return task.completed;
    if (taskFilter === "pending") return !task.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    if (priority === "High") return dm ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600";
    if (priority === "Low") return dm ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600";
    return dm ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700";
  };

  const getStatusIcon = (status) => {
    if (status === "Done") return "✅";
    if (status === "In Progress") return "⚡";
    return "🚀";
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
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${dm ? "bg-blue-500/20" : "bg-blue-100"}`}>
            <FiPlus className={dm ? "text-blue-400" : "text-blue-600"} size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
          <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} className={input} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={input} />
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

      {/* FILTERS */}
      <div className="flex gap-4">
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

      {/* TASK LIST */}
      <div className="space-y-5">
        {filteredTasks.length === 0 ? (
          <div className={`${card} rounded-3xl p-10 text-center shadow-sm`}>
            <p className={`text-lg ${textSub}`}>No tasks found 📚</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id}
              className={`${card} rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${task.completed ? "opacity-70" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-2xl font-bold ${task.completed ? "line-through text-slate-400" : textMain}`}>
                      {task.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className={`flex gap-6 mt-4 ${textSub}`}>
                    <p>📘 {task.course}</p>
                    <p>📅 {task.dueDate}</p>
                    <p>
                      {getStatusIcon(task.status)}{" "}
                      <span className={task.completed ? "text-green-400 font-semibold" : ""}>{task.status}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleComplete(task.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-green-500 text-white"
                        : dm ? "bg-white/10 text-slate-400 hover:bg-green-500/20 hover:text-green-400"
                               : "bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600"
                    }`}
                  ><FiCheckCircle size={22} /></button>
                  <button onClick={() => deleteTask(task.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      dm ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                         : "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                  ><FiTrash2 size={20} /></button>
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