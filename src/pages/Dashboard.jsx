import {
  FiCheckCircle,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
} from "react-icons/fi";

function Dashboard({
  tasks,
  exams,
  courses,
  setPage,
  setTaskFilter,
  darkMode,
  setDarkMode,
}) {

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const upcomingTasks = tasks.filter(
    (task) => !task.completed
  );

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      subtitle: "All created tasks",
      icon: FiClipboard,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      action: () => {
        setTaskFilter("all");
        setPage("tasks");
      },
    },

    {
      title: "Completed",
      value: completedTasks,
      subtitle: "Great progress",
      subtitleColor: "text-green-500",
      icon: FiCheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      action: () => {
        setTaskFilter("completed");
        setPage("tasks");
      },
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

  const cardStyle = darkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-100";

  const textPrimary = darkMode
    ? "text-white"
    : "text-slate-900";

  const textSecondary = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div>

          <h1
            className={`text-5xl font-extrabold tracking-tight ${textPrimary}`}
          >
            Welcome back 👋
          </h1>

          <p className={`mt-3 text-lg ${textSecondary}`}>
            {new Date().toDateString()}
          </p>

        </div>

        {/* DARK MODE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-5 py-3 rounded-2xl border transition-all duration-300 hover:scale-105
          ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
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
              className={`${cardStyle}
              rounded-3xl p-6 border shadow-sm
              hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]
              transition-all duration-300 cursor-pointer`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className={`text-sm font-medium ${textSecondary}`}>
                    {item.title}
                  </p>

                  <h2
                    className={`text-5xl font-bold mt-3 ${textPrimary}`}
                  >
                    {item.value}
                  </h2>

                  <p
                    className={`text-sm mt-2 ${
                      item.subtitleColor || "text-slate-400"
                    }`}
                  >
                    {item.subtitle}
                  </p>

                </div>

                <div
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${item.iconBg}`}
                >

                  <Icon
                    className={item.iconColor}
                    size={28}
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* TASKS */}
        <div
          className={`${cardStyle}
          xl:col-span-2 rounded-3xl p-7 border shadow-sm`}
        >

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2
                className={`text-3xl font-bold ${textPrimary}`}
              >
                Upcoming Tasks
              </h2>

              <p className={`mt-1 ${textSecondary}`}>
                Manage your study goals
              </p>

            </div>

            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-sm font-semibold">
              {upcomingTasks.length} remaining
            </div>

          </div>

          <div className="space-y-4">

            {upcomingTasks.length === 0 ? (

              <div
                className={`rounded-2xl p-6 text-center
                ${
                  darkMode
                    ? "bg-slate-700"
                    : "bg-slate-50"
                }`}
              >

                <p className={textSecondary}>
                  No pending tasks 🎉
                </p>

              </div>

            ) : (

              upcomingTasks.map((task) => (

                <div
                  key={task.id}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
                  ${
                    darkMode
                      ? "border-slate-700 hover:bg-slate-700"
                      : "border-slate-100 hover:bg-blue-50 hover:border-blue-200"
                  }`}
                >

                  <div>

                    <h3
                      className={`font-semibold text-lg ${textPrimary}`}
                    >
                      {task.title}
                    </h3>

                    <p
                      className={`text-sm mt-1 ${textSecondary}`}
                    >
                      {task.course}
                    </p>

                  </div>

                  <div className={`text-sm ${textSecondary}`}>
                    {task.dueDate}
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
            className={`${cardStyle}
            rounded-3xl p-7 border shadow-sm cursor-pointer transition-all duration-300
            ${
              darkMode
                ? "hover:bg-slate-700"
                : "hover:bg-orange-50"
            }`}
          >

            <h2
              className={`text-2xl font-bold ${textPrimary}`}
            >
              Upcoming Exams
            </h2>

            <p className={`mt-1 text-sm ${textSecondary}`}>
              Don’t miss deadlines
            </p>

            <div className="space-y-4 mt-6">

              {exams.length === 0 ? (

                <div
                  className={`rounded-2xl p-5 text-center
                  ${
                    darkMode
                      ? "bg-slate-700"
                      : "bg-slate-50"
                  }`}
                >

                  <p className={textSecondary}>
                    No exams added
                  </p>

                </div>

              ) : (

                exams.map((exam) => (

                  <div
                    key={exam.id}
                    className={`p-5 rounded-2xl transition-all duration-300
                    ${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-50 hover:bg-orange-100"
                    }`}
                  >

                    <h3
                      className={`font-semibold text-lg ${textPrimary}`}
                    >
                      {exam.examTitle}
                    </h3>

                    <p className={`text-sm mt-1 ${textSecondary}`}>
                      {exam.course}
                    </p>

                    <p className="text-sm text-orange-500 mt-3 font-medium">
                      {exam.examDate}
                    </p>

                  </div>

                ))
              )}

            </div>

          </div>

          {/* COURSES */}
          <div
            onClick={() => setPage("courses")}
            className={`${cardStyle}
            rounded-3xl p-7 border shadow-sm cursor-pointer transition-all duration-300
            ${
              darkMode
                ? "hover:bg-slate-700"
                : "hover:bg-purple-50"
            }`}
          >

            <h2
              className={`text-2xl font-bold ${textPrimary}`}
            >
              Courses
            </h2>

            <p className={`mt-1 text-sm ${textSecondary}`}>
              Your active courses
            </p>

            <div className="space-y-3 mt-6">

              {courses.length === 0 ? (

                <div
                  className={`rounded-2xl p-5 text-center
                  ${
                    darkMode
                      ? "bg-slate-700"
                      : "bg-slate-50"
                  }`}
                >

                  <p className={textSecondary}>
                    No courses added
                  </p>

                </div>

              ) : (

                courses.map((course) => (

                  <div
                    key={course.id}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                    ${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-50 hover:bg-purple-100"
                    }`}
                  >

                    <span
                      className={`font-medium ${textPrimary}`}
                    >
                      {course.name}
                    </span>

                    <span
                      className={`text-sm ${textSecondary}`}
                    >
                      {course.semester}
                    </span>

                  </div>

                ))
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;