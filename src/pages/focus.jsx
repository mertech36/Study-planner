import { useState, useEffect, useRef } from "react";
import {
  FiPlay, FiPause, FiRotateCcw, FiMusic, FiMaximize2,
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

    const colors = ["#a855f7", "#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6"];
    particles.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 12 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      drift: (Math.random() - 0.5) * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.current.forEach((p) => {
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
      if (alive) animRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); ctx.clearRect(0, 0, canvas.width, canvas.height); };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
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
                <select
                  value={values[f.key] || f.default || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className={`w-full rounded-2xl px-5 py-3 outline-none transition-all border ${dm ? "bg-white/5 border-white/10 text-white focus:ring-4 focus:ring-purple-500/20" : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-4 focus:ring-purple-100"}`}
                >
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder || ""}
                  className={`w-full rounded-2xl px-5 py-3 outline-none transition-all border ${dm ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400" : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-300"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onCancel} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
            Cancel
          </button>
          <button onClick={() => onConfirm(values)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            <FiCheck size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CIRCULAR TIMER ─── */
function CircularTimer({ minutes, seconds, currentTotal }) {
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const remaining = minutes * 60 + seconds;
  const progress = currentTotal > 0 ? 1 - remaining / currentTotal : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width="320" height="320">
      <defs>
        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="160" r={radius} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="12" />
      <circle
        cx="160" cy="160" r={radius} fill="none"
        stroke="url(#timerGrad)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        transform="rotate(-90 160 160)"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}


/* ─── FOCUS PAGE ─── */
function Focus({
  darkMode,
  setDarkMode,

  focusTime,
  setFocusTime,

  isRunning,
  setIsRunning,
}) {

  const POMODORO_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  const LONG_BREAK_TIME = 15 * 60;

  /* TIMER VALUES */
  const minutes =
    Math.floor(focusTime / 60);

  const seconds =
    focusTime % 60;

  /* STATES */
  const [sessions, setSessions] =
    useState(0);

  const [mode, setMode] =
    useState("Focus");

  const [currentTotal, setCurrentTotal] =
    useState(POMODORO_TIME);

  const [goalMinutes, setGoalMinutes] =
    useState(300);

  const [focusHours, setFocusHours] =
    useState(3.2);

  const [confettiActive, setConfettiActive] =
    useState(false);

  const [goalReached, setGoalReached] =
    useState(false);

  const prevGoalReached =
    useRef(false);

  const [sessionsList, setSessionsList] =
    useState([
      {
        title: "DBMS",
        time: "50:00",
      },
      {
        title: "Web Development",
        time: "25:00",
      },
      {
        title: "Mathematics",
        time: "25:00",
      },
    ]);

  const [modal, setModal] =
    useState({
      isOpen: false,
      type: null,
      editIndex: null,
    });

  /* GOAL CHECK */
  useEffect(() => {

    const focusMin =
      focusHours * 60;

    const reached =
      focusMin >= goalMinutes;

    if (
      reached &&
      !prevGoalReached.current
    ) {

      setGoalReached(true);

      setConfettiActive(true);

      setTimeout(() => {
        setConfettiActive(false);
      }, 4000);
    }

    prevGoalReached.current =
      reached;

    if (!reached) {
      setGoalReached(false);
    }

  }, [
    focusHours,
    goalMinutes,
  ]);

  /* QUOTES */
  const quotes = [
    "Discipline beats motivation.",
    "Small progress is still progress.",
    "Focus on becoming better.",
    "Consistency creates success.",
    "Deep work creates deep results.",
    "Dreams need discipline.",
    "Success is built daily.",
    "One session at a time.",
    "Keep showing up.",
    "Progress over perfection.",
  ];

  const [quoteIndex] =
    useState(() => {

      const stored =
        parseInt(
          localStorage.getItem(
            "quoteIndex"
          ) || "0",
          10
        );

      const next =
        (stored + 1) %
        quotes.length;

      localStorage.setItem(
        "quoteIndex",
        String(next)
      );

      return next;
    });

  const [quote, setQuote] =
    useState(
      quotes[quoteIndex]
    );

  const timerRef =
    useRef(null);

  /* ALARM */
  const playAlarm = () => {

    try {

      const ctx = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

      const beep = (
        freq,
        start,
        dur
      ) => {

        const osc =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        osc.connect(gain);

        gain.connect(
          ctx.destination
        );

        osc.frequency.value =
          freq;

        osc.type = "sine";

        gain.gain.setValueAtTime(
          0.4,
          ctx.currentTime + start
        );

        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime +
            start +
            dur
        );

        osc.start(
          ctx.currentTime +
            start
        );

        osc.stop(
          ctx.currentTime +
            start +
            dur
        );
      };

      beep(880, 0, 0.3);
      beep(1100, 0.35, 0.3);
      beep(880, 0.7, 0.3);
      beep(1100, 1.05, 0.5);

    } catch (e) {}
  };

  /* FORMAT */
  const formatTime = (t) =>
    t.toString().padStart(2, "0");

  /* TIMER */
  useEffect(() => {

    if (isRunning) {

      timerRef.current =
        setInterval(() => {

          setFocusTime(
            (prev) => {

              if (prev <= 1) {

                clearInterval(
                  timerRef.current
                );

                setIsRunning(false);

                setSessions(
                  (p) => p + 1
                );

                setFocusHours(
                  (p) =>
                    Number(
                      (
                        p + 0.42
                      ).toFixed(2)
                    )
                );

                setQuote(
                  quotes[
                    Math.floor(
                      Math.random() *
                        quotes.length
                    )
                  ]
                );

                playAlarm();

                return 0;
              }

              return prev - 1;
            }
          );

        }, 1000);
    }

    return () =>
      clearInterval(
        timerRef.current
      );

  }, [isRunning]);



  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => { clearInterval(timerRef.current); setIsRunning(false); };
  const resetTimer = () => {
    clearInterval(timerRef.current);
    remainingRef.current = POMODORO_TIME;
    setMinutes(25); setSeconds(0); setIsRunning(false);
    setMode("Focus"); setCurrentTotal(POMODORO_TIME);
  };
  const skipSession = () => {
    clearInterval(timerRef.current);
    remainingRef.current = POMODORO_TIME;
    setSessions((prev) => prev + 1);
    setMinutes(25); setSeconds(0); setIsRunning(false);
    setMode("Focus"); setCurrentTotal(POMODORO_TIME);
  };
  const setBreak = () => {
    clearInterval(timerRef.current);
    remainingRef.current = BREAK_TIME;
    setMode("Break"); setMinutes(5); setSeconds(0);
    setIsRunning(false); setCurrentTotal(BREAK_TIME);
  };
  const setLongBreak = () => {
    clearInterval(timerRef.current);
    remainingRef.current = LONG_BREAK_TIME;
    setMode("Long Break"); setMinutes(15); setSeconds(0);
    setIsRunning(false); setCurrentTotal(LONG_BREAK_TIME);
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const openAddSession = () => setModal({ isOpen: true, type: "addSession", editIndex: null });
  const openEditSession = (i) => setModal({ isOpen: true, type: "editSession", editIndex: i });
  const openEditGoal = () => setModal({ isOpen: true, type: "editGoal", editIndex: null });
  const closeModal = () => setModal({ isOpen: false, type: null, editIndex: null });

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
    if (modal.type === "addSession") return {
      title: "Add New Session",
      fields: [
        { key: "name", label: "Session Name", placeholder: "e.g. Mathematics" },
        { key: "time", label: "Duration", placeholder: "e.g. 25:00", default: "25:00" },
      ],
    };
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
    if (modal.type === "editGoal") return {
      title: "Edit Daily Goal",
      fields: [
        { key: "amount", label: "Goal Amount", type: "number", placeholder: "e.g. 5", default: String(goalMinutes >= 60 ? goalMinutes / 60 : goalMinutes) },
        {
          key: "unit", label: "Unit", type: "select",
          default: goalMinutes % 60 === 0 ? "hours" : "minutes",
          options: [{ value: "hours", label: "Hours" }, { value: "minutes", label: "Minutes" }],
        },
      ],
    };
    return { title: "", fields: [] };
  };

  const totalFocusTime = sessionsList.reduce((total, s) => {
    const [min = 0, sec = 0] = s.time.split(":").map(Number);
    return total + min + sec / 60;
  }, 0);

  const focusMinutes = focusHours * 60;
  const goalProgress = Math.min((focusMinutes / goalMinutes) * 100, 100);

  // Goal display label
  const goalLabel = goalMinutes % 60 === 0
    ? `${goalMinutes / 60}h`
    : `${goalMinutes}m`;

  const focusLabel = focusHours >= 1
    ? `${focusHours}h`
    : `${Math.round(focusHours * 60)}m`;

  const { title: modalTitle, fields: modalFields } = getModalProps();
  const completedDots = sessions % 4;
  const modeLabel = currentTotal === POMODORO_TIME ? "25 min" : currentTotal === BREAK_TIME ? "5 min" : "15 min";

  const dm = darkMode;
  const card = dm ? "bg-[#1a1f35] border border-white/5 shadow-none" : "bg-white border border-slate-100 shadow-sm";
  const cardInner = dm ? "bg-white/5" : "bg-slate-50";
  const textMain = dm ? "text-white" : "text-slate-900";
  const textSub = dm ? "text-slate-400" : "text-slate-500";
  const textMuted = dm ? "text-slate-500" : "text-slate-400";
  const btnGhost = dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200";
  const divider = dm ? "border-white/10" : "border-slate-100";

  return (
    <>
      <Confetti active={confettiActive} />
      <Modal isOpen={modal.isOpen} title={modalTitle} fields={modalFields} onConfirm={handleModalConfirm} onCancel={closeModal} darkMode={darkMode} />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-black ${textMain}`}>Focus Mode 🎯</h1>
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
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-5">

            {/* TIMER CARD */}
            <div className={`rounded-[32px] p-8 ${card}`}>
              <div className="flex gap-2 mb-8">
                {[{ label: "Focus", action: resetTimer }, { label: "Break", action: setBreak }, { label: "Long Break", action: setLongBreak }].map(({ label, action }) => (
                  <button key={label} onClick={action}
                    className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${mode === label
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                      : dm ? "bg-white/10 text-slate-400 hover:bg-white/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >{label}</button>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <CircularTimer minutes={minutes} seconds={seconds} currentTotal={currentTotal} />
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
            </div>

            {/* QUICK ACTIONS */}
            <div className={`rounded-[32px] p-7 ${card}`}>
              <div className="flex items-center gap-3 mb-5">
                <FiZap className="text-yellow-500" size={20} />
                <h2 className={`text-2xl font-black ${textMain}`}>Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Start Break", icon: <FiCoffee className="text-purple-400" size={22} />, bg: dm ? "bg-purple-500/10 hover:bg-purple-500/20" : "bg-purple-50", action: setBreak, href: null },
                  { label: "Long Break", icon: <FiClock className="text-blue-400" size={22} />, bg: dm ? "bg-blue-500/10 hover:bg-blue-500/20" : "bg-blue-50", action: setLongBreak, href: null },
                  { label: "Add Session", icon: <FiPlusCircle className="text-green-400" size={22} />, bg: dm ? "bg-green-500/10 hover:bg-green-500/20" : "bg-green-50", action: openAddSession, href: null },
                  { label: "Focus Music", icon: <FiMusic className="text-pink-400" size={22} />, bg: dm ? "bg-pink-500/10 hover:bg-pink-500/20" : "bg-pink-50", action: null, href: "https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6" },
                ].map(({ label, icon, bg, action, href }) =>
                  href ? (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-2 rounded-3xl h-24 hover:scale-105 transition-all ${bg}`}>
                      {icon}
                      <span className={`font-semibold text-sm ${textSub}`}>{label}</span>
                    </a>
                  ) : (
                    <button key={label} onClick={action}
                      className={`flex flex-col items-center justify-center gap-2 rounded-3xl h-24 hover:scale-105 transition-all ${bg}`}>
                      {icon}
                      <span className={`font-semibold text-sm ${textSub}`}>{label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* STATS BAR */}
            <div className={`rounded-[32px] px-8 py-5 flex flex-wrap gap-6 items-center justify-between ${card}`}>
              {[
                { emoji: "🔥", label: "Streak", value: "7 Days" },
                { emoji: "⏱️", label: "Pomodoros Today", value: `${sessions} Sessions` },
                { emoji: "⭐", label: "Focus Score", value: "85%" },
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

          {/* RIGHT */}
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
                <div
                  style={{ width: `${goalProgress}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    goalReached
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-purple-500 to-blue-500"
                  }`}
                />
              </div>

              <p className={`text-xs mt-2 font-semibold transition-colors duration-500 ${goalReached ? "text-green-400" : textMuted}`}>
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
