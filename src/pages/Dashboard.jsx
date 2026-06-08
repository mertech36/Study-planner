import {
  FiCheckCircle,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiTrash2,
} from "react-icons/fi";
import AIChat from "../components/AIChat";

/* ─── Dynamic greeting based on time of day ─── */
function getGreeting(name) {
  const hour = new Date().getHours();
  const firstName = name ? name.split(" ")[0] : "there";

  const greetings = {
    morning: [
      { line1: "Rise and conquer,", line2: firstName },
      { line1: "A new day, a new chapter,", line2: firstName },
      { line1: "The early bird wins,", line2: firstName },
      { line1: "Today is yours to own,", line2: firstName },
    ],
    afternoon: [
      { line1: "Keep the momentum going,", line2: firstName },
      { line1: "Halfway there, stay sharp,", line2: firstName },
      { line1: "The grind continues,", line2: firstName },
      { line1: "You are built different,", line2: firstName },
    ],
    evening: [
      { line1: "One more push tonight,", line2: firstName },
      { line1: "The night belongs to you,", line2: firstName },
      { line1: "Champions work after dark,", line2: firstName },
      { line1: "Finish strong today,", line2: firstName },
    ],
    night: [
      { line1: "Still here, still grinding,", line2: firstName },
      { line1: "While they sleep, you rise,", line2: firstName },
      { line1: "Late nights build great minds,", line2: firstName },
      { line1: "Quiet hours, loud progress,", line2: firstName },
    ],
  };

  let pool;
  if (hour >= 5  && hour < 12) pool = greetings.morning;
  else if (hour >= 12 && hour < 17) pool = greetings.afternoon;
  else if (hour >= 17 && hour < 21) pool = greetings.evening;
  else pool = greetings.night;

  // Pick one deterministically by day-of-year so it doesn't flicker on re-render
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return pool[dayOfYear % pool.length];
}

function Dashboard({
  tasks,
  setTasks,
  exams,
  courses,
  setPage,
  setTaskFilter,
  darkMode,
  setDarkMode,
  userName = "",
}) {
  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const upcomingTasks  = tasks.filter((t) => !t.completed);

  const greeting = getGreeting(userName);

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed, status: !task.completed ? "Done" : "To Do" }
        : task
    ));
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      subtitle: "All created tasks",
      icon: FiClipboard,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      action: () => { setTaskFilter("all"); setPage("tasks"); },
    },
    {
      title: "Completed",
      value: completedTasks,
      subtitle: "Great progress",
      subtitleColor: "text-green-500",
      icon: FiCheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      action: () => { setTaskFilter("completed"); setPage("tasks"); },
    },
    {
      title: "Upcoming Exams",
      value: exams.length,
      subtitle: "Stay prepared",
      subtitleColor: "text-orange-500",
      icon: FiCalendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      action: () => setPage("exams"),
    },
    {
      title: "Courses",
      value: courses.length,
      subtitle: "Active subjects",
      subtitleColor: "text-purple-500",
      icon: FiBookOpen,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      action: () => setPage("courses"),
    },
  ];

  const dm = darkMode;
  const cardStyle    = dm ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const textPrimary  = dm ? "text-white"     : "text-slate-900";
  const textSecondary = dm ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-5xl font-extrabold tracking-tight ${textPrimary}`}>
            {greeting.line1}
          </h1>
          <p className={`mt-2 text-sm font-medium ${textSecondary}`}>
            {new Date().toDateString()}
          </p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-5 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 ${
            dm ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {dm ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={item.action}
              className={`${cardStyle} rounded-3xl p-6 border shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${textSecondary}`}>{item.title}</p>
                  <h2 className={`text-5xl font-bold mt-3 ${textPrimary}`}>{item.value}</h2>
                  <p className={`text-sm mt-2 ${item.subtitleColor || "text-slate-400"}`}>{item.subtitle}</p>
                </div>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${item.iconBg}`}>
                  <Icon className={item.iconColor} size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* UPCOMING TASKS */}
        <div className={`${cardStyle} xl:col-span-2 rounded-3xl p-7 border shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-bold ${textPrimary}`}>Upcoming Tasks</h2>
              <p className={`mt-1 ${textSecondary}`}>Manage your study goals</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-sm font-semibold">
              {upcomingTasks.length} remaining
            </div>
          </div>

          <div className="space-y-4">
            {upcomingTasks.length === 0 ? (
              <div className={`rounded-2xl p-6 text-center ${dm ? "bg-slate-700" : "bg-slate-50"}`}>
                <p className={textSecondary}>No pending tasks — you are crushing it.</p>
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                    dm
                      ? "border-slate-700 hover:bg-slate-700"
                      : "border-slate-100 hover:bg-blue-50 hover:border-blue-200"
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className={`font-semibold text-lg truncate ${textPrimary}`}>{task.title}</h3>
                    <p className={`text-sm mt-1 ${textSecondary}`}>{task.course}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-sm ${textSecondary}`}>{task.dueDate}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        dm
                          ? "bg-white/10 text-slate-400 hover:bg-green-500/20 hover:text-green-400"
                          : "bg-slate-100 text-slate-500 hover:bg-green-100 hover:text-green-600"
                      }`}
                    >
                      <FiCheckCircle size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        dm
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                          : "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* EXAMS */}
          <div
            onClick={() => setPage("exams")}
            className={`${cardStyle} rounded-3xl p-7 border shadow-sm cursor-pointer transition-all duration-300 ${
              dm ? "hover:bg-slate-700" : "hover:bg-orange-50"
            }`}
          >
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Upcoming Exams</h2>
            <p className={`mt-1 text-sm ${textSecondary}`}>Don't miss deadlines</p>
            <div className="space-y-4 mt-6">
              {exams.length === 0 ? (
                <div className={`rounded-2xl p-5 text-center ${dm ? "bg-slate-700" : "bg-slate-50"}`}>
                  <p className={textSecondary}>No exams added</p>
                </div>
              ) : (
                exams.map((exam) => (
                  <div key={exam.id} className={`p-5 rounded-2xl transition-all duration-300 ${dm ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-orange-100"}`}>
                    <h3 className={`font-semibold text-lg ${textPrimary}`}>{exam.examTitle}</h3>
                    <p className="text-sm text-orange-500 mt-3 font-medium">{exam.examDate}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COURSES */}
          <div
            onClick={() => setPage("courses")}
            className={`${cardStyle} rounded-3xl p-7 border shadow-sm cursor-pointer transition-all duration-300 ${
              dm ? "hover:bg-slate-700" : "hover:bg-purple-50"
            }`}
          >
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Courses</h2>
            <p className={`mt-1 text-sm ${textSecondary}`}>Your active courses</p>
            <div className="space-y-3 mt-6">
              {courses.length === 0 ? (
                <div className={`rounded-2xl p-5 text-center ${dm ? "bg-slate-700" : "bg-slate-50"}`}>
                  <p className={textSecondary}>No courses added</p>
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${dm ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-50 hover:bg-purple-100"}`}>
                    <span className={`font-medium ${textPrimary}`}>{course.name}</span>
                    <span className={`text-sm ${textSecondary}`}>{course.semester}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI CHAT */}
      <AIChat darkMode={darkMode} />

    </div>
  );
}

export default Dashboard;