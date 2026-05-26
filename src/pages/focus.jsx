import { useState, useEffect, useRef } from "react";
import {
  FiPlay, FiPause, FiRotateCcw, FiMusic, FiMaximize2, FiMinimize2,
  FiZap, FiClock, FiVolume2, FiPlusCircle, FiCoffee,
  FiEdit3, FiTrash2, FiX, FiCheck, FiSkipForward,
} from "react-icons/fi";

/* ─── CONFETTI ─── */
function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#a855f7","#6366f1","#22c55e","#f59e0b","#ec4899","#3b82f6"];
    particles.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * -canvas.height,
      w: Math.random() * 12 + 4, h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2, angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2, drift: (Math.random() - 0.5) * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.current.forEach((p) => {
        p.y += p.speed; p.x += p.drift; p.angle += p.spin;
        if (p.y < canvas.height + 20) alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      if (alive) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-40 pointer-events-none" />;
}

/* ─── MODAL ─── */
function Modal({ isOpen, title, fields, onConfirm, onCancel, darkMode }) {
  const [values, setValues] = useState({});
  useEffect(() => {
    if (isOpen) {
      const initial = {};
      fields.forEach((f) => (initial[f.key] = f.default || ""));
      setValues(initial);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const dm = darkMode;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative rounded-[28px] shadow-2xl p-8 w-full max-w-md mx-4 z-10 border ${dm ? "bg-[#1e2235] border-white/10 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">{title}</h2>
          <button onClick={onCancel} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${dm ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"}`}>
            <FiX size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className={`block text-sm font-semibold mb-2 ${dm ? "text-slate-400" : "text-slate-500"}`}>{f.label}</label>
              {f.type === "select" ? (
                <select value={values[f.key] || f.default || ""} onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  className={`w-full rounded-2xl px-5 py-3 outline-none border ${dm ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input type={f.type || "text"} value={values[f.key] || ""} onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder || ""}
                  className={`w-full rounded-2xl px-5 py-3 outline-none border ${dm ? "bg-white/5 border-white/10 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onCancel} className={`flex-1 py-3 rounded-2xl font-bold ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>Cancel</button>
          <button onClick={() => onConfirm(values)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
            <FiCheck size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CIRCULAR TIMER ─── */
function CircularTimer({ minutes, seconds, currentTotal, size = 320 }) {
  const radius = size === 320 ? 130 : 160;
  const circumference = 2 * Math.PI * radius;
  const remaining = minutes * 60 + seconds;
  const progress = currentTotal > 0 ? 1 - remaining / currentTotal : 0;
  const dashOffset = circumference * (1 - progress);
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="url(#timerGrad)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

/* ─── TIMER OVERLAY ─── */
function TimerOverlay({ isOpen, onClose, minutes, seconds, currentTotal, timerMode, isRunning, onStart, onPause, onReset, onSkip, onFocus, onBreak, onLongBreak, darkMode, completedDots, modeLabel }) {
  if (!isOpen) return null;
  const dm = darkMode;
  const formatTime = (t) => t.toString().padStart(2, "0");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className={`absolute inset-0 ${dm ? "bg-[#0a0f1e]" : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"}`} />
      <button onClick={onClose}
        className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all hover:scale-105 ${dm ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-slate-700 shadow-md hover:bg-slate-50"}`}>
        <FiMinimize2 size={20} />
      </button>
      <div className="relative flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {[
            { label: "Focus",      action: onFocus },
            { label: "Break",      action: onBreak },
            { label: "Long Break", action: onLongBreak },
          ].map(({ label, action }) => (
            <button key={label} onClick={action}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${timerMode === label
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                : dm ? "bg-white/10 text-slate-400 hover:bg-white/20" : "bg-white/60 text-slate-500 hover:bg-white"
              }`}
            >{label}</button>
          ))}
        </div>
        <div className="relative">
          <CircularTimer minutes={minutes} seconds={seconds} currentTotal={currentTotal} size={400} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-base font-medium mb-2 ${dm ? "text-slate-400" : "text-slate-500"}`}>Focus Time</p>
            <h1 className={`text-8xl font-black tabular-nums ${dm ? "text-white" : "text-slate-900"}`}>
              {formatTime(minutes)}:{formatTime(seconds)}
            </h1>
            <p className="text-purple-400 font-semibold mt-3 text-base">{modeLabel}</p>
          </div>
        </div>
        <div className="flex gap-5">
          <button onClick={onReset}
            className={`px-7 py-4 rounded-2xl font-bold flex items-center gap-2 text-base transition-all ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-white text-slate-600 shadow-md hover:bg-slate-50"}`}>
            <FiRotateCcw size={18} /> Reset
          </button>
          <button onClick={isRunning ? onPause : onStart}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all text-base">
            {isRunning ? <><FiPause size={18} /> Pause</> : <><FiPlay size={18} /> Start</>}
          </button>
          <button onClick={onSkip}
            className={`px-7 py-4 rounded-2xl font-bold flex items-center gap-2 text-base transition-all ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-white text-slate-600 shadow-md hover:bg-slate-50"}`}>
            <FiSkipForward size={18} /> Skip
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${dm ? "text-slate-500" : "text-slate-400"}`}>Focus</span>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all ${i < completedDots ? "bg-purple-500" : dm ? "bg-white/15" : "bg-slate-300"}`} />
          ))}
          <span className={`text-sm ${dm ? "text-slate-500" : "text-slate-400"}`}>{completedDots}/4</span>
        </div>
      </div>
    </div>
  );
}

/* ─── FOCUS PAGE ─── */
function Focus({ darkMode, setDarkMode, focusProps }) {
  const {
    POMODORO_TIME, BREAK_TIME, LONG_BREAK_TIME,
    focusTime, setFocusTime,
    isRunning, setIsRunning,
    timerMode, setTimerMode,
    currentTotal, setCurrentTotal,
    sessions, setSessions,
    focusHours, setFocusHours,
    goalMinutes, setGoalMinutes,
    sessionsList, setSessionsList,
    timerRef,
  } = focusProps;

  const minutes = Math.floor(focusTime / 60);
  const seconds = focusTime % 60;

  const [modal, setModal] = useState({ isOpen: false, type: null, editIndex: null });
  const [confettiActive, setConfettiActive] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [timerOverlay, setTimerOverlay] = useState(false);
  const prevGoalReached = useRef(false);

  const quotes = [
    "Discipline beats motivation.", "Small progress is still progress.",
    "Focus on becoming better.", "Consistency creates success.",
    "Deep work creates deep results.", "Dreams need discipline.",
    "Success is built daily.", "One session at a time.",
    "Keep showing up.", "Progress over perfection.",
    "Hard work beats talent when talent doesn't work hard.",
    "It's not about having time. It's about making time.",
    "Focus. Execute. Repeat.", "One day or day one — you decide.",
    "You are your only limit.", "An investment in knowledge pays the best interest.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Don't stop when you're tired. Stop when you're done.",
  ];

  const [quoteIndex] = useState(() => {
    const stored = parseInt(localStorage.getItem("quoteIndex") || "0", 10);
    const next = (stored + 1) % quotes.length;
    localStorage.setItem("quoteIndex", String(next));
    return next;
  });
  const [quote] = useState(quotes[quoteIndex]);

  useEffect(() => {
    const focusMin = focusHours * 60;
    const reached = focusMin >= goalMinutes;
    if (reached && !prevGoalReached.current) {
      setGoalReached(true);
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 4000);
    }
    prevGoalReached.current = reached;
    if (!reached) setGoalReached(false);
  }, [focusHours, goalMinutes]);

  const formatTime = (t) => t.toString().padStart(2, "0");

  const startTimer     = () => setIsRunning(true);
  const pauseTimer     = () => { clearInterval(timerRef.current); setIsRunning(false); };
  const resetTimer     = () => { clearInterval(timerRef.current); setIsRunning(false); setTimerMode("Focus"); setCurrentTotal(POMODORO_TIME); setFocusTime(POMODORO_TIME); };
  const skipSession    = () => { clearInterval(timerRef.current); setIsRunning(false); setSessions((p) => p + 1); setTimerMode("Focus"); setCurrentTotal(POMODORO_TIME); setFocusTime(POMODORO_TIME); };
  const startBreak     = () => { clearInterval(timerRef.current); setIsRunning(false); setTimerMode("Break"); setCurrentTotal(BREAK_TIME); setFocusTime(BREAK_TIME); };
  const startLongBreak = () => { clearInterval(timerRef.current); setIsRunning(false); setTimerMode("Long Break"); setCurrentTotal(LONG_BREAK_TIME); setFocusTime(LONG_BREAK_TIME); };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const openAddSession  = () => setModal({ isOpen: true, type: "addSession",  editIndex: null });
  const openEditSession = (i) => setModal({ isOpen: true, type: "editSession", editIndex: i });
  const openEditGoal    = () => setModal({ isOpen: true, type: "editGoal",    editIndex: null });
  const closeModal      = () => setModal({ isOpen: false, type: null, editIndex: null });

  const handleModalConfirm = (values) => {
    if (modal.type === "addSession" && values.name && values.time)
      setSessionsList((prev) => [...prev, { title: values.name, time: values.time }]);
    if (modal.type === "editSession" && values.name && values.time)
      setSessionsList((prev) => prev.map((s, i) => i === modal.editIndex ? { title: values.name, time: values.time } : s));
    if (modal.type === "editGoal") {
      const amount = Number(values.amount);
      const unit = values.unit || "hours";
      if (!isNaN(amount) && amount > 0) {
        setGoalMinutes(unit === "hours" ? amount * 60 : amount);
        setGoalReached(false);
        prevGoalReached.current = false;
      }
    }
    closeModal();
  };

  const deleteSession = (i) => setSessionsList((prev) => prev.filter((_, idx) => idx !== i));

  const getModalProps = () => {
    if (modal.type === "addSession") return { title: "Add New Session", fields: [
      { key: "name", label: "Session Name", placeholder: "e.g. Mathematics" },
      { key: "time", label: "Duration", placeholder: "e.g. 25:00", default: "25:00" },
    ]};
    if (modal.type === "editSession") {
      const s = sessionsList[modal.editIndex] || {};
      return { title: "Edit Session", fields: [
        { key: "name", label: "Session Name", default: s.title },
        { key: "time", label: "Duration", default: s.time },
      ]};
    }
    if (modal.type === "editGoal") return { title: "Edit Daily Goal", fields: [
      { key: "amount", label: "Goal Amount", type: "number", placeholder: "e.g. 5", default: String(goalMinutes % 60 === 0 ? goalMinutes / 60 : goalMinutes) },
      { key: "unit", label: "Unit", type: "select", default: goalMinutes % 60 === 0 ? "hours" : "minutes", options: [{ value: "hours", label: "Hours" }, { value: "minutes", label: "Minutes" }] },
    ]};
    return { title: "", fields: [] };
  };

  const totalFocusTime = sessionsList.reduce((total, s) => {
    const [min = 0, sec = 0] = s.time.split(":").map(Number);
    return total + min + sec / 60;
  }, 0);

  const goalProgress = Math.min((focusHours * 60 / goalMinutes) * 100, 100);
  const goalLabel    = goalMinutes % 60 === 0 ? `${goalMinutes / 60}h` : `${goalMinutes}m`;
  const focusLabel   = focusHours >= 1 ? `${focusHours}h` : `${Math.round(focusHours * 60)}m`;
  const { title: modalTitle, fields: modalFields } = getModalProps();
  const completedDots = sessions % 4;
  const modeLabel = currentTotal === POMODORO_TIME ? "25 min" : currentTotal === BREAK_TIME ? "5 min" : "15 min";

  const dm = darkMode;
  const card      = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white border border-slate-100 shadow-sm";
  const cardInner = dm ? "bg-white/5" : "bg-slate-50";
  const textMain  = dm ? "text-white"     : "text-slate-900";
  const textSub   = dm ? "text-slate-400" : "text-slate-500";
  const textMuted = dm ? "text-slate-500" : "text-slate-400";
  const btnGhost  = dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200";
  const divider   = dm ? "border-white/10" : "border-slate-100";

  return (
    <>
      <Confetti active={confettiActive} />
      <Modal isOpen={modal.isOpen} title={modalTitle} fields={modalFields} onConfirm={handleModalConfirm} onCancel={closeModal} darkMode={darkMode} />

      <TimerOverlay
        isOpen={timerOverlay}
        onClose={() => setTimerOverlay(false)}
        minutes={minutes} seconds={seconds}
        currentTotal={currentTotal} timerMode={timerMode}
        isRunning={isRunning}
        onStart={startTimer} onPause={pauseTimer}
        onReset={resetTimer} onSkip={skipSession}
        onFocus={resetTimer}
        onBreak={startBreak}
        onLongBreak={startLongBreak}
        darkMode={darkMode}
        completedDots={completedDots}
        modeLabel={modeLabel}
      />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-black ${textMain}`}>
              Focus Mode 🎯
              {isRunning && <span className="ml-3 text-sm font-semibold text-green-400 animate-pulse">● Running</span>}
            </h1>
            <p className={`mt-1 ${textSub}`}>Stay focused, stay consistent.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleFullscreen} className={`rounded-2xl px-4 py-2.5 border transition-all flex items-center gap-2 font-semibold text-sm hover:scale-105 ${dm ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
              <FiMaximize2 size={16} /> Fullscreen
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`rounded-2xl px-4 py-2.5 border transition-all font-semibold text-sm hover:scale-105 ${dm ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
              {dm ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">

            {/* TIMER CARD */}
            <div className={`rounded-[32px] p-8 ${card}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  {[
                    { label: "Focus",      action: resetTimer },
                    { label: "Break",      action: startBreak },
                    { label: "Long Break", action: startLongBreak },
                  ].map(({ label, action }) => (
                    <button key={label} onClick={action}
                      className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${timerMode === label
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                        : dm ? "bg-white/10 text-slate-400 hover:bg-white/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >{label}</button>
                  ))}
                </div>
                <button
                  onClick={() => setTimerOverlay(true)}
                  title="Expand timer"
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-110 ${dm ? "bg-white/10 text-slate-300 hover:bg-purple-500/30 hover:text-purple-300" : "bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-purple-600"}`}
                >
                  <FiMaximize2 size={17} />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <CircularTimer minutes={minutes} seconds={seconds} currentTotal={currentTotal} size={320} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className={`text-sm font-medium mb-1 ${textSub}`}>Focus Time</p>
                    <h1 className={`text-6xl font-black tabular-nums ${textMain}`}>
                      {formatTime(minutes)}:{formatTime(seconds)}
                    </h1>
                    <p className="text-purple-400 font-semibold mt-2 text-sm">{modeLabel}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={resetTimer} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-sm ${btnGhost}`}>
                    <FiRotateCcw size={15} /> Reset
                  </button>
                  <button onClick={isRunning ? pauseTimer : startTimer}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                    {isRunning ? <><FiPause /> Pause</> : <><FiPlay /> Start</>}
                  </button>
                  <button onClick={skipSession} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-sm ${btnGhost}`}>
                    <FiSkipForward size={15} /> Skip
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className={`text-sm ${textMuted}`}>Focus</span>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < completedDots ? "bg-purple-500" : dm ? "bg-white/15" : "bg-slate-200"}`} />
                  ))}
                  <span className={`text-sm ${textMuted}`}>{completedDots}/4</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className={`rounded-[32px] p-7 ${card}`}>
              <div className="flex items-center gap-3 mb-5">
                <FiZap className="text-yellow-500" size={20} />
                <h2 className={`text-2xl font-black ${textMain}`}>Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Start Break",  icon: <FiCoffee className="text-purple-400" size={22} />, bg: dm ? "bg-purple-500/10 hover:bg-purple-500/20" : "bg-purple-50", action: startBreak },
                  { label: "Long Break",   icon: <FiClock   className="text-blue-400"   size={22} />, bg: dm ? "bg-blue-500/10 hover:bg-blue-500/20"   : "bg-blue-50",   action: startLongBreak },
                  { label: "Add Session",  icon: <FiPlusCircle className="text-green-400" size={22} />, bg: dm ? "bg-green-500/10 hover:bg-green-500/20" : "bg-green-50", action: openAddSession },
                ].map(({ label, icon, bg, action }) => (
                  <button key={label} onClick={action}
                    className={`flex flex-col items-center justify-center gap-2 rounded-3xl h-24 hover:scale-105 transition-all ${bg}`}>
                    {icon}
                    <span className={`font-semibold text-sm ${textSub}`}>{label}</span>
                  </button>
                ))}
                <a href="https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6" target="_blank" rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center gap-2 rounded-3xl h-24 hover:scale-105 transition-all ${dm ? "bg-pink-500/10 hover:bg-pink-500/20" : "bg-pink-50"}`}>
                  <FiMusic className="text-pink-400" size={22} />
                  <span className={`font-semibold text-sm ${textSub}`}>Focus Music</span>
                </a>
              </div>
            </div>

            {/* STATS BAR */}
            <div className={`rounded-[32px] px-8 py-5 flex flex-wrap gap-6 items-center justify-between ${card}`}>
              {[
                { emoji: "🔥", label: "Streak",          value: "7 Days" },
                { emoji: "⏱️", label: "Pomodoros Today", value: `${sessions} Sessions` },
                { emoji: "⭐", label: "Focus Score",     value: "85%" },
              ].map(({ emoji, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <div>
                    <p className={`text-xs ${textMuted}`}>{label}</p>
                    <p className={`font-black text-sm ${textMain}`}>{value}</p>
                  </div>
                </div>
              ))}
              <p className={`text-sm italic ${textMuted}`}>Keep going! You're doing amazing! 💪</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-5">

            {/* TODAY SESSIONS */}
            <div className={`rounded-[32px] p-6 ${card}`}>
              <h2 className={`text-xl font-black mb-5 ${textMain}`}>Today's Sessions</h2>
              <div className="space-y-3">
                {sessionsList.map((session, index) => (
                  <div key={index} className={`rounded-2xl p-4 flex items-center justify-between gap-3 ${cardInner}`}>
                    <div>
                      <h3 className={`font-bold text-sm ${textMain}`}>{session.title}</h3>
                      <p className={`text-xs ${textMuted}`}>1 Pomodoro</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${textSub}`}>{session.time}</span>
                      <button onClick={() => openEditSession(index)} className={`p-1.5 rounded-xl transition-all ${dm ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-100 text-blue-500 hover:bg-blue-200"}`}>
                        <FiEdit3 size={13} />
                      </button>
                      <button onClick={() => deleteSession(index)} className={`p-1.5 rounded-xl transition-all ${dm ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-red-100 text-red-500 hover:bg-red-200"}`}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between mt-5 pt-4 border-t ${divider}`}>
                <span className={`text-sm ${textSub}`}>Total Focus Time</span>
                <span className="font-black text-blue-400 text-sm">
                  {Math.floor(totalFocusTime / 60)}h {Math.round(totalFocusTime % 60)}m
                </span>
              </div>
            </div>

            {/* DAILY GOAL */}
            <div className={`rounded-[32px] p-6 transition-all duration-500 ${
              goalReached
                ? dm ? "bg-green-500/20 border border-green-500/30" : "bg-green-50 border border-green-200"
                : card
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-black ${goalReached ? "text-green-400" : textMain}`}>
                  Daily Goal {goalReached && "🎉"}
                </h2>
                <button onClick={openEditGoal} className={`font-bold text-sm hover:underline ${goalReached ? "text-green-400" : "text-purple-400"}`}>
                  Edit goal
                </button>
              </div>
              <h1 className={`text-4xl font-black transition-colors duration-500 ${goalReached ? "text-green-400" : "text-blue-400"}`}>
                {focusLabel} <span className={`text-xl ${textMuted}`}>/ {goalLabel}</span>
              </h1>
              <div className={`w-full h-3 rounded-full overflow-hidden mt-4 ${dm ? "bg-white/10" : "bg-slate-100"}`}>
                <div style={{ width: `${goalProgress}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${goalReached ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-purple-500 to-blue-500"}`}
                />
              </div>
              <p className={`text-xs mt-2 font-semibold ${goalReached ? "text-green-400" : textMuted}`}>
                {goalReached ? "🏆 Goal achieved! Amazing work!" : `${Math.round(goalProgress)}% of daily goal`}
              </p>
            </div>

            {/* MOTIVATION */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[32px] p-6 shadow-xl text-white">
              <h2 className="text-lg font-black mb-3">Daily Motivation</h2>
              <p className="text-sm italic leading-relaxed opacity-90">"{quote}"</p>
            </div>

            {/* SPOTIFY */}
            <div className={`rounded-[32px] p-6 ${card}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-xs ${textMuted}`}>Music</p>
                  <h2 className={`text-lg font-black ${textMain}`}>Focus Music</h2>
                </div>
                <FiVolume2 className="text-green-400" size={18} />
              </div>
              <a href="https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all shadow-lg hover:scale-[1.02] text-sm">
                <FiMusic size={16} /> Open in Spotify
              </a>
              <p className={`text-center text-xs mt-2 ${textMuted}`}>Deep Focus · Intense Studying playlist</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Focus;