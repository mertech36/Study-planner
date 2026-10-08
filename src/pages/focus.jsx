import { useState, useEffect, useRef, useMemo } from "react";
import {
  FiPlay, FiPause, FiRotateCcw, FiMusic, FiMaximize2, FiMinimize2,
  FiZap, FiClock, FiVolume2, FiPlusCircle, FiCoffee,
  FiEdit3, FiTrash2, FiX, FiCheck, FiSkipForward, FiSettings,
} from "react-icons/fi";

/* ─── CONSTANTS & HELPERS ─── */
const QUOTES = [
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

const CONFETTI_COLORS = ["#a855f7", "#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6"];

const pad = (n) => String(n).padStart(2, "0");

/** Yerel saate göre YYYY-MM-DD (toISOString UTC verdiği için gece yarısı hatası yapıyordu) */
const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatStopwatch = (ms) => {
  const secs = Math.floor(ms / 1000) % 60;
  const mins = Math.floor(ms / 60000) % 60;
  const hrs = Math.floor(ms / 3600000);
  const cs = Math.floor((ms % 1000) / 10);
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(cs)}`
    : `${pad(mins)}:${pad(secs)}.${pad(cs)}`;
};

/** "25:00" -> 25 (dakika). Geçersiz değerde 0 döner. */
const parseSessionMinutes = (time) => {
  const [min = 0, sec = 0] = String(time).split(":").map(Number);
  const total = min + sec / 60;
  return Number.isFinite(total) ? total : 0;
};

const isValidDuration = (time) => /^\d{1,3}(:[0-5]\d)?$/.test(String(time).trim());

const getNextQuote = () => {
  try {
    const stored = parseInt(localStorage.getItem("quoteIndex") || "0", 10) || 0;
    const next = (stored + 1) % QUOTES.length;
    localStorage.setItem("quoteIndex", String(next));
    return QUOTES[next];
  } catch {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }
};

/* ─── CONFETTI ─── */
function Confetti({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 12 + 4,
      h: Math.random() * 6 + 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speed: Math.random() * 4 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      drift: (Math.random() - 0.5) * 2,
    }));

    let frameId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y < canvas.height + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-40 pointer-events-none" />;
}

/* ─── MODAL ─── */
function Modal({ isOpen, title, fields, onConfirm, onCancel, darkMode: dm }) {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const initial = {};
    fields.forEach((f) => { initial[f.key] = f.default ?? ""; });
    setValues(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const setValue = (key, val) => setValues((p) => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative rounded-[28px] shadow-2xl p-8 w-full max-w-md mx-4 z-10 border ${dm ? "bg-[#1e2235] border-white/10 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">{title}</h2>
          <button aria-label="Close" onClick={onCancel} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${dm ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"}`}>
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className={`block text-sm font-semibold mb-2 ${dm ? "text-slate-400" : "text-slate-500"}`}>{f.label}</label>
              {f.type === "select" ? (
                <select
                  value={values[f.key] ?? f.default ?? ""}
                  onChange={(e) => setValue(f.key, e.target.value)}
                  className={`w-full rounded-2xl px-5 py-3 outline-none border ${dm ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                >
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValue(f.key, e.target.value)}
                  placeholder={f.placeholder || ""}
                  className={`w-full rounded-2xl px-5 py-3 outline-none border ${dm ? "bg-white/5 border-white/10 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onCancel} className={`flex-1 py-3 rounded-2xl font-bold ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
            Cancel
          </button>
          <button onClick={() => onConfirm(values)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
            <FiCheck size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── TIMER SETTINGS MODAL ─── */
const TIMER_FIELDS = [
  { key: "pom", label: "Focus (minutes)", min: 1, max: 120 },
  { key: "brk", label: "Short Break (minutes)", min: 1, max: 60 },
  { key: "lng", label: "Long Break (minutes)", min: 1, max: 90 },
];

function TimerSettingsModal({ isOpen, onClose, darkMode: dm, pomodoroMin, breakMin, longBreakMin, onSave }) {
  const [vals, setVals] = useState({ pom: pomodoroMin, brk: breakMin, lng: longBreakMin });

  useEffect(() => {
    if (isOpen) setVals({ pom: pomodoroMin, brk: breakMin, lng: longBreakMin });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));
  const setVal = (key, n, min, max) => setVals((p) => ({ ...p, [key]: clamp(n, min, max) }));

  const stepBtn = `w-11 h-11 rounded-2xl font-black text-xl flex items-center justify-center transition-all ${dm ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`;
  const inputClass = `w-full rounded-2xl px-4 py-3 text-center text-2xl font-black outline-none border ${dm ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative rounded-[28px] shadow-2xl p-8 w-full max-w-sm mx-4 z-10 border ${dm ? "bg-[#1e2235] border-white/10 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Timer Settings</h2>
          <button aria-label="Close" onClick={onClose} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${dm ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"}`}>
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {TIMER_FIELDS.map(({ key, label, min, max }) => (
            <div key={key}>
              <label className={`block text-sm font-semibold mb-2 ${dm ? "text-slate-400" : "text-slate-500"}`}>{label}</label>
              <div className="flex items-center gap-3">
                <button aria-label="Decrease" onClick={() => setVal(key, vals[key] - 1, min, max)} className={stepBtn}>−</button>
                <input
                  type="number" value={vals[key]} min={min} max={max}
                  onChange={(e) => setVal(key, Number(e.target.value), min, max)}
                  className={inputClass}
                />
                <button aria-label="Increase" onClick={() => setVal(key, vals[key] + 1, min, max)} className={stepBtn}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className={`flex-1 py-3 rounded-2xl font-bold ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
            Cancel
          </button>
          <button
            onClick={() => { onSave(vals.pom, vals.brk, vals.lng); onClose(); }}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
          >
            <FiCheck size={18} /> Apply
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
  const c = size / 2;

  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx={c} cy={c} r={radius} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="12" />
      <circle
        cx={c} cy={c} r={radius} fill="none" stroke="url(#timerGrad)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${c} ${c})`}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

/* ─── TIMER OVERLAY ─── */
function TimerOverlay({
  isOpen, onClose, minutes, seconds, currentTotal, timerMode, isRunning,
  onStart, onPause, onReset, onSkip, onFocus, onBreak, onLongBreak,
  darkMode: dm, completedDots, modeLabel,
}) {
  if (!isOpen) return null;

  const ghostBtn = `px-7 py-4 rounded-2xl font-bold flex items-center gap-2 text-base transition-all ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-white text-slate-600 shadow-md hover:bg-slate-50"}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className={`absolute inset-0 ${dm ? "bg-[#0a0f1e]" : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"}`} />
      <button
        aria-label="Close fullscreen timer" onClick={onClose}
        className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all hover:scale-105 ${dm ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-slate-700 shadow-md hover:bg-slate-50"}`}
      >
        <FiMinimize2 size={20} />
      </button>

      <div className="relative flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {[
            { label: "Focus", action: onFocus },
            { label: "Break", action: onBreak },
            { label: "Long Break", action: onLongBreak },
          ].map(({ label, action }) => (
            <button
              key={label} onClick={action}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${timerMode === label
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                : dm ? "bg-white/10 text-slate-400 hover:bg-white/20" : "bg-white/60 text-slate-500 hover:bg-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative">
          <CircularTimer minutes={minutes} seconds={seconds} currentTotal={currentTotal} size={400} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-base font-medium mb-2 ${dm ? "text-slate-400" : "text-slate-500"}`}>{timerMode} Time</p>
            <h1 className={`text-8xl font-black tabular-nums ${dm ? "text-white" : "text-slate-900"}`}>
              {pad(minutes)}:{pad(seconds)}
            </h1>
            <p className="text-purple-400 font-semibold mt-3 text-base">{modeLabel}</p>
          </div>
        </div>

        <div className="flex gap-5">
          <button onClick={onReset} className={ghostBtn}><FiRotateCcw size={18} /> Reset</button>
          <button
            onClick={isRunning ? onPause : onStart}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all text-base"
          >
            {isRunning ? <><FiPause size={18} /> Pause</> : <><FiPlay size={18} /> Start</>}
          </button>
          <button onClick={onSkip} className={ghostBtn}><FiSkipForward size={18} /> Skip</button>
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
    focusTime, setFocusTime,
    isRunning, setIsRunning,
    timerMode, setTimerMode,
    currentTotal, setCurrentTotal,
    sessions, setSessions,
    goalMinutes, setGoalMinutes,
    sessionsList, setSessionsList,
    timerRef,
    dailyFocusMinutes = 0,
    setDailyFocusMinutes,
    lastFocusDate = "",
    setLastFocusDate,
  } = focusProps;

  const dm = darkMode;

  /* ── Gün değişince günlük dakikayı sıfırla ── */
  useEffect(() => {
    const today = getToday();
    if (lastFocusDate && lastFocusDate !== today && setDailyFocusMinutes) {
      setDailyFocusMinutes(0);
      setLastFocusDate?.(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Süre ayarları (dakika) ── */
  const [pomodoroMin, setPomodoroMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [longBreakMin, setLongBreakMin] = useState(15);

  const POMODORO_TIME = pomodoroMin * 60;
  const BREAK_TIME = breakMin * 60;
  const LONG_BREAK_TIME = longBreakMin * 60;

  const minutes = Math.floor(focusTime / 60);
  const seconds = focusTime % 60;

  /* ── UI state ── */
  const [modal, setModal] = useState({ isOpen: false, type: null, editIndex: null });
  const [timerSettingsOpen, setTimerSettingsOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [timerOverlay, setTimerOverlay] = useState(false);
  const [quote] = useState(getNextQuote);

  /* ── Kronometre ── */
  const [stopwatchOpen, setStopwatchOpen] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [swLaps, setSwLaps] = useState([]);
  const swRef = useRef(null);
  const swStartedAt = useRef(0);
  const swAccumulated = useRef(0);

  useEffect(() => {
    if (!swRunning) return;
    swStartedAt.current = Date.now();
    swRef.current = setInterval(() => {
      setSwTime(swAccumulated.current + (Date.now() - swStartedAt.current));
    }, 50);
    return () => clearInterval(swRef.current);
  }, [swRunning]);

  const startSw = () => setSwRunning(true);
  const pauseSw = () => {
    swAccumulated.current += Date.now() - swStartedAt.current;
    setSwRunning(false);
  };
  const resetSw = () => {
    setSwRunning(false);
    swAccumulated.current = 0;
    setSwTime(0);
    setSwLaps([]);
  };
  const lapSw = () => setSwLaps((prev) => [...prev, swTime]);

  /* Her tur için ara süre (split) hesapla; en iyi/en kötü tur split'e göre belirlenir */
  const lapSplits = useMemo(
    () => swLaps.map((lap, i) => lap - (swLaps[i - 1] ?? 0)),
    [swLaps]
  );
  const bestSplit = lapSplits.length > 1 ? Math.min(...lapSplits) : null;
  const worstSplit = lapSplits.length > 2 ? Math.max(...lapSplits) : null;

  /* ── Günlük hedef ── */
  const goalReached = goalMinutes > 0 && dailyFocusMinutes >= goalMinutes;
  const prevGoalReached = useRef(goalReached); // sayfa açılışında zaten ulaşılmışsa konfeti çıkmasın
  const confettiTimeout = useRef(null);

  useEffect(() => {
    if (goalReached && !prevGoalReached.current) {
      setConfettiActive(true);
      clearTimeout(confettiTimeout.current);
      confettiTimeout.current = setTimeout(() => setConfettiActive(false), 4000);
    }
    prevGoalReached.current = goalReached;
  }, [goalReached]);

  useEffect(() => () => clearTimeout(confettiTimeout.current), []);

  /* ── Zamanlayıcı kontrolleri ── */
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };
  const switchMode = (mode, total) => {
    stopTimer();
    setTimerMode(mode);
    setCurrentTotal(total);
    setFocusTime(total);
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = stopTimer;
  const resetTimer = () => switchMode("Focus", POMODORO_TIME);
  const startBreak = () => switchMode("Break", BREAK_TIME);
  const startLongBreak = () => switchMode("Long Break", LONG_BREAK_TIME);
  const skipSession = () => {
    // Sadece odak seansı atlanırsa sayılır; mola atlamak seans sayısını artırmaz
    if (timerMode === "Focus") setSessions((p) => p + 1);
    switchMode("Focus", POMODORO_TIME);
  };

  const handleSaveTimerSettings = (pom, brk, lng) => {
    setPomodoroMin(pom);
    setBreakMin(brk);
    setLongBreakMin(lng);
    if (isRunning) return;
    const byMode = { Focus: pom, Break: brk, "Long Break": lng };
    const mins = byMode[timerMode];
    if (mins) {
      setFocusTime(mins * 60);
      setCurrentTotal(mins * 60);
    }
  };

  const toggleFullscreen = () => {
    const action = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    action?.catch(() => {});
  };

  /* ── Modal işlemleri ── */
  const openAddSession = () => setModal({ isOpen: true, type: "addSession", editIndex: null });
  const openEditSession = (i) => setModal({ isOpen: true, type: "editSession", editIndex: i });
  const openEditGoal = () => setModal({ isOpen: true, type: "editGoal", editIndex: null });
  const closeModal = () => setModal({ isOpen: false, type: null, editIndex: null });

  const handleModalConfirm = (values) => {
    const name = values.name?.trim();
    const time = values.time?.trim();

    if (modal.type === "addSession" && name && isValidDuration(time)) {
      setSessionsList((prev) => [...prev, { title: name, time }]);
    }
    if (modal.type === "editSession" && name && isValidDuration(time)) {
      setSessionsList((prev) => prev.map((s, i) => (i === modal.editIndex ? { title: name, time } : s)));
    }
    if (modal.type === "editGoal") {
      const amount = Number(values.amount);
      if (Number.isFinite(amount) && amount > 0) {
        setGoalMinutes(values.unit === "minutes" ? amount : amount * 60);
      }
    }
    closeModal();
  };

  const deleteSession = (i) => setSessionsList((prev) => prev.filter((_, idx) => idx !== i));

  const getModalProps = () => {
    if (modal.type === "addSession") {
      return {
        title: "Add New Session",
        fields: [
          { key: "name", label: "Session Name", placeholder: "e.g. Mathematics" },
          { key: "time", label: "Duration", placeholder: "e.g. 25:00", default: "25:00" },
        ],
      };
    }
    if (modal.type === "editSession") {
      const s = sessionsList[modal.editIndex] || {};
      return {
        title: "Edit Session",
        fields: [
          { key: "name", label: "Session Name", default: s.title },
          { key: "time", label: "Duration", default: s.time },
        ],
      };
    }
    if (modal.type === "editGoal") {
      const inHours = goalMinutes % 60 === 0;
      return {
        title: "Edit Daily Goal",
        fields: [
          { key: "amount", label: "Goal Amount", type: "number", placeholder: "e.g. 5", default: String(inHours ? goalMinutes / 60 : goalMinutes) },
          {
            key: "unit", label: "Unit", type: "select", default: inHours ? "hours" : "minutes",
            options: [{ value: "hours", label: "Hours" }, { value: "minutes", label: "Minutes" }],
          },
        ],
      };
    }
    return { title: "", fields: [] };
  };

  const { title: modalTitle, fields: modalFields } = getModalProps();

  /* ── Hesaplanan değerler ── */
  const totalFocusTime = sessionsList.reduce((total, s) => total + parseSessionMinutes(s.time), 0);

  const goalProgress = goalMinutes > 0 ? Math.min((dailyFocusMinutes / goalMinutes) * 100, 100) : 0;
  const goalLabel = goalMinutes % 60 === 0 ? `${goalMinutes / 60}h` : `${goalMinutes}m`;

  const focusRounded = Math.round(dailyFocusMinutes);
  const focusLabel = focusRounded >= 60
    ? `${Math.floor(focusRounded / 60)}h${focusRounded % 60 > 0 ? ` ${focusRounded % 60}m` : ""}`
    : `${focusRounded}m`;

  const completedDots = sessions % 4;
  const modeLabel = `${{ Focus: pomodoroMin, Break: breakMin, "Long Break": longBreakMin }[timerMode] ?? pomodoroMin} min`;

  /* ── Stil sınıfları ── */
  const card = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white border border-slate-100 shadow-sm";
  const cardInner = dm ? "bg-white/5" : "bg-slate-50";
  const textMain = dm ? "text-white" : "text-slate-900";
  const textSub = dm ? "text-slate-400" : "text-slate-500";
  const textMuted = dm ? "text-slate-500" : "text-slate-400";
  const btnGhost = dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200";
  const divider = dm ? "border-white/10" : "border-slate-100";
  const headerBtn = `rounded-2xl px-4 py-2.5 border transition-all flex items-center gap-2 font-semibold text-sm hover:scale-105 ${dm ? "bg-white/5 border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`;

  const quickActions = [
    { label: "Start Break", icon: <FiCoffee className="text-purple-400" size={22} />, bg: dm ? "bg-purple-500/10 hover:bg-purple-500/20" : "bg-purple-50 hover:bg-purple-100", action: startBreak },
    { label: "Long Break", icon: <FiClock className="text-blue-400" size={22} />, bg: dm ? "bg-blue-500/10 hover:bg-blue-500/20" : "bg-blue-50 hover:bg-blue-100", action: startLongBreak },
    { label: "Add Session", icon: <FiPlusCircle className="text-green-400" size={22} />, bg: dm ? "bg-green-500/10 hover:bg-green-500/20" : "bg-green-50 hover:bg-green-100", action: openAddSession },
  ];

  return (
    <>
      <Confetti active={confettiActive} />
      <Modal isOpen={modal.isOpen} title={modalTitle} fields={modalFields} onConfirm={handleModalConfirm} onCancel={closeModal} darkMode={dm} />
      <TimerSettingsModal
        isOpen={timerSettingsOpen}
        onClose={() => setTimerSettingsOpen(false)}
        darkMode={dm}
        pomodoroMin={pomodoroMin}
        breakMin={breakMin}
        longBreakMin={longBreakMin}
        onSave={handleSaveTimerSettings}
      />
      <TimerOverlay
        isOpen={timerOverlay}
        onClose={() => setTimerOverlay(false)}
        minutes={minutes} seconds={seconds}
        currentTotal={currentTotal} timerMode={timerMode}
        isRunning={isRunning}
        onStart={startTimer} onPause={pauseTimer}
        onReset={resetTimer} onSkip={skipSession}
        onFocus={resetTimer} onBreak={startBreak} onLongBreak={startLongBreak}
        darkMode={dm}
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
            <button onClick={() => setTimerSettingsOpen(true)} className={headerBtn}>
              <FiSettings size={16} /> Timer Settings
            </button>
            <button onClick={toggleFullscreen} className={headerBtn}>
              <FiMaximize2 size={16} /> Fullscreen
            </button>
            <button onClick={() => setDarkMode(!dm)} className={headerBtn}>
              {dm ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            {/* TIMER / STOPWATCH CARD */}
            <div className={`rounded-[32px] p-8 ${card}`}>
              <div className="flex items-center justify-between mb-8">
                {stopwatchOpen ? (
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dm ? "bg-orange-500/20" : "bg-orange-100"}`}>
                      <FiClock className="text-orange-400" size={16} />
                    </div>
                    <span className={`text-lg font-black ${textMain}`}>Stopwatch</span>
                    {swRunning && <span className="text-xs font-semibold text-green-400 animate-pulse">● Running</span>}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {[
                      { label: "Focus", action: resetTimer },
                      { label: "Break", action: startBreak },
                      { label: "Long Break", action: startLongBreak },
                    ].map(({ label, action }) => (
                      <button
                        key={label} onClick={action}
                        className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${timerMode === label
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                          : dm ? "bg-white/10 text-slate-400 hover:bg-white/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => (stopwatchOpen ? setStopwatchOpen(false) : setTimerOverlay(true))}
                  title={stopwatchOpen ? "Close stopwatch" : "Expand timer"}
                  aria-label={stopwatchOpen ? "Close stopwatch" : "Expand timer"}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-110 ${dm ? "bg-white/10 text-slate-300 hover:bg-purple-500/30 hover:text-purple-300" : "bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-purple-600"}`}
                >
                  {stopwatchOpen ? <FiX size={17} /> : <FiMaximize2 size={17} />}
                </button>
              </div>

              {stopwatchOpen ? (
                /* ── STOPWATCH VIEW ── */
                <div className="flex flex-col items-center">
                  <div className={`w-full rounded-[28px] py-10 flex items-center justify-center mb-6 ${cardInner}`}>
                    <span className={`text-7xl font-black tabular-nums tracking-tight ${textMain}`}>
                      {formatStopwatch(swTime)}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={resetSw} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-sm ${btnGhost}`}>
                      <FiRotateCcw size={15} /> Reset
                    </button>
                    <button
                      onClick={swRunning ? pauseSw : startSw}
                      className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                    >
                      {swRunning ? <><FiPause /> Pause</> : <><FiPlay /> Start</>}
                    </button>
                    <button
                      onClick={lapSw} disabled={swTime === 0}
                      className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-sm disabled:opacity-40 ${btnGhost}`}
                    >
                      <FiSkipForward size={15} /> Lap
                    </button>
                  </div>

                  {swLaps.length > 0 && (
                    <div className={`w-full mt-6 rounded-[20px] overflow-hidden border ${dm ? "border-white/10" : "border-slate-100"}`}>
                      <div className="max-h-40 overflow-y-auto">
                        {swLaps.map((lap, idx) => {
                          const split = lapSplits[idx];
                          const isBest = split === bestSplit;
                          const isWorst = split === worstSplit;
                          return { lap, idx, split, isBest, isWorst };
                        }).reverse().map(({ lap, idx, split, isBest, isWorst }) => (
                          <div key={idx} className={`flex items-center justify-between px-5 py-2.5 border-b last:border-b-0 ${dm ? "border-white/5" : "border-slate-50"}`}>
                            <span className={`text-sm font-semibold w-14 ${textSub}`}>Lap {idx + 1}</span>
                            <span className={`text-xs tabular-nums ${isBest ? "text-green-500" : isWorst ? "text-red-500" : textMuted}`}>
                              +{formatStopwatch(split)} {isBest ? "🏆" : isWorst ? "🐢" : ""}
                            </span>
                            <span className={`text-sm font-black tabular-nums ${textMain}`}>{formatStopwatch(lap)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── POMODORO VIEW ── */
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <CircularTimer minutes={minutes} seconds={seconds} currentTotal={currentTotal} size={320} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className={`text-sm font-medium mb-1 ${textSub}`}>{timerMode} Time</p>
                      <h1 className={`text-6xl font-black tabular-nums ${textMain}`}>
                        {pad(minutes)}:{pad(seconds)}
                      </h1>
                      <p className="text-purple-400 font-semibold mt-2 text-sm">{modeLabel}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={resetTimer} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-sm ${btnGhost}`}>
                      <FiRotateCcw size={15} /> Reset
                    </button>
                    <button
                      onClick={isRunning ? pauseTimer : startTimer}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                    >
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
              )}
            </div>

            {/* QUICK ACTIONS */}
            <div className={`rounded-[32px] p-7 ${card}`}>
              <div className="flex items-center gap-3 mb-5">
                <FiZap className="text-yellow-500" size={20} />
                <h2 className={`text-2xl font-black ${textMain}`}>Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map(({ label, icon, bg, action }) => (
                  <button key={label} onClick={action} className={`flex flex-col items-center justify-center gap-2 rounded-3xl h-24 hover:scale-105 transition-all ${bg}`}>
                    {icon}
                    <span className={`font-semibold text-sm ${textSub}`}>{label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setStopwatchOpen(true)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-3xl h-24 hover:scale-105 transition-all ${stopwatchOpen
                    ? dm ? "bg-orange-500/30 ring-2 ring-orange-400/40" : "bg-orange-100 ring-2 ring-orange-300"
                    : dm ? "bg-orange-500/10 hover:bg-orange-500/20" : "bg-orange-50 hover:bg-orange-100"}`}
                >
                  <FiClock className="text-orange-400" size={22} />
                  <span className={`font-semibold text-sm ${textSub}`}>Stopwatch</span>
                </button>
              </div>
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
                      <button
                        aria-label="Edit session" onClick={() => openEditSession(index)}
                        className={`p-1.5 rounded-xl transition-all ${dm ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-100 text-blue-500 hover:bg-blue-200"}`}
                      >
                        <FiEdit3 size={13} />
                      </button>
                      <button
                        aria-label="Delete session" onClick={() => deleteSession(index)}
                        className={`p-1.5 rounded-xl transition-all ${dm ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-red-100 text-red-500 hover:bg-red-200"}`}
                      >
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
            <div className={`rounded-[32px] p-6 transition-all duration-500 ${goalReached
              ? dm ? "bg-green-500/20 border border-green-500/30" : "bg-green-50 border border-green-200"
              : card}`}
            >
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
                <div
                  style={{ width: `${goalProgress}%` }}
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
              <a
                href="https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all shadow-lg hover:scale-[1.02] text-sm"
              >
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