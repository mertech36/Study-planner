import { useState, useEffect, useRef } from "react";

import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiMusic,
  FiMaximize2,
  FiZap,
  FiClock,
  FiVolume2,
  FiPlusCircle,
  FiCoffee,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi";

/* ─────────────────────────────────────────
   MODAL — prompt() yerine kullanılan güzel modal
───────────────────────────────────────── */
function Modal({ isOpen, title, fields, onConfirm, onCancel }) {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initial = {};
      fields.forEach((f) => (initial[f.key] = f.default || ""));
      setValues(initial);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* CARD */}
      <div className="relative bg-white rounded-[28px] shadow-2xl p-8 w-full max-w-md mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-slate-500 mb-2">
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                value={values[f.key] || ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder || ""}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(values)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <FiCheck size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FOCUS SAYFASI
───────────────────────────────────────── */
function Focus({ darkMode, setDarkMode }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [mode, setMode] = useState("Pomodoro");

  const [goalHours, setGoalHours] = useState(5);
  const [focusHours, setFocusHours] = useState(3.2);

  const [sessionsList, setSessionsList] = useState([
    { title: "DBMS", time: "50:00" },
    { title: "Web Development", time: "25:00" },
    { title: "Mathematics", time: "25:00" },
  ]);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    type: null, // "addSession" | "editSession" | "editGoal"
    editIndex: null,
  });

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
    "You don't rise to the level of your goals, you fall to the level of your systems.",
    "The secret of getting ahead is getting started.",
    "It always seems impossible until it's done.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work, the luckier you get.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The key to success is to focus on goals, not obstacles.",
    "Study now, flex later.",
    "Your future self is watching you right now.",
    "Do something today that your future self will thank you for.",
    "The pain of studying is temporary. The regret of not studying is permanent.",
    "Every expert was once a beginner.",
    "Work hard in silence, let success make the noise.",
    "You are capable of more than you know.",
    "Don't stop when you're tired. Stop when you're done.",
    "Talent is cheaper than table salt. What separates the talented individual from the successful one is a lot of hard work.",
    "The difference between ordinary and extraordinary is that little extra.",
    "Strive for progress, not perfection.",
    "You don't have to be great to start, but you have to start to be great.",
    "The only way to do great work is to love what you do.",
    "Knowledge is power. Power is limitless.",
    "An investment in knowledge pays the best interest.",
    "Education is the passport to the future.",
    "The more that you read, the more things you will know.",
    "Learning never exhausts the mind.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Motivation gets you going, but discipline keeps you growing.",
    "You are your only limit.",
    "Rise up, start fresh, see the bright opportunity in each day.",
    "Believe you can and you're halfway there.",
    "Act as if what you do makes a difference. It does.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Hard work beats talent when talent doesn't work hard.",
    "It's not about having time. It's about making time.",
    "Focus. Execute. Repeat.",
    "Champions keep playing until they get it right.",
    "One day or day one — you decide.",
  ];

  const [quoteIndex] = useState(() => {
    const stored = parseInt(localStorage.getItem("quoteIndex") || "0", 10);
    const next = (stored + 1) % quotes.length;
    localStorage.setItem("quoteIndex", String(next));
    return next;
  });

  const [quote, setQuote] = useState(quotes[quoteIndex]);
  const timerRef = useRef(null);

  const formatTime = (time) => time.toString().padStart(2, "0");

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes === 0) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setSessions((prev) => prev + 1);
          setFocusHours((prev) => Number((prev + 0.42).toFixed(2)));
          setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
          const audio = new Audio(
            "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
          );
          audio.play().catch(() => {});
        } else {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, seconds, minutes]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
    setMode("Pomodoro");
  };

  const breakTime = () => {
    setMode("Break");
    setMinutes(5);
    setSeconds(0);
    setIsRunning(false);
  };

  const longBreak = () => {
    setMode("Long Break");
    setMinutes(15);
    setSeconds(0);
    setIsRunning(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /* ── MODAL HANDLERS ── */

  const openAddSession = () =>
    setModal({ isOpen: true, type: "addSession", editIndex: null });

  const openEditSession = (index) =>
    setModal({ isOpen: true, type: "editSession", editIndex: index });

  const openEditGoal = () =>
    setModal({ isOpen: true, type: "editGoal", editIndex: null });

  const closeModal = () =>
    setModal({ isOpen: false, type: null, editIndex: null });

  const handleModalConfirm = (values) => {
    if (modal.type === "addSession") {
      const { name, time } = values;
      if (!name || !time) return closeModal();
      setSessionsList((prev) => [...prev, { title: name, time }]);
    }

    if (modal.type === "editSession") {
      const { name, time } = values;
      if (!name || !time) return closeModal();
      setSessionsList((prev) =>
        prev.map((s, i) =>
          i === modal.editIndex ? { title: name, time } : s
        )
      );
    }

    if (modal.type === "editGoal") {
      const parsed = Number(values.goal);
      if (!isNaN(parsed) && parsed > 0) setGoalHours(parsed);
    }

    closeModal();
  };

  const deleteSession = (index) =>
    setSessionsList((prev) => prev.filter((_, i) => i !== index));

  /* ── MODAL FIELDS ── */
  const getModalProps = () => {
    if (modal.type === "addSession") {
      return {
        title: "Add New Session",
        fields: [
          { key: "name", label: "Session Name", placeholder: "e.g. Mathematics" },
          {
            key: "time",
            label: "Duration",
            placeholder: "e.g. 25:00",
            default: "25:00",
          },
        ],
      };
    }
    if (modal.type === "editSession") {
      const s = sessionsList[modal.editIndex] || {};
      return {
        title: "Edit Session",
        fields: [
          {
            key: "name",
            label: "Session Name",
            placeholder: "e.g. Mathematics",
            default: s.title,
          },
          {
            key: "time",
            label: "Duration",
            placeholder: "e.g. 25:00",
            default: s.time,
          },
        ],
      };
    }
    if (modal.type === "editGoal") {
      return {
        title: "Edit Daily Goal",
        fields: [
          {
            key: "goal",
            label: "Goal (hours)",
            placeholder: "e.g. 6",
            type: "number",
            default: String(goalHours),
          },
        ],
      };
    }
    return { title: "", fields: [] };
  };

  /* ── HESAPLAMALAR ── */
  const totalFocusTime = sessionsList.reduce((total, session) => {
    const [min = 0, sec = 0] = session.time.split(":").map(Number);
    return total + min + sec / 60;
  }, 0);

  const goalProgress = Math.min((focusHours / goalHours) * 100, 100);

  const { title: modalTitle, fields: modalFields } = getModalProps();

  return (
    <>
      {/* MODAL */}
      <Modal
        isOpen={modal.isOpen}
        title={modalTitle}
        fields={modalFields}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
      />

      <div className="space-y-7">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-slate-900">
              Focus Mode 🎯
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Stay focused, stay consistent.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm hover:scale-105 transition-all"
            >
              <FiMaximize2 size={20} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm hover:scale-105 transition-all"
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="bg-white rounded-[30px] border border-slate-200 p-4 shadow-sm">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-7 py-3 rounded-2xl font-bold shadow-lg">
            Pomodoro
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            {/* TIMER */}
            <div className="bg-white rounded-[35px] border border-slate-200 p-10 shadow-sm">
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-10" />

              <div className="flex flex-col items-center">
                <div className="w-80 h-80 rounded-full border-[12px] border-purple-500 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                  <div className="text-center">
                    <p className="text-slate-500 text-lg mb-4">Focus Time</p>
                    <h1 className="text-8xl font-black text-slate-900">
                      {formatTime(minutes)}:{formatTime(seconds)}
                    </h1>
                    <p className="text-purple-500 font-bold text-xl mt-5">
                      {mode}
                    </p>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-4 mt-10 flex-wrap justify-center">
                  <button
                    onClick={startTimer}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-7 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                  >
                    <FiPlay />
                    Start
                  </button>

                  <button
                    onClick={pauseTimer}
                    className="bg-slate-100 px-7 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                  >
                    <FiPause />
                    Pause
                  </button>

                  <button
                    onClick={resetTimer}
                    className="bg-slate-100 px-7 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                  >
                    <FiRotateCcw />
                    Reset
                  </button>
                </div>

                {/* MINI STATS */}
                <div className="flex gap-4 mt-8 flex-wrap justify-center">
                  <div className="bg-slate-100 px-5 py-3 rounded-2xl">
                    🔥 {sessions} Sessions
                  </div>
                  <div className="bg-slate-100 px-5 py-3 rounded-2xl">
                    ⏳ {mode}
                  </div>
                  <div className="bg-slate-100 px-5 py-3 rounded-2xl">
                    ☕ Break Ready
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <FiZap className="text-yellow-500" size={24} />
                <h2 className="text-3xl font-black text-slate-900">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <button
                  onClick={breakTime}
                  className="flex flex-col items-center justify-center gap-3 bg-purple-50 rounded-3xl h-28 hover:scale-105 transition-all"
                >
                  <FiCoffee className="text-purple-500" size={28} />
                  <span className="font-semibold text-slate-700">
                    Start Break
                  </span>
                </button>

                <button
                  onClick={longBreak}
                  className="flex flex-col items-center justify-center gap-3 bg-blue-50 rounded-3xl h-28 hover:scale-105 transition-all"
                >
                  <FiClock className="text-blue-500" size={28} />
                  <span className="font-semibold text-slate-700">
                    Long Break
                  </span>
                </button>

                <button
                  onClick={openAddSession}
                  className="flex flex-col items-center justify-center gap-3 bg-green-50 rounded-3xl h-28 hover:scale-105 transition-all"
                >
                  <FiPlusCircle className="text-green-500" size={28} />
                  <span className="font-semibold text-slate-700">
                    Add Session
                  </span>
                </button>

                {/* Focus Music — Spotify direkt link */}
                <a
                  href="https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 bg-pink-50 rounded-3xl h-28 hover:scale-105 transition-all"
                >
                  <FiMusic className="text-pink-500" size={28} />
                  <span className="font-semibold text-slate-700">
                    Focus Music
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* TODAY SESSIONS */}
            <div className="bg-white rounded-[35px] border border-slate-200 p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-slate-900">
                  Today's Sessions
                </h2>
              </div>

              <div className="space-y-4">
                {sessionsList.map((session, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {session.title}
                      </h3>
                      <p className="text-slate-500 text-sm">1 Pomodoro</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {session.time}
                      </span>

                      <button
                        onClick={() => openEditSession(index)}
                        className="bg-blue-100 text-blue-500 p-2 rounded-xl hover:bg-blue-200 transition-all"
                      >
                        <FiEdit3 size={15} />
                      </button>

                      <button
                        onClick={() => deleteSession(index)}
                        className="bg-red-100 text-red-500 p-2 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-7 text-lg">
                <span className="text-slate-500">Total Focus Time</span>
                <span className="font-bold text-blue-500">
                  {Math.floor(totalFocusTime / 60)}h{" "}
                  {Math.round(totalFocusTime % 60)}m
                </span>
              </div>
            </div>

            {/* DAILY GOAL */}
            <div className="bg-white rounded-[35px] border border-slate-200 p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-3xl font-black text-slate-900">
                  Daily Goal
                </h2>
                <button
                  onClick={openEditGoal}
                  className="text-purple-500 font-bold hover:underline"
                >
                  Edit goal
                </button>
              </div>

              <h1 className="text-6xl font-black text-blue-500">
                {focusHours}h
                <span className="text-slate-400 text-3xl"> / {goalHours}h</span>
              </h1>

              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mt-7">
                <div
                  style={{ width: `${goalProgress}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* MOTIVATION */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-[35px] p-7 shadow-xl text-white">
              <h2 className="text-3xl font-black mb-5">Daily Motivation</h2>
              <p className="text-xl italic leading-relaxed">"{quote}"</p>
            </div>

            {/* FOCUS MUSIC — Spotify direkt link */}
            <div className="bg-white rounded-[35px] border border-slate-200 p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-500 text-sm">Music</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    Focus Music
                  </h2>
                </div>
                <FiVolume2 className="text-green-500" size={22} />
              </div>

              <a
                href="https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02]"
              >
                <FiMusic size={20} />
                Open in Spotify
              </a>

              <p className="text-center text-slate-400 text-sm mt-4">
                Deep Focus · Intense Studying playlist
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Focus;
