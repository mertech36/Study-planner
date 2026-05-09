import {
  FiHome,
  FiCheckSquare,
  FiBookOpen,
  FiCalendar,
  FiTrendingUp,
  FiBell,
  FiSettings,
} from "react-icons/fi";

function Sidebar({ page, setPage }) {
  return (
    <aside className="w-[260px] h-screen sticky top-0 bg-white/70 backdrop-blur-2xl border-r border-white/40 shadow-xl flex flex-col px-5 py-5 overflow-y-auto">

      {/* TOP LOGO */}
      <div className="flex items-center gap-3 mb-8 flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 rounded-full"></div>
          <img
            src="/icon.png"
            alt="logo"
            className="relative w-11 h-11 rounded-2xl shadow-xl shadow-blue-200"
          />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            StudyPlanner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Smart Student Workspace
          </p>
        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="mb-3 px-2">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">
          Navigation
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">

        {/* DASHBOARD */}
        <button
          onClick={() => setPage("dashboard")}
          className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-left
          ${page === "dashboard"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
            : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiHome size={20} className={`transition ${page === "dashboard" ? "text-white" : "text-slate-500 group-hover:text-blue-500"}`} />
          <span>Dashboard</span>
        </button>

        {/* TASKS */}
        <button
          onClick={() => setPage("tasks")}
          className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-left
          ${page === "tasks"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
            : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiCheckSquare size={20} className={`transition ${page === "tasks" ? "text-white" : "text-slate-500 group-hover:text-green-500"}`} />
          <span>Tasks</span>
        </button>

        {/* COURSES */}
        <button
          onClick={() => setPage("courses")}
          className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-left
          ${page === "courses"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
            : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiBookOpen size={20} className={`transition ${page === "courses" ? "text-white" : "text-slate-500 group-hover:text-purple-500"}`} />
          <span>Courses</span>
        </button>

        {/* EXAMS */}
        <button
          onClick={() => setPage("exams")}
          className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-left
          ${page === "exams"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
            : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
          }`}
        >
          <FiCalendar size={20} className={`transition ${page === "exams" ? "text-white" : "text-slate-500 group-hover:text-orange-500"}`} />
          <span>Exams</span>
        </button>

      </nav>

      {/* SMALL INFO CARDS */}
      <div className="mt-6 space-y-3">

        {/* PRODUCTIVITY */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-500">Productivity</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">84%</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
              <FiTrendingUp className="text-green-600" size={18} />
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
          </div>
        </div>

        {/* REMINDER */}
        <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-3xl p-5 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
              <FiBell size={18} />
            </div>
            <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse"></div>
          </div>

          <h3 className="text-lg font-bold mt-4">Stay Focused</h3>

          <p className="text-xs text-blue-100 mt-2 leading-relaxed">
            Complete your daily goals and keep your streak alive.
          </p>

          <button
            onClick={() => setPage("focus")}
            className="mt-4 w-full py-2.5 rounded-2xl bg-white text-slate-900 font-bold hover:scale-[1.02] transition-all duration-300 text-sm"
          >
            Continue Studying
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-white hover:shadow-md transition-all duration-300">
          <FiSettings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
