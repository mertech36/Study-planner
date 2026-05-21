import {
  FiHome,
  FiCheckSquare,
  FiBookOpen,
  FiCalendar,
  FiTrendingUp,
  FiBell,
  FiSettings,
  FiX,
  FiBarChart2,
} from "react-icons/fi";

function Sidebar({ page, setPage, isOpen, setIsOpen, darkMode, tasks }) {
  const dm = darkMode;

  const total = tasks?.length || 0;
  const completed = tasks?.filter((t) => t.completed).length || 0;
  const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome, activeColor: "group-hover:text-blue-500" },
    { id: "tasks", label: "Tasks", icon: FiCheckSquare, activeColor: "group-hover:text-green-500" },
    { id: "courses", label: "Courses", icon: FiBookOpen, activeColor: "group-hover:text-purple-500" },
    { id: "exams", label: "Exams", icon: FiCalendar, activeColor: "group-hover:text-orange-500" },
  ];

  const handleNav = (id) => {
    setPage(id);
    setIsOpen(false);
  };

  const productivityColor =
    productivity >= 75 ? "from-green-400 to-emerald-500" :
    productivity >= 50 ? "from-yellow-400 to-orange-400" :
    "from-red-400 to-pink-500";

  const productivityTextColor =
    productivity >= 75 ? (dm ? "text-green-400" : "text-green-600") :
    productivity >= 50 ? (dm ? "text-yellow-400" : "text-yellow-600") :
    (dm ? "text-red-400" : "text-red-500");

  const productivityIconBg =
    productivity >= 75 ? "bg-green-100" :
    productivity >= 50 ? "bg-yellow-100" : "bg-red-100";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col px-5 py-5 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${dm
            ? "bg-[#0f172a]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl"
            : "bg-white/90 backdrop-blur-2xl border-r border-white/40 shadow-2xl"
          }
          ${isOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px]"}
        `}
      >
        {/* TOP — logo + close */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 rounded-full" />
              <img src="/icon.png" alt="logo" className="relative w-11 h-11 rounded-2xl shadow-xl shadow-blue-200" />
            </div>
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${dm ? "text-white" : "text-slate-900"}`}>
                StudyPlanner
              </h1>
              <p className={`text-xs mt-0.5 ${dm ? "text-slate-400" : "text-slate-500"}`}>
                Smart Student Workspace
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* SECTION TITLE */}
        <div className="mb-3 px-2">
          <p className={`text-xs uppercase tracking-[0.25em] font-bold ${dm ? "text-slate-500" : "text-slate-400"}`}>
            Navigation
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ id, label, icon: Icon, activeColor }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-left
                ${page === id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
                  : dm
                    ? "text-slate-300 hover:bg-white/10 hover:scale-[1.01]"
                    : "text-slate-600 hover:bg-white hover:shadow-lg hover:scale-[1.01]"
                }`}
            >
              <Icon
                size={20}
                className={`transition ${page === id ? "text-white" : `${dm ? "text-slate-400" : "text-slate-500"} ${activeColor}`}`}
              />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* INFO CARDS */}
        <div className="mt-6 space-y-3">

          {/* ANALYTİCS KARTI (eskiden Productivity) */}
          <button
            onClick={() => handleNav("analytics")}
            className={`w-full rounded-3xl p-4 border text-left hover:scale-[1.02] transition-all duration-300 ${
              dm
                ? "bg-white/5 border-white/10 hover:bg-white/10"
                : "bg-white border-slate-100 shadow-md hover:shadow-lg"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`text-xs ${dm ? "text-slate-400" : "text-slate-500"}`}>Analytics</p>
                <h3 className={`text-xl font-bold mt-0.5 ${productivityTextColor}`}>
                  {productivity}%
                </h3>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${productivityIconBg}`}>
                <FiTrendingUp className={productivityTextColor} size={18} />
              </div>
            </div>
            <div className={`h-2.5 rounded-full overflow-hidden ${dm ? "bg-white/10" : "bg-slate-100"}`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${productivityColor} transition-all duration-700`}
                style={{ width: `${productivity}%` }}
              />
            </div>
            <p className={`text-xs mt-2 ${dm ? "text-slate-500" : "text-slate-400"}`}>
              {completed}/{total} tasks · tap for analytics
            </p>
          </button>

          {/* REMINDER */}
          <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-3xl p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
                <FiBell size={18} />
              </div>
              <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" />
            </div>
            <h3 className="text-lg font-bold mt-4">Stay Focused</h3>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Complete your daily goals and keep your streak alive.
            </p>
            <button
              onClick={() => handleNav("focus")}
              className="mt-4 w-full py-2.5 rounded-2xl bg-white text-slate-900 font-bold hover:scale-[1.02] transition-all duration-300 text-sm"
            >
              Continue Studying
            </button>
          </div>
        </div>

        {/* FOOTER — Settings */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => handleNav("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
              page === "settings"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02]"
                : dm
                  ? "text-slate-400 hover:bg-white/10"
                  : "text-slate-500 hover:bg-white hover:shadow-md"
            }`}
          >
            <FiSettings size={18} className={page === "settings" ? "text-white" : ""} />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
