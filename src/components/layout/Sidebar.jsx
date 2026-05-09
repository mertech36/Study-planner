import {
  FiHome,
  FiCheckSquare,
  FiBookOpen,
  FiCalendar,
  FiTrendingUp,
  FiBell,
  FiSettings,
} from "react-icons/fi";

function Sidebar({
  page,
  setPage,
}){
  return (
    <aside className="w-[280px] h-screen sticky top-0 bg-white/70 backdrop-blur-2xl border-r border-white/40 shadow-xl flex flex-col px-6 py-7">

      {/* TOP LOGO */}
      <div className="flex items-center gap-4 mb-14">

        <div className="relative">

          <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 rounded-full"></div>

          <img
            src="/icon.png"
            alt="logo"
            className="relative w-14 h-14 rounded-2xl shadow-xl shadow-blue-200"
          />

        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            StudyPlanner
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Smart Student Workspace
          </p>
        </div>

      </div>

      {/* SECTION TITLE */}
      <div className="mb-4 px-2">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">
          Navigation
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-3">

        {/* DASHBOARD */}
        <button
          onClick={() => setPage("dashboard")}
          className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-left
          ${
            page === "dashboard"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
              : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiHome
            size={22}
            className={`transition ${
              page === "dashboard"
                ? "text-white"
                : "text-slate-500 group-hover:text-blue-500"
            }`}
          />

          <span>Dashboard</span>
        </button>

        {/* TASKS */}
        <button
          onClick={() => setPage("tasks")}
          className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-left
          ${
            page === "tasks"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
              : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiCheckSquare
            size={22}
            className={`transition ${
              page === "tasks"
                ? "text-white"
                : "text-slate-500 group-hover:text-green-500"
            }`}
          />

          <span>Tasks</span>
        </button>

        {/* COURSES */}
        <button
          onClick={() => setPage("courses")}
          className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-left
          ${
            page === "courses"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
              : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiBookOpen
            size={22}
            className={`transition ${
              page === "courses"
                ? "text-white"
                : "text-slate-500 group-hover:text-purple-500"
            }`}
          />

          <span>Courses</span>
        </button>

        {/* EXAMS */}
        <button
          onClick={() => setPage("exams")}
          className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-left
          ${
            page === "exams"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
              : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiCalendar
            size={22}
            className={`transition ${
              page === "exams"
                ? "text-white"
                : "text-slate-500 group-hover:text-orange-500"
            }`}
          />

          <span>Exams</span>
        </button>

      </nav>

      {/* SMALL INFO CARDS */}
      <div className="mt-10 space-y-4">

        {/* PRODUCTIVITY */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-100">

          <div className="flex items-center justify-between mb-4">

            <div>
              <p className="text-sm text-slate-500">
                Productivity
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                84%
              </h3>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">

              <FiTrendingUp
                className="text-green-600"
                size={22}
              />

            </div>

          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>

          </div>

        </div>

        {/* REMINDER */}
        <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-2xl">

          <div className="flex items-center justify-between">

            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">

              <FiBell size={22} />

            </div>

            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>

          </div>

          <h3 className="text-xl font-bold mt-6">
            Stay Focused 
          </h3>

          <p className="text-sm text-blue-100 mt-3 leading-relaxed">
            Complete your daily goals and keep your streak alive.
          </p>

<button
  onClick={() => setPage("focus")}
  className="mt-6 w-full py-3 rounded-2xl bg-white text-slate-900 font-bold hover:scale-[1.02] transition-all duration-300"
>
  Continue Studying
</button>

        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-8">

        <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-white hover:shadow-md transition-all duration-300">

          <FiSettings size={20} />

          <span className="font-medium">
            Settings
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;