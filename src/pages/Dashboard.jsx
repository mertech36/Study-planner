import {
  FiCheckCircle,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
} from "react-icons/fi";

function Dashboard({ tasks, exams, courses }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const upcomingTasks = tasks.filter(
    (task) => !task.completed
  );

  const upcomingExams = exams.length;

  const totalCourses = courses.length;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome back 👋
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            {new Date().toDateString()}
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TOTAL TASKS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 text-sm font-medium">
                Total Tasks
              </p>

              <h2 className="text-5xl font-bold mt-3 text-slate-900">
                {totalTasks}
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                All created tasks
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center shadow-inner">

              <FiClipboard
                className="text-blue-600"
                size={28}
              />

            </div>

          </div>
        </div>

        {/* COMPLETED */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 text-sm font-medium">
                Completed
              </p>

              <h2 className="text-5xl font-bold mt-3 text-slate-900">
                {completedTasks}
              </h2>

              <p className="text-sm text-green-500 mt-2">
                Great progress
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-green-100 flex items-center justify-center shadow-inner">

              <FiCheckCircle
                className="text-green-600"
                size={28}
              />

            </div>

          </div>
        </div>

        {/* EXAMS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 text-sm font-medium">
                Upcoming Exams
              </p>

              <h2 className="text-5xl font-bold mt-3 text-slate-900">
                {upcomingExams}
              </h2>

              <p className="text-sm text-orange-500 mt-2">
                Stay prepared
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-orange-100 flex items-center justify-center shadow-inner">

              <FiCalendar
                className="text-orange-600"
                size={28}
              />

            </div>

          </div>
        </div>

        {/* COURSES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-500 text-sm font-medium">
                Courses
              </p>

              <h2 className="text-5xl font-bold mt-3 text-slate-900">
                {totalCourses}
              </h2>

              <p className="text-sm text-purple-500 mt-2">
                Active subjects
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center shadow-inner">

              <FiBookOpen
                className="text-purple-600"
                size={28}
              />

            </div>

          </div>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* TASKS SECTION */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Upcoming Tasks
              </h2>

              <p className="text-slate-500 mt-1">
                Manage your study goals
              </p>
            </div>

            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-sm font-semibold">
              {upcomingTasks.length} remaining
            </div>

          </div>

          <div className="space-y-4">

            {upcomingTasks.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center">

                <p className="text-slate-500">
                  No pending tasks 🎉
                </p>

              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                >

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {task.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {task.course}
                    </p>
                  </div>

                  <div className="text-sm font-medium text-slate-400">
                    {task.dueDate}
                  </div>

                </div>
              ))
            )}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* EXAMS PANEL */}
          <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Upcoming Exams
                </h2>

                <p className="text-slate-500 mt-1 text-sm">
                  Don’t miss deadlines
                </p>
              </div>

            </div>

            <div className="space-y-4">

              {exams.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-5 text-center">

                  <p className="text-slate-500">
                    No exams added
                  </p>

                </div>
              ) : (
                exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-all duration-300"
                  >

                    <h3 className="font-semibold text-slate-900 text-lg">
                      {exam.examTitle}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
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

          {/* COURSES PANEL */}
          <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-slate-900">
                Courses
              </h2>

              <p className="text-slate-500 mt-1 text-sm">
                Your active courses
              </p>

            </div>

            <div className="space-y-3">

              {courses.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-5 text-center">

                  <p className="text-slate-500">
                    No courses added
                  </p>

                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 transition-all duration-300"
                  >

                    <span className="font-medium text-slate-800">
                      {course.name}
                    </span>

                    <span className="text-sm text-slate-500">
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