import { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useStudyStats } from "./hooks/useStudyStats";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import Focus from "./pages/focus";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

const POMODORO_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

function App() {
  /* ── AUTH ── */
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  /* ── STUDY STATS (Firestore) ── */
  const { currentWeek, weekHistory, streak, recordFocusSession, recordTaskCompleted } = useStudyStats(user?.uid);

  /* ── APP STATE ── */
  const [page, setPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");

  /* ── SETTINGS STATE ── */
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "Alex Johnson");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "alex.johnson@email.com");
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem("themeColor") || "blue");
  const [notifExams, setNotifExams] = useState(() => localStorage.getItem("notifExams") !== "false");
  const [notifTasks, setNotifTasks] = useState(() => localStorage.getItem("notifTasks") === "true");
  const [notifFocus, setNotifFocus] = useState(() => localStorage.getItem("notifFocus") !== "false");

  useEffect(() => { localStorage.setItem("userName", userName); }, [userName]);
  useEffect(() => { localStorage.setItem("userEmail", userEmail); }, [userEmail]);
  useEffect(() => { localStorage.setItem("themeColor", themeColor); }, [themeColor]);
  useEffect(() => { localStorage.setItem("notifExams", String(notifExams)); }, [notifExams]);
  useEffect(() => { localStorage.setItem("notifTasks", String(notifTasks)); }, [notifTasks]);
  useEffect(() => { localStorage.setItem("notifFocus", String(notifFocus)); }, [notifFocus]);

  /* ── DATA ── */
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [exams, setExams] = useState(() => JSON.parse(localStorage.getItem("exams")) || []);
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("courses")) || []);

  useEffect(() => { localStorage.setItem("tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem("exams", JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem("courses", JSON.stringify(courses)); }, [courses]);

  /* ── TIMER ── */
  const [focusTime, setFocusTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("Focus");
  const [currentTotal, setCurrentTotal] = useState(POMODORO_TIME);
  const [sessions, setSessions] = useState(0);
  const [focusHours, setFocusHours] = useState(0);
  const [goalMinutes, setGoalMinutes] = useState(300);
  const [sessionsList, setSessionsList] = useState([
    { title: "DBMS", time: "50:00" },
    { title: "Web Development", time: "25:00" },
    { title: "Mathematics", time: "25:00" },
  ]);

  const timerRef = useRef(null);

  const playAlarm = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = "sine";
        gain.gain.setValueAtTime(0.4, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      beep(880, 0, 0.3); beep(1100, 0.35, 0.3);
      beep(880, 0.7, 0.3); beep(1100, 1.05, 0.5);
    } catch (e) {}
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setFocusTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setSessions((p) => p + 1);
            setFocusHours((p) => Number((p + 0.42).toFixed(2)));
            // Firestore'a kaydet
            recordFocusSession(25);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const focusProps = {
    POMODORO_TIME, BREAK_TIME, LONG_BREAK_TIME,
    focusTime, setFocusTime,
    isRunning, setIsRunning,
    timerMode, setTimerMode,
    currentTotal, setCurrentTotal,
    sessions, setSessions,
    focusHours, setFocusHours,
    goalMinutes, setGoalMinutes,
    sessionsList, setSessionsList,
    timerRef, playAlarm,
  };

  const settingsProps = {
    userName, setUserName,
    userEmail, setUserEmail,
    themeColor, setThemeColor,
    notifExams, setNotifExams,
    notifTasks, setNotifTasks,
    notifFocus, setNotifFocus,
    onSignOut: handleSignOut,
  };

  /* ── AUTH LOADING SCREEN ── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 rounded-full" />
            <img src="/icon.png" alt="logo" className="relative w-16 h-16 rounded-3xl shadow-2xl" />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── NOT LOGGED IN ── */
  if (!user) {
    if (authScreen === "register") {
      return <Register onSwitchToLogin={() => setAuthScreen("login")} />;
    }
    return <Login onSwitchToRegister={() => setAuthScreen("register")} />;
  }

  /* ── LOGGED IN ── */
  const renderPage = () => {
    if (page === "dashboard") return (
      <Dashboard tasks={tasks} setTasks={setTasks} exams={exams} courses={courses}
        setPage={setPage} setTaskFilter={setTaskFilter}
        darkMode={darkMode} setDarkMode={setDarkMode} />
    );
    if (page === "tasks") return (
      <Tasks tasks={tasks} setTasks={setTasks}
        taskFilter={taskFilter} setTaskFilter={setTaskFilter}
        darkMode={darkMode}
        onTaskComplete={recordTaskCompleted}
      />
    );
    if (page === "courses") return (
      <Courses courses={courses} setCourses={setCourses} darkMode={darkMode} />
    );
    if (page === "exams") return (
      <Exams exams={exams} setExams={setExams} darkMode={darkMode} />
    );
    if (page === "focus") return (
      <Focus darkMode={darkMode} setDarkMode={setDarkMode} focusProps={focusProps} />
    );
    if (page === "analytics") return (
      <Analytics
        tasks={tasks} courses={courses} exams={exams}
        focusHours={focusHours} sessions={sessions} darkMode={darkMode}
        currentWeek={currentWeek}
        weekHistory={weekHistory}
        streak={streak}
      />
    );
    if (page === "settings") return (
      <Settings darkMode={darkMode} setDarkMode={setDarkMode} settingsProps={settingsProps} />
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-[#0f172a] via-[#081028] to-[#020617]"
        : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"
    }`}>
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed top-5 left-5 z-50 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105 ${
          darkMode ? "bg-white/10 text-white border border-white/10" : "bg-white text-slate-700 border border-slate-200"
        } ${sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <FiMenu size={20} />
      </button>

      <Sidebar
        page={page} setPage={setPage}
        isOpen={sidebarOpen} setIsOpen={setSidebarOpen}
        darkMode={darkMode} tasks={tasks}
      />

      <main className="min-h-screen p-8 pt-20">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;