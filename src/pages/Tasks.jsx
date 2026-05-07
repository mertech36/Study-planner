import { useState } from "react";

import {
  FiPlus,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";

function Tasks({
  tasks,
  setTasks,
  taskFilter,
  setTaskFilter,
}) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");

  const addTask = () => {
    if (!title || !course || !dueDate) return;

    const newTask = {
      id: Date.now(),
      title,
      course,
      dueDate,
      priority,
      status,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setCourse("");
    setDueDate("");
    setPriority("Medium");
    setStatus("To Do");
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(
      (task) => task.id !== id
    );

    setTasks(filteredTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "completed")
      return task.completed;

    if (taskFilter === "pending")
      return !task.completed;

    return true;
  });

  const getPriorityColor = (priority) => {
    if (priority === "High")
      return "bg-red-100 text-red-600";

    if (priority === "Low")
      return "bg-green-100 text-green-600";

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-5xl font-extrabold text-slate-900">
          Tasks
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Organize your study workflow efficiently.
        </p>

      </div>

      {/* ADD TASK CARD */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Create New Task
            </h2>

            <p className="text-slate-500 mt-1">
              Add a new study task
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center">

            <FiPlus
              className="text-blue-600"
              size={28}
            />

          </div>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          {/* TITLE */}
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />

          {/* COURSE */}
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />

          {/* DATE */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />

          {/* PRIORITY */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* STATUS */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

        </div>

        {/* BUTTON */}
        <button
          onClick={addTask}
          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Add Task
        </button>

      </div>

      {/* FILTERS */}
      <div className="flex gap-4">

        {/* ALL */}
        <button
          onClick={() => setTaskFilter("all")}
          className={`px-5 py-3 rounded-2xl font-semibold transition-all
          ${
            taskFilter === "all"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white text-slate-600"
          }`}
        >
          All
        </button>

        {/* COMPLETED */}
        <button
          onClick={() => setTaskFilter("completed")}
          className={`px-5 py-3 rounded-2xl font-semibold transition-all
          ${
            taskFilter === "completed"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-white text-slate-600"
          }`}
        >
          Completed
        </button>

        {/* PENDING */}
        <button
          onClick={() => setTaskFilter("pending")}
          className={`px-5 py-3 rounded-2xl font-semibold transition-all
          ${
            taskFilter === "pending"
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-white text-slate-600"
          }`}
        >
          Pending
        </button>

      </div>

      {/* TASK LIST */}
      <div className="space-y-5">

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

            <p className="text-slate-500 text-lg">
              No tasks found 📚
            </p>

          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
              ${
                task.completed
                  ? "opacity-70"
                  : ""
              }`}
            >

              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div>

                  <div className="flex items-center gap-3">

                    <h2
                      className={`text-2xl font-bold
                      ${
                        task.completed
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </h2>

                    {/* PRIORITY */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>

                  </div>

                  <div className="flex gap-6 mt-4 text-slate-500">

                    <p>
                      📘 {task.course}
                    </p>

                    <p>
                      📅 {task.dueDate}
                    </p>

                    <p>
                      🚀 {task.status}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  {/* COMPLETE */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                    ${
                      task.completed
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600"
                    }`}
                  >

                    <FiCheckCircle size={22} />

                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >

                    <FiTrash2 size={20} />

                  </button>

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