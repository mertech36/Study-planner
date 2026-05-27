import { useEffect, useState, useCallback } from "react";
import {
  doc, getDoc, setDoc, collection, getDocs, orderBy, query
} from "firebase/firestore";
import { db } from "../firebase";

// "2026-W21" formatı
function getWeekId(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// "2026-05-27" formatı
function getTodayId() {
  return new Date().toISOString().split("T")[0];
}

export function useStudyStats(uid) {
  const [currentWeek, setCurrentWeek]   = useState(null);
  const [weekHistory, setWeekHistory]   = useState([]);
  const [streak, setStreak]             = useState(0);
  const [loading, setLoading]           = useState(true);

  const weekId  = getWeekId();
  const todayId = getTodayId();

  /* ── LOAD ── */
  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      try {
        // Bu haftanın verisi
        const weekRef = doc(db, "users", uid, "weeklyStats", weekId);
        const weekSnap = await getDoc(weekRef);
        if (weekSnap.exists()) {
          setCurrentWeek(weekSnap.data());
        } else {
          setCurrentWeek({ totalMinutes: 0, sessions: 0, tasksCompleted: 0 });
        }

        // Tüm hafta geçmişi
        const histRef = collection(db, "users", uid, "weeklyStats");
        const histSnap = await getDocs(query(histRef, orderBy("__name__", "desc")));
        const history = histSnap.docs.map((d) => ({ weekId: d.id, ...d.data() }));
        setWeekHistory(history);

        // Streak hesapla
        const streakCount = await calcStreak(uid);
        setStreak(streakCount);
      } catch (e) {
        console.error("useStudyStats load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid]);

  /* ── STREAK HESAPLA ── */
  async function calcStreak(uid) {
    const dailyRef = collection(db, "users", uid, "dailyStats");
    const snap = await getDocs(dailyRef);
    const days = new Set(snap.docs.filter((d) => (d.data().tasksCompleted || 0) > 0).map((d) => d.id));

    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const id = d.toISOString().split("T")[0];
      if (days.has(id)) count++;
      else if (i > 0) break; // bugün yoksa yine say, ama dünden itibaren kırılırsa dur
    }
    return count;
  }

  /* ── FOCUS SESSION TAMAMLANDI ── */
  const recordFocusSession = useCallback(async (durationMinutes) => {
    if (!uid) return;
    try {
      const weekRef  = doc(db, "users", uid, "weeklyStats", weekId);
      const dailyRef = doc(db, "users", uid, "dailyStats",  todayId);

      const [wSnap, dSnap] = await Promise.all([getDoc(weekRef), getDoc(dailyRef)]);
      const w = wSnap.exists() ? wSnap.data() : { totalMinutes: 0, sessions: 0, tasksCompleted: 0 };
      const d = dSnap.exists() ? dSnap.data() : { focusMinutes: 0, sessions: 0, tasksCompleted: 0 };

      const newW = { ...w, totalMinutes: (w.totalMinutes || 0) + durationMinutes, sessions: (w.sessions || 0) + 1, weekId };
      const newD = { ...d, focusMinutes: (d.focusMinutes || 0) + durationMinutes, sessions: (d.sessions || 0) + 1 };

      await Promise.all([setDoc(weekRef, newW), setDoc(dailyRef, newD)]);
      setCurrentWeek(newW);
    } catch (e) {
      console.error("recordFocusSession error:", e);
    }
  }, [uid, weekId, todayId]);

  /* ── TASK TAMAMLANDI (streak için) ── */
  const recordTaskCompleted = useCallback(async () => {
    if (!uid) return;
    try {
      const weekRef  = doc(db, "users", uid, "weeklyStats", weekId);
      const dailyRef = doc(db, "users", uid, "dailyStats",  todayId);

      const [wSnap, dSnap] = await Promise.all([getDoc(weekRef), getDoc(dailyRef)]);
      const w = wSnap.exists() ? wSnap.data() : { totalMinutes: 0, sessions: 0, tasksCompleted: 0 };
      const d = dSnap.exists() ? dSnap.data() : { focusMinutes: 0, sessions: 0, tasksCompleted: 0 };

      const newW = { ...w, tasksCompleted: (w.tasksCompleted || 0) + 1, weekId };
      const newD = { ...d, tasksCompleted: (d.tasksCompleted || 0) + 1 };

      await Promise.all([setDoc(weekRef, newW), setDoc(dailyRef, newD)]);
      setCurrentWeek(newW);

      // Streak yeniden hesapla
      const s = await calcStreak(uid);
      setStreak(s);
    } catch (e) {
      console.error("recordTaskCompleted error:", e);
    }
  }, [uid, weekId, todayId]);

  return { currentWeek, weekHistory, streak, loading, recordFocusSession, recordTaskCompleted };
}