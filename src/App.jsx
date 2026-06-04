import { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import Focus from "./pages/Focus";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

const POMODORO_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

/* ── Firestore'a kullanıcı verisini kaydet ── */
async function saveUserData(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
}

function App() {
  /* ── AUTH ── */
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authScreen, setAuthScreen] = useState("login");

  /* ── APP STATE ── */
  const [page, setPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");

  /* ── USER DATA — Firestore'dan gelir ── */
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  /* ── SETTINGS ── */
  const [userName, setUserName] = useState("Alex Johnson");
  const [userEmail, setUserEmail] = useState("");
  const [themeColor, setThemeColor] = useState("blue");
  const [notifExams, setNotifExams] = useState(true);
  const [notifTasks, setNotifTasks] = useState(false);
  const [notifFocus, setNotifFocus] = useState(true);

  /* ── TIMER STATE ── */
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
  const saveTimeoutRef = useRef(null);
  const snapshotUnsubRef = useRef(null);

  /* ── AUTH LISTENER ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      // Önceki snapshot dinleyiciyi kapat
      if (snapshotUnsubRef.current) {
        snapshotUnsubRef.current();
        snapshotUnsubRef.current = null;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        setDataLoading(true);

        const ref = doc(db, "users", firebaseUser.uid);

        // Gerçek zamanlı dinleyici — her cihazda anında güncellenir
        const unsubSnapshot = onSnapshot(
          ref,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (data.tasks) setTasks(data.tasks);
              if (data.exams) setExams(data.exams);
              if (data.courses) setCourses(data.courses);
              if (data.userName) setUserName(data.userName);
              if (data.userEmail) setUserEmail(data.userEmail);
              if (data.themeColor) setThemeColor(data.themeColor);
              if (data.notifExams !== undefined) setNotifExams(data.notifExams);
              if (data.notifTasks !== undefined) setNotifTasks(data.notifTasks);
              if (data.notifFocus !== undefined) setNotifFocus(data.notifFocus);
              if (data.focusHours) setFocusHours(data.focusHours);
              if (data.sessions) setSessions(data.sessions);
              if (data.goalMinutes) setGoalMinutes(data.goalMinutes);
              if (data.sessionsList) setSessionsList(data.sessionsList);
            } else {
              // Yeni kullanıcı
              setUserName(firebaseUser.displayName || "Student");
              setUserEmail(firebaseUser.email || "");
            }
            setDataLoading(false);
          },
          (err) => {
            console.error("Snapshot hatası:", err);
            setDataLoading(false);
          }
        );

        snapshotUnsubRef.current = unsubSnapshot;
      } else {
        setUser(null);
        setTasks([]);
        setExams([]);
        setCourses([]);
        setFocusHours(0);
        setSessions(0);
      }

      setAuthLoading(false);
    });

    return () => {
      unsub();
      if (snapshotUnsubRef.current) snapshotUnsubRef.current();
    };
  }, []);

  /* ── FIRESTORE'A KAYDET (debounced) ── */
  const scheduleSave = (patch) => {
    if (!user) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveUserData(user.uid, patch).catch((err) =>
        console.error("Kayıt hatası:", err)
      );
    }, 1500);
  };

  // Tasks değişince kaydet
  useEffect(() => {
    if (!user || dataLoading) return;
    scheduleSave({ tasks });
  }, [tasks]);

  // Exams değişince kaydet
  useEffect(() => {
    if (!user || dataLoading) return;
    scheduleSave({ exams });
  }, [exams]);

  // Courses değişince kaydet
  useEffect(() => {
    if (!user || dataLoading) return;
    scheduleSave({ courses });
  }, [courses]);

  // Settings değişince kaydet
  useEffect(() => {
    if (!user || dataLoading) return;
    scheduleSave({ userName, userEmail, themeColor, notifExams, notifTasks, notifFocus });
  }, [userName, userEmail, themeColor, notifExams, notifTasks, notifFocus]);

  // Focus verileri değişince kaydet
  useEffect(() => {
    if (!user || dataLoading) return;
    scheduleSave({ focusHours, sessions, goalMinutes, sessionsList });
  }, [focusHours, sessions, goalMinutes, sessionsList]);

  /* ── SIGN OUT ── */
  const handleSignOut = async () => {
    clearInterval(timerRef.current);
    await signOut(auth);
  };

  /* ── ALARM ── */
  const playAlarm = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.4, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      beep(880, 0, 0.3);
      beep(1100, 0.35, 0.3);
      beep(880, 0.7, 0.3);
      beep(1100, 1.05, 0.5);
    } catch (e) {}
  };

  /* ── TIMER ── */
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setFocusTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setSessions((p) => p + 1);
            setFocusHours((p) => Number((p + 0.42).toFixed(2)));
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  /* ── PROPS ── */
  const focusProps = {
    POMODORO_TIME,
    BREAK_TIME,
    LONG_BREAK_TIME,
    focusTime,
    setFocusTime,
    isRunning,
    setIsRunning,
    timerMode,
    setTimerMode,
    currentTotal,
    setCurrentTotal,
    sessions,
    setSessions,
    focusHours,
    setFocusHours,
    goalMinutes,
    setGoalMinutes,
    sessionsList,
    setSessionsList,
    timerRef,
    playAlarm,
  };

  const settingsProps = {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    themeColor,
    setThemeColor,
    notifExams,
    setNotifExams,
    notifTasks,
    setNotifTasks,
    notifFocus,
    setNotifFocus,
    onSignOut: handleSignOut,
  };

  /* ── LOADING SCREEN ── */
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-30 rounded-full" />
            <img
              src="/icon.png"
              alt="logo"
              className="relative w-16 h-16 rounded-3xl shadow-2xl"
            />
          </div>
          <p className="text-slate-500 text-sm font-medium">
            {authLoading ? "Checking session..." : "Loading your data..."}
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── AUTH SCREENS ── */
  if (!user) {
    if (authScreen === "register")
      return <Register onSwitchToLogin={() => setAuthScreen("login")} />;
    return <Login onSwitchToRegister={() => setAuthScreen("register")} />;
  }

  /* ── MAIN APP ── */
  const renderPage = () => {
    if (page === "dashboard")
      return (
        <Dashboard
          tasks={tasks}
          setTasks={setTasks}
          exams={exams}
          courses={courses}
          setPage={setPage}
          setTaskFilter={setTaskFilter}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      );
    if (page === "tasks")
      return (
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
          taskFilter={taskFilter}
          setTaskFilter={setTaskFilter}
          darkMode={darkMode}
        />
      );
    if (page === "courses")
      return (
        <Courses courses={courses} setCourses={setCourses} darkMode={darkMode} />
      );
    if (page === "exams")
      return <Exams exams={exams} setExams={setExams} darkMode={darkMode} />;
    if (page === "focus")
      return (
        <Focus
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          focusProps={focusProps}
        />
      );
    if (page === "analytics")
      return (
        <Analytics
          tasks={tasks}
          courses={courses}
          exams={exams}
          focusHours={focusHours}
          sessions={sessions}
          darkMode={darkMode}
        />
      );
    if (page === "settings")
      return (
        <Settings
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          settingsProps={settingsProps}
        />
      );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#081028] to-[#020617]"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"
      }`}
    >
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed top-5 left-5 z-50 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105 ${
          darkMode
            ? "bg-white/10 text-white border border-white/10"
            : "bg-white text-slate-700 border border-slate-200"
        } ${sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <FiMenu size={20} />
      </button>

      <Sidebar
        page={page}
        setPage={setPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        darkMode={darkMode}
        tasks={tasks}
      />

      <main className="min-h-screen p-8 pt-20">{renderPage()}</main>
    </div>
  );
}

export default App;
