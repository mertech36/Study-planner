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
import Focus from "./pages/focus";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

const POMODORO_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

async function saveUserData(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authScreen, setAuthScreen] = useState("login");

  const [page, setPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");

  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  const [userName, setUserName] = useState("Alex Johnson");
  const [userEmail, setUserEmail] = useState("");
  const [themeColor, setThemeColor] = useState("orange");
  const [notifExams, setNotifExams] = useState(true);
  const [notifTasks, setNotifTasks] = useState(false);
  const [notifFocus, setNotifFocus] = useState(true);

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

  const [weekHistory, setWeekHistory] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [streak, setStreak] = useState(0);
  const [dailyFocusMinutes, setDailyFocusMinutes] = useState(0);
  const [lastFocusDate, setLastFocusDate] = useState("");

  const timerRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const snapshotUnsubRef = useRef(null);
  const isLoadingFromFirestore = useRef(false);
  const timerStartedAt = useRef(null);
  const timerStartValue = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (snapshotUnsubRef.current) {
        snapshotUnsubRef.current();
        snapshotUnsubRef.current = null;
      }
      if (firebaseUser) {
        setUser(firebaseUser);
        setDataLoading(true);
        isLoadingFromFirestore.current = true;
        const ref = doc(db, "users", firebaseUser.uid);
        const unsubSnapshot = onSnapshot(ref, (snap) => {
          isLoadingFromFirestore.current = true;
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
            if (data.weekHistory) setWeekHistory(data.weekHistory);
            if (data.currentWeek) setCurrentWeek(data.currentWeek);
            if (data.streak !== undefined) setStreak(data.streak);
            if (data.dailyFocusMinutes !== undefined) setDailyFocusMinutes(data.dailyFocusMinutes);
            if (data.lastFocusDate) setLastFocusDate(data.lastFocusDate);
          } else {
            setUserName(firebaseUser.displayName || "Student");
            setUserEmail(firebaseUser.email || "");
          }
          setTimeout(() => {
            isLoadingFromFirestore.current = false;
            setDataLoading(false);
          }, 300);
        }, (err) => {
          console.error("Snapshot hatası:", err);
          isLoadingFromFirestore.current = false;
          setDataLoading(false);
        });
        snapshotUnsubRef.current = unsubSnapshot;
      } else {
        setUser(null);
        setTasks([]);
        setExams([]);
        setCourses([]);
        setFocusHours(0);
        setSessions(0);
        setWeekHistory([]);
        setCurrentWeek(null);
        setStreak(0);
        setDailyFocusMinutes(0);
        setLastFocusDate("");
      }
      setAuthLoading(false);
    });
    return () => {
      unsub();
      if (snapshotUnsubRef.current) snapshotUnsubRef.current();
    };
  }, []);

  const scheduleSave = (patch) => {
    if (!user || isLoadingFromFirestore.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (isLoadingFromFirestore.current) return;
      saveUserData(user.uid, patch).catch((err) => console.error("Kayıt hatası:", err));
    }, 1500);
  };

  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ tasks }); }, [tasks]);
  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ exams }); }, [exams]);
  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ courses }); }, [courses]);
  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ userName, userEmail, themeColor, notifExams, notifTasks, notifFocus }); }, [userName, userEmail, themeColor, notifExams, notifTasks, notifFocus]);
  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ focusHours, sessions, goalMinutes, sessionsList }); }, [focusHours, sessions, goalMinutes, sessionsList]);
  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ weekHistory, currentWeek, streak }); }, [weekHistory, currentWeek, streak]);
  useEffect(() => { if (!user || dataLoading) return; scheduleSave({ dailyFocusMinutes, lastFocusDate }); }, [dailyFocusMinutes, lastFocusDate]);

  const handleSignOut = async () => {
    clearInterval(timerRef.current);
    await signOut(auth);
  };

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
      beep(880, 0, 0.3); beep(1100, 0.35, 0.3);
      beep(880, 0.7, 0.3); beep(1100, 1.05, 0.5);
    } catch (e) {}
  };

  useEffect(() => {
    if (isRunning) {
      timerStartedAt.current = Date.now();
      timerStartValue.current = focusTime;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartedAt.current) / 1000);
        const remaining = timerStartValue.current - elapsed;
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setFocusTime(0);
          setIsRunning(false);
          setSessions((p) => p + 1);
          setFocusHours((p) => Number((p + 0.42).toFixed(2)));
          const today = new Date().toISOString().split("T")[0];
          setLastFocusDate((prev) => {
            if (prev !== today) setDailyFocusMinutes(Math.round(POMODORO_TIME / 60));
            else setDailyFocusMinutes((m) => m + Math.round(POMODORO_TIME / 60));
            return today;
          });
          playAlarm();
        } else {
          setFocusTime(remaining);
        }
      }, 500);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const focusProps = {
    POMODORO_TIME, BREAK_TIME, LONG_BREAK_TIME,
    focusTime, setFocusTime, isRunning, setIsRunning,
    timerMode, setTimerMode, currentTotal, setCurrentTotal,
    sessions, setSessions, focusHours, setFocusHours,
    goalMinutes, setGoalMinutes, sessionsList, setSessionsList,
    timerRef, playAlarm, dailyFocusMinutes, setDailyFocusMinutes,
    lastFocusDate, setLastFocusDate,
  };

  const settingsProps = {
    userName, setUserName, userEmail, setUserEmail,
    themeColor, setThemeColor,
    notifExams, setNotifExams, notifTasks, setNotifTasks, notifFocus, setNotifFocus,
    onSignOut: handleSignOut,
  };

  /* ── LOADING ── */
  if (authLoading || dataLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: darkMode ? "#1A110A" : "#FDE8D8" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <img src="/icon.png" alt="logo" style={{ width: 64, height: 64, borderRadius: 24 }} />
          <p style={{ color: "#9C7A5A", fontSize: 14, fontFamily: "Inter, sans-serif" }}>
            {authLoading ? "Checking session..." : "Loading your data..."}
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#C85A1A",
                animation: "bounce 0.6s infinite alternate",
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── AUTH ── */
  if (!user) {
    if (authScreen === "register")
      return <Register onSwitchToLogin={() => setAuthScreen("login")} />;
    return <Login onSwitchToRegister={() => setAuthScreen("register")} />;
  }

  /* ── PAGES ── */
  const renderPage = () => {
    if (page === "dashboard") return (
      <Dashboard tasks={tasks} setTasks={setTasks} exams={exams} courses={courses}
        setPage={setPage} setTaskFilter={setTaskFilter} darkMode={darkMode} setDarkMode={setDarkMode}
        userName={userName} />
    );
    if (page === "tasks") return (
      <Tasks tasks={tasks} setTasks={setTasks} taskFilter={taskFilter}
        setTaskFilter={setTaskFilter} darkMode={darkMode} />
    );
    if (page === "courses") return <Courses courses={courses} setCourses={setCourses} darkMode={darkMode} />;
    if (page === "exams")   return <Exams exams={exams} setExams={setExams} darkMode={darkMode} />;
    if (page === "focus")   return <Focus darkMode={darkMode} setDarkMode={setDarkMode} focusProps={focusProps} />;
    if (page === "analytics") return (
      <Analytics tasks={tasks} courses={courses} exams={exams} focusHours={focusHours}
        sessions={sessions} darkMode={darkMode} currentWeek={currentWeek}
        weekHistory={weekHistory} streak={streak} />
    );
    if (page === "settings") return <Settings darkMode={darkMode} setDarkMode={setDarkMode} settingsProps={settingsProps} />;
  };

  /* ── MAIN APP ── */
  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#1A110A" : "#FDE8D8", transition: "background 0.3s" }}>

      {/* Hamburger butonu — sidebar kapalıyken görünür */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: "fixed", top: 20, left: 20, zIndex: 50,
          width: 44, height: 44, borderRadius: 14,
          display: sidebarOpen ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
          background: darkMode ? "#2A1A0F" : "#FFFFFF",
          border: `1px solid ${darkMode ? "#3D2410" : "#EDD9C8"}`,
          color: darkMode ? "#F5E6D5" : "#2C1A0E",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        }}
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

      {/*
        Ana içerik alanı.
        Dashboard kendi padding'ini kendisi yönetiyor (hamburger için sol boşluk dahil).
        Diğer sayfalar da kendi içlerinde paddingLeft: 80px kullanmalı — 
        şimdilik burada paddingLeft: 80px ekleyerek tüm sayfalarda hamburger çakışması önleniyor.
        Eğer Focus gibi sayfalar kendi layout'unu tam kullanmak istiyorsa,
        o sayfaya özel override edilebilir.
      */}
      <main style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        // Dashboard kendi paddingLeft'ini kendisi veriyor, diğerleri için burada veriyoruz:
        paddingLeft: page === "dashboard" ? 0 : 80,
      }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;