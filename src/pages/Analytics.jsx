import { useMemo, useState } from "react";
import {
  FiClock, FiCheckCircle, FiTarget, FiTrendingUp,
  FiZap, FiCalendar, FiAward, FiBarChart2,
} from "react-icons/fi";

/* ─── CONSTANTS & HELPERS ─── */
const FONT = "Inter, sans-serif";
const ORANGE = "#C85A1A";
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VISIBLE_WEEKS = 4;

const getTheme = (dm) => ({
  pageBg: dm ? "#1A110A" : "#FDE8D8",
  cardBg: dm ? "#2A1A0F" : "#FFFFFF",
  cardAltBg: dm ? "#241508" : "#FAF3EC",
  border: dm ? "#3D2410" : "#EDD9C8",
  textMain: dm ? "#F5E6D5" : "#1A0E05",
  textMuted: dm ? "#8C6A4A" : "#9C7A5A",
  track: dm ? "rgba(255,255,255,0.07)" : "#EDD9C8",
  iconBg: dm ? "rgba(200,90,26,0.18)" : "#FDEEE4",
  chip: dm ? "rgba(255,255,255,0.08)" : "#FAF3EC",
});

/** "2026-10-07" gibi tarihleri UTC yerine yerel saatte okur (gün kayması olmasın) */
const parseLocalDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
};

const toHours = (minutes) => ((minutes || 0) / 60).toFixed(1);

/* ─── SECTION HEADER (ikon + başlık + alt başlık) ─── */
function SectionHeader({ Icon, title, subtitle, theme, marginBottom = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={17} color={ORANGE} />
      </div>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: theme.textMain, margin: 0, fontFamily: FONT }}>{title}</h2>
        <p style={{ fontSize: 12, color: theme.textMuted, margin: "2px 0 0", fontFamily: FONT }}>{subtitle}</p>
      </div>
    </div>
  );
}

/* ─── MINI BAR CHART ─── */
function BarChart({ data, theme }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 144, width: "100%" }}>
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, fontFamily: FONT }}>
              {d.value > 0 ? d.value : ""}
            </span>
            <div style={{ width: "100%", display: "flex", alignItems: "flex-end", height: 100 }}>
              <div
                style={{
                  width: "100%",
                  borderRadius: 8,
                  transition: "height 0.7s",
                  height: `${Math.max(pct, d.value > 0 ? 8 : 3)}%`,
                  background: d.value > 0 ? ORANGE : theme.track,
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: FONT }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── DONUT CHART ─── */
function DonutChart({ segments, theme }) {
  const total = segments.reduce((s, x) => s + x.value, 0);

  if (total === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 192 }}>
        <div style={{ width: 144, height: 144, borderRadius: "50%", border: `14px solid ${theme.track}`, boxSizing: "border-box" }} />
        <p style={{ marginTop: 16, fontSize: 13, color: theme.textMuted, fontFamily: FONT }}>No data yet</p>
      </div>
    );
  }

  const radius = 60, cx = 80, cy = 80;
  const circ = 2 * Math.PI * radius;

  let cumulative = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circ;
    const offset = -cumulative; // her dilim, öncekilerin bittiği yerden başlar
    cumulative += dash;
    return { ...seg, dash, offset };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="160" height="160">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={theme.track} strokeWidth="18" />
        {arcs.filter((a) => a.value > 0).map((a) => (
          <circle
            key={a.label} cx={cx} cy={cy} r={radius} fill="none"
            stroke={a.color} strokeWidth="18"
            strokeDasharray={`${a.dash} ${circ - a.dash}`}
            strokeDashoffset={a.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="900" fill={theme.textMain}>{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill={theme.textMuted}>tasks</text>
      </svg>

      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px" }}>
        {segments.filter((s) => s.value > 0).map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted, fontFamily: FONT }}>
              {s.label} ({s.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── WEEK HISTORY CARD ─── */
function WeekCard({ week, theme, isCurrentWeek }) {
  const totalMinutes = week.totalMinutes || 0;
  const sessionCount = week.sessions || 0;
  const avgMin = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

  const items = [
    { val: `${toHours(totalMinutes)}h`, label: "Total" },
    { val: week.tasksCompleted || 0, label: "Tasks" },
    { val: `${avgMin}m`, label: "Avg" },
  ];

  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        border: `1px solid ${isCurrentWeek ? ORANGE : theme.border}`,
        background: isCurrentWeek ? (theme.cardBg === "#FFFFFF" ? "#FFF0E8" : "rgba(200,90,26,0.12)") : theme.cardBg,
        transition: "background 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, fontFamily: FONT }}>
          {week.weekId}
          {isCurrentWeek && <span style={{ color: ORANGE, marginLeft: 6 }}>● This Week</span>}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8, background: theme.chip, color: theme.textMuted, fontFamily: FONT }}>
          {sessionCount} sessions
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {items.map(({ val, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: theme.textMain, margin: 0, fontFamily: FONT }}>{val}</p>
            <p style={{ fontSize: 11, color: theme.textMuted, margin: "2px 0 0", fontFamily: FONT }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ANALYTICS PAGE ─── */
function Analytics({
  tasks = [],
  darkMode = false,
  currentWeek = null,
  weekHistory = [],
  streak = 0,
}) {
  const dm = darkMode;
  const theme = getTheme(dm);
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  const card = {
    background: theme.cardBg,
    borderRadius: 16,
    padding: "24px 28px",
    border: `1px solid ${theme.border}`,
    transition: "background 0.3s",
  };

  /* ── Görev istatistikleri ── */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriority = tasks.filter((t) => t.priority === "High" && !t.completed).length;
    return { total, completed, pending, productivity, highPriority };
  }, [tasks]);

  /* ── Haftalık / toplam çalışma ── */
  const thisWeekSessions = currentWeek?.sessions || 0;
  const thisWeekMinutes = currentWeek?.totalMinutes || 0;
  const avgSessionMin = thisWeekSessions > 0 ? Math.round(thisWeekMinutes / thisWeekSessions) : 0;
  const totalStudyHours = toHours(weekHistory.reduce((s, w) => s + (w.totalMinutes || 0), 0));

  /* ── Gün bazlı tamamlanan görevler ── */
  const weeklyData = useMemo(() => {
    const counts = new Array(7).fill(0);
    tasks.forEach((t) => {
      if (!t.completed || !t.dueDate) return;
      const day = parseLocalDate(t.dueDate).getDay();
      if (Number.isNaN(day)) return; // geçersiz tarihleri atla
      counts[day === 0 ? 6 : day - 1]++;
    });
    return WEEK_DAYS.map((label, i) => ({ label, value: counts[i] }));
  }, [tasks]);

  /* ── Donut verileri ── */
  const prioritySegments = useMemo(() => [
    { label: "High", value: tasks.filter((t) => t.priority === "High").length, color: "#ef4444" },
    { label: "Medium", value: tasks.filter((t) => t.priority === "Medium").length, color: "#f59e0b" },
    { label: "Low", value: tasks.filter((t) => t.priority === "Low").length, color: "#22c55e" },
  ], [tasks]);

  const statusSegments = useMemo(() => {
    const open = tasks.filter((t) => !t.completed);
    const inProgress = open.filter((t) => t.status === "In Progress").length;
    return [
      { label: "Done", value: tasks.length - open.length, color: "#22c55e" },
      { label: "In Progress", value: inProgress, color: ORANGE },
      // Durumu belirtilmemiş açık görevler de "To Do" sayılır, toplam görev sayısıyla tutarlı kalır
      { label: "To Do", value: open.length - inProgress, color: dm ? "#8C6A4A" : "#C4A882" },
    ];
  }, [tasks, dm]);

  /* ── Üst kartlar ── */
  const topStats = [
    { label: "Total Study Time", value: `${totalStudyHours}h`, sub: "All time focus sessions", Icon: FiClock },
    { label: "This Week", value: `${toHours(thisWeekMinutes)}h`, sub: `${thisWeekSessions} sessions`, Icon: FiBarChart2 },
    { label: "Sessions This Week", value: thisWeekSessions, sub: `Avg ${avgSessionMin} min/session`, Icon: FiTarget },
    { label: "Study Streak", value: `${streak} 🔥`, sub: "Consecutive days with tasks", Icon: FiAward },
  ];

  const visibleWeeks = showAllWeeks ? weekHistory : weekHistory.slice(0, VISIBLE_WEEKS);
  const currentWeekId = currentWeek?.weekId ?? weekHistory[0]?.weekId;

  const prodColor = stats.productivity >= 75 ? "#22c55e" : stats.productivity >= 50 ? "#f59e0b" : "#ef4444";

  const streakMessage =
    streak === 0 ? "Complete a task today to start your streak!"
    : streak < 7 ? "Keep going! You're building momentum."
    : streak < 30 ? "Amazing consistency! 🌟"
    : "Legendary dedication! 🏆";

  return (
    <div style={{ background: theme.pageBg, minHeight: "100vh", width: "100%", boxSizing: "border-box", transition: "background 0.3s" }}>
      <div style={{ width: "100%", boxSizing: "border-box", padding: "28px 40px 40px 80px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* HEADER */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textMain, margin: 0, fontFamily: FONT, lineHeight: 1.2 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: theme.textMuted, margin: "4px 0 0", fontFamily: FONT }}>Track your study performance over time.</p>
        </div>

        {/* TOP STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {topStats.map(({ label, value, sub, Icon }) => (
            <div key={label} style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, margin: 0, fontFamily: FONT }}>{label}</p>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} color={ORANGE} />
                </div>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: theme.textMain, margin: 0, fontFamily: FONT }}>{value}</h2>
              <p style={{ fontSize: 11, color: theme.textMuted, margin: "4px 0 0", fontFamily: FONT }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* PRODUCTIVITY METER */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <SectionHeader Icon={FiTrendingUp} title="Overall Productivity" subtitle="Based on completed tasks" theme={theme} />
            <span style={{ fontSize: 32, fontWeight: 900, color: prodColor, fontFamily: FONT }}>{stats.productivity}%</span>
          </div>

          <div style={{ width: "100%", height: 12, borderRadius: 99, overflow: "hidden", background: theme.track }}>
            <div style={{ width: `${stats.productivity}%`, height: "100%", borderRadius: 99, background: prodColor, transition: "width 0.7s" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            {[
              { label: "Total", value: stats.total, color: theme.textMain },
              { label: "Completed", value: stats.completed, color: "#22c55e" },
              { label: "Pending", value: stats.pending, color: ORANGE },
              { label: "High Priority", value: stats.highPriority, color: "#ef4444" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 900, color, margin: 0, fontFamily: FONT }}>{value}</p>
                <p style={{ fontSize: 11, color: theme.textMuted, margin: "2px 0 0", fontFamily: FONT }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY HISTORY */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <SectionHeader Icon={FiCalendar} title="Weekly History" subtitle="Past study weeks" theme={theme} />
            {weekHistory.length > VISIBLE_WEEKS && (
              <button
                onClick={() => setShowAllWeeks((v) => !v)}
                style={{ fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}
              >
                {showAllWeeks ? "Show less" : `Show all (${weekHistory.length})`}
              </button>
            )}
          </div>

          {weekHistory.length === 0 ? (
            <div style={{ background: theme.cardAltBg, borderRadius: 12, padding: "32px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, fontFamily: FONT }}>
                No weekly data yet — complete a focus session to start tracking! 🎯
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {visibleWeeks.map((week) => (
                <WeekCard key={week.weekId} week={week} theme={theme} isCurrentWeek={week.weekId === currentWeekId} />
              ))}
            </div>
          )}
        </div>

        {/* CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          <div style={card}>
            <SectionHeader Icon={FiCalendar} title="Tasks by Day" subtitle="Completed tasks per weekday" theme={theme} marginBottom={24} />
            <BarChart data={weeklyData} theme={theme} />
          </div>

          <div style={card}>
            <SectionHeader Icon={FiCheckCircle} title="Task Status" subtitle="Done, In Progress, To Do" theme={theme} marginBottom={24} />
            <DonutChart segments={statusSegments} theme={theme} />
          </div>

          <div style={card}>
            <SectionHeader Icon={FiZap} title="By Priority" subtitle="High, Medium, Low priority tasks" theme={theme} marginBottom={24} />
            <DonutChart segments={prioritySegments} theme={theme} />
          </div>

          {/* STREAK */}
          <div style={{ borderRadius: 16, padding: "24px 28px", background: ORANGE, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiAward size={17} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, fontFamily: FONT }}>Study Streak</h2>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: "2px 0 0", fontFamily: FONT }}>Days with at least 1 task completed</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              <span style={{ fontSize: 72, fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: FONT }}>{streak}</span>
              <span style={{ fontSize: 32, marginBottom: 8 }}>🔥</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "8px 0 0", fontFamily: FONT }}>{streakMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;