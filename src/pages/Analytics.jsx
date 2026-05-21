import { useMemo } from "react";
import {
  FiClock, FiCheckCircle, FiTarget, FiTrendingUp,
  FiBookOpen, FiCalendar, FiZap,
} from "react-icons/fi";

/* ─── MINI BAR CHART ─── */
function BarChart({ data, darkMode }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const dm = darkMode;

  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className={`text-xs font-bold ${dm ? "text-slate-400" : "text-slate-500"}`}>
              {d.value > 0 ? d.value : ""}
            </span>
            <div className="w-full flex items-end" style={{ height: "100px" }}>
              <div
                className="w-full rounded-xl transition-all duration-700"
                style={{
                  height: `${Math.max(pct, d.value > 0 ? 8 : 3)}%`,
                  background: d.value > 0
                    ? "linear-gradient(to top, #6366f1, #a855f7)"
                    : dm ? "rgba(255,255,255,0.05)" : "#e2e8f0",
                }}
              />
            </div>
            <span className={`text-xs ${dm ? "text-slate-500" : "text-slate-400"}`}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── DONUT CHART ─── */
function DonutChart({ segments, darkMode }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const dm = darkMode;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <div className={`w-36 h-36 rounded-full border-[14px] ${dm ? "border-white/10" : "border-slate-100"}`} />
        <p className={`mt-4 text-sm ${dm ? "text-slate-500" : "text-slate-400"}`}>No data yet</p>
      </div>
    );
  }

  let cumulative = 0;
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circ = 2 * Math.PI * radius;

  const paths = segments.map((seg) => {
    const pct = seg.value / total;
    const dash = pct * circ;
    const offset = circ - cumulative * circ;
    cumulative += pct;
    return { ...seg, dash, offset };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="160" height="160">
          {/* Background */}
          <circle cx={cx} cy={cy} r={radius} fill="none"
            stroke={dm ? "rgba(255,255,255,0.05)" : "#e2e8f0"} strokeWidth="18" />
          {/* Segments */}
          {paths.map((p, i) => (
            <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
              stroke={p.color} strokeWidth="18"
              strokeDasharray={`${p.dash} ${circ - p.dash}`}
              strokeDashoffset={p.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
          ))}
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="900"
            fill={dm ? "white" : "#0f172a"}>
            {total}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10"
            fill={dm ? "rgb(148,163,184)" : "rgb(100,116,139)"}>
            tasks
          </text>
        </svg>
      </div>

      {/* LEGEND */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {segments.filter((s) => s.value > 0).map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className={`text-xs font-medium ${dm ? "text-slate-400" : "text-slate-500"}`}>
              {s.label} ({s.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ANALYTICS PAGE ─── */
function Analytics({ tasks, courses, exams, focusHours, sessions, darkMode }) {
  const dm = darkMode;
  const card = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white border border-slate-100 shadow-sm";
  const textMain = dm ? "text-white" : "text-slate-900";
  const textSub = dm ? "text-slate-400" : "text-slate-500";
  const textMuted = dm ? "text-slate-500" : "text-slate-400";

  /* ── COMPUTED STATS ── */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriority = tasks.filter((t) => t.priority === "High" && !t.completed).length;

    return { total, completed, pending, productivity, highPriority };
  }, [tasks]);

  /* ── TASKS BY PRIORITY (donut) ── */
  const prioritySegments = useMemo(() => [
    { label: "High", value: tasks.filter((t) => t.priority === "High").length, color: "#ef4444" },
    { label: "Medium", value: tasks.filter((t) => t.priority === "Medium").length, color: "#f59e0b" },
    { label: "Low", value: tasks.filter((t) => t.priority === "Low").length, color: "#22c55e" },
  ], [tasks]);

  /* ── TASKS BY COURSE (donut) ── */
  const courseColors = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6", "#a855f7"];
  const courseSegments = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (t.course) map[t.course] = (map[t.course] || 0) + 1;
    });
    return Object.entries(map).map(([label, value], i) => ({
      label, value, color: courseColors[i % courseColors.length],
    }));
  }, [tasks]);

  /* ── WEEKLY BAR CHART (tasks completed per weekday) ── */
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    tasks.filter((t) => t.completed && t.dueDate).forEach((t) => {
      const d = new Date(t.dueDate).getDay();
      const idx = d === 0 ? 6 : d - 1;
      counts[idx]++;
    });
    return days.map((label, i) => ({ label, value: counts[i] }));
  }, [tasks]);

  /* ── STATUS BREAKDOWN ── */
  const statusSegments = useMemo(() => [
    { label: "Done", value: tasks.filter((t) => t.status === "Done" || t.completed).length, color: "#22c55e" },
    { label: "In Progress", value: tasks.filter((t) => t.status === "In Progress" && !t.completed).length, color: "#6366f1" },
    { label: "To Do", value: tasks.filter((t) => t.status === "To Do" && !t.completed).length, color: "#94a3b8" },
  ], [tasks]);

  /* ── TOP STATS ── */
  const topStats = [
    {
      label: "Productivity",
      value: `${stats.productivity}%`,
      sub: `${stats.completed} of ${stats.total} tasks done`,
      icon: FiTrendingUp,
      iconBg: dm ? "bg-blue-500/20" : "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "Focus Time",
      value: `${focusHours}h`,
      sub: `${sessions} sessions completed`,
      icon: FiClock,
      iconBg: dm ? "bg-purple-500/20" : "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      label: "Tasks Done",
      value: stats.completed,
      sub: `${stats.pending} still pending`,
      icon: FiCheckCircle,
      iconBg: dm ? "bg-green-500/20" : "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      label: "Courses",
      value: courses.length,
      sub: `${exams.length} upcoming exams`,
      icon: FiBookOpen,
      iconBg: dm ? "bg-orange-500/20" : "bg-orange-100",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-black ${textMain}`}>Analytics 📊</h1>
        <p className={`mt-1 ${textSub}`}>Track your study performance over time.</p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {topStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${card} rounded-[24px] p-5`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-semibold ${textMuted}`}>{s.label}</p>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${s.iconBg}`}>
                  <Icon className={s.iconColor} size={17} />
                </div>
              </div>
              <h2 className={`text-3xl font-black ${textMain}`}>{s.value}</h2>
              <p className={`text-xs mt-1 ${textMuted}`}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* PRODUCTIVITY METER */}
      <div className={`${card} rounded-[28px] p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-purple-500/20" : "bg-purple-100"}`}>
              <FiTarget className="text-purple-500" size={17} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${textMain}`}>Overall Productivity</h2>
              <p className={`text-xs ${textSub}`}>Based on completed tasks</p>
            </div>
          </div>
          <span className={`text-4xl font-black ${
            stats.productivity >= 75 ? "text-green-500" :
            stats.productivity >= 50 ? "text-yellow-500" : "text-red-500"
          }`}>{stats.productivity}%</span>
        </div>

        <div className={`w-full h-4 rounded-full overflow-hidden ${dm ? "bg-white/10" : "bg-slate-100"}`}>
          <div
            style={{ width: `${stats.productivity}%` }}
            className={`h-full rounded-full transition-all duration-700 ${
              stats.productivity >= 75
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : stats.productivity >= 50
                ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                : "bg-gradient-to-r from-red-400 to-pink-500"
            }`}
          />
        </div>

        <div className="flex justify-between mt-3">
          {[
            { label: "Total", value: stats.total, color: "text-slate-400" },
            { label: "Completed", value: stats.completed, color: "text-green-500" },
            { label: "Pending", value: stats.pending, color: "text-orange-500" },
            { label: "High Priority", value: stats.highPriority, color: "text-red-500" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
              <p className={`text-xs ${textMuted}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* WEEKLY BAR CHART */}
        <div className={`${card} rounded-[28px] p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-indigo-500/20" : "bg-indigo-100"}`}>
              <FiCalendar className="text-indigo-500" size={17} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${textMain}`}>Tasks by Day</h2>
              <p className={`text-xs ${textSub}`}>Completed tasks per weekday</p>
            </div>
          </div>
          <BarChart data={weeklyData} darkMode={darkMode} />
        </div>

        {/* STATUS DONUT */}
        <div className={`${card} rounded-[28px] p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-green-500/20" : "bg-green-100"}`}>
              <FiCheckCircle className="text-green-500" size={17} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${textMain}`}>Task Status</h2>
              <p className={`text-xs ${textSub}`}>Done, In Progress, To Do</p>
            </div>
          </div>
          <DonutChart segments={statusSegments} darkMode={darkMode} />
        </div>

        {/* PRIORITY DONUT */}
        <div className={`${card} rounded-[28px] p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-red-500/20" : "bg-red-100"}`}>
              <FiZap className="text-red-500" size={17} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${textMain}`}>By Priority</h2>
              <p className={`text-xs ${textSub}`}>High, Medium, Low priority tasks</p>
            </div>
          </div>
          <DonutChart segments={prioritySegments} darkMode={darkMode} />
        </div>

        {/* COURSE DONUT */}
        <div className={`${card} rounded-[28px] p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-blue-500/20" : "bg-blue-100"}`}>
              <FiBookOpen className="text-blue-500" size={17} />
            </div>
            <div>
              <h2 className={`text-lg font-black ${textMain}`}>By Course</h2>
              <p className={`text-xs ${textSub}`}>Task distribution per course</p>
            </div>
          </div>
          <DonutChart segments={courseSegments} darkMode={darkMode} />
        </div>
      </div>

      {/* RECENT COMPLETED TASKS */}
      <div className={`${card} rounded-[28px] p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-green-500/20" : "bg-green-100"}`}>
            <FiCheckCircle className="text-green-500" size={17} />
          </div>
          <h2 className={`text-lg font-black ${textMain}`}>Recent Completed Tasks</h2>
        </div>

        {tasks.filter((t) => t.completed).length === 0 ? (
          <div className={`rounded-2xl p-6 text-center ${dm ? "bg-white/5" : "bg-slate-50"}`}>
            <p className={`text-sm ${textSub}`}>No completed tasks yet 📚</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.filter((t) => t.completed).slice(-5).reverse().map((task) => (
              <div key={task.id} className={`flex items-center justify-between p-4 rounded-2xl ${dm ? "bg-white/5" : "bg-slate-50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="text-white" size={14} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold line-through ${dm ? "text-slate-400" : "text-slate-400"}`}>{task.title}</p>
                    <p className={`text-xs ${textMuted}`}>📘 {task.course}</p>
                  </div>
                </div>
                <span className={`text-xs ${textMuted}`}>{task.dueDate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
