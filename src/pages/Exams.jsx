import { useState, useRef, useEffect, useMemo } from "react";
import { FiTrash2, FiCalendar, FiClock } from "react-icons/fi";

/* ---------- Yardımcı fonksiyonlar ---------- */

// "2026-10-07" -> yerel saatle Date (UTC kayması olmasın diye)
function parseDate(value) {
  if (!value) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return isNaN(d) ? null : d;
}

function formatDate(value) {
  const d = parseDate(value);
  return d
    ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : value;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Sınavın tam zamanı (saat yoksa günün sonu sayılır)
function examDateTime(exam) {
  const d = parseDate(exam.examDate);
  if (!d) return null;
  if (exam.examHour && /^\d{2}:\d{2}$/.test(exam.examHour)) {
    const [h, m] = exam.examHour.split(":").map(Number);
    d.setHours(h, m, 0, 0);
  } else {
    d.setHours(23, 59, 59, 999);
  }
  return d;
}

// Gün farkı: yaz/kış saati geçişlerinde şaşmasın diye round kullanılır
function daysUntil(exam) {
  const d = parseDate(exam.examDate);
  if (!d) return null;
  return Math.round((d - startOfToday()) / 86400000);
}

function isPassed(exam) {
  const dt = examDateTime(exam);
  return dt ? dt < new Date() : false;
}

function daysLabel(exam) {
  const days = daysUntil(exam);
  if (days === null) return "No date";
  if (isPassed(exam)) return "Passed";
  if (days === 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

function daysTone(exam) {
  const days = daysUntil(exam);
  if (days === null || isPassed(exam)) return "passed";
  if (days <= 3) return "urgent";
  if (days <= 7) return "soon";
  return "later";
}

const FILTERS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "passed", label: "Passed" },
  { id: "all", label: "All" },
];

/* ---------- Bileşen ---------- */

function Exams({ exams, setExams, darkMode }) {
  const [form, setForm] = useState({ examTitle: "", examDate: "", examHour: "", notes: "" });
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };

  const showToast = (message, undo) => {
    clearTimeout(toastTimer.current);
    setToast({ message, undo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const addExam = () => {
    const examTitle = form.examTitle.trim();
    if (!examTitle) { setError("Enter an exam title."); return; }
    if (!form.examDate) { setError("Pick the exam date."); return; }
    setExams((prev) => [
      ...prev,
      { id: Date.now(), examTitle, examDate: form.examDate, examHour: form.examHour, notes: form.notes.trim() },
    ]);
    setForm({ examTitle: "", examDate: "", examHour: "", notes: "" });
    setError("");
  };

  const deleteExam = (id) => {
    const index = exams.findIndex((e) => e.id === id);
    if (index === -1) return;
    const exam = exams[index];
    setExams((prev) => prev.filter((e) => e.id !== id));
    showToast(`Deleted "${exam.examTitle}"`, () => {
      setExams((prev) => {
        const copy = [...prev];
        copy.splice(Math.min(index, copy.length), 0, exam);
        return copy;
      });
      setToast(null);
    });
  };

  // Yaklaşanlar en yakından uzağa, geçmişler en yeniden eskiye
  const { visible, counts } = useMemo(() => {
    const byTime = (a, b) => (examDateTime(a) || 0) - (examDateTime(b) || 0);
    const upcoming = exams.filter((e) => !isPassed(e)).sort(byTime);
    const passed = exams.filter(isPassed).sort((a, b) => byTime(b, a));
    const list = filter === "upcoming" ? upcoming : filter === "passed" ? passed : [...upcoming, ...passed];
    return { visible: list, counts: { upcoming: upcoming.length, passed: passed.length, all: exams.length } };
  }, [exams, filter]);

  const emptyMessage =
    exams.length === 0 ? "No exams added yet 📝"
    : filter === "upcoming" ? "No upcoming exams."
    : "No passed exams.";

  return (
    <div className={`ex ${darkMode ? "dark" : "light"}`}>
      <style>{css}</style>

      <div className="ex-inner">
        <header>
          <h1>Exams</h1>
          <p className="muted small">Track your upcoming exams and deadlines.</p>
        </header>

        {/* Ekleme formu */}
        <section className="card" aria-labelledby="add-exam-title">
          <h2 id="add-exam-title">Add new exam</h2>
          <p className="muted xs">Title and date are required.</p>

          <div className="ex-form">
            <input type="text" placeholder="Exam title" aria-label="Exam title"
              value={form.examTitle} onChange={setField("examTitle")}
              onKeyDown={(e) => e.key === "Enter" && addExam()} />
            <input type="date" aria-label="Exam date" value={form.examDate} onChange={setField("examDate")} />
            <input type="time" aria-label="Exam time (optional)" value={form.examHour} onChange={setField("examHour")} />
            <input type="text" placeholder="Notes (optional)" aria-label="Notes"
              value={form.notes} onChange={setField("notes")}
              onKeyDown={(e) => e.key === "Enter" && addExam()} />
          </div>

          {error && <p className="ex-error" role="alert">{error}</p>}
          <button className="ex-primary" onClick={addExam}>Add exam</button>
        </section>

        {/* Filtre */}
        <div className="ex-chips" role="group" aria-label="Filter exams">
          {FILTERS.map((f) => (
            <button key={f.id} className={`ex-chip ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
              {f.label} <span className="count">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        {/* Kartlar */}
        {visible.length === 0 ? (
          <div className="card ex-empty">{emptyMessage}</div>
        ) : (
          <ul className="ex-grid">
            {visible.map((exam) => {
              const tone = daysTone(exam);
              return (
                <li key={exam.id} className={`ex-card tone-${tone}`}>
                  <div className="ex-bar" />
                  <div className="ex-body">
                    <div className="ex-top">
                      <span className="ex-icon"><FiCalendar size={16} aria-hidden="true" /></span>
                      <button className="ex-del" onClick={() => deleteExam(exam.id)}
                        aria-label={`Delete ${exam.examTitle}`}>
                        <FiTrash2 size={12} aria-hidden="true" />
                      </button>
                    </div>

                    <h3>{exam.examTitle}</h3>

                    <div className="ex-when">
                      <span><FiCalendar size={12} aria-hidden="true" /> {formatDate(exam.examDate)}</span>
                      {exam.examHour && <span><FiClock size={12} aria-hidden="true" /> {exam.examHour}</span>}
                    </div>

                    <span className="ex-days">{daysLabel(exam)}</span>

                    {exam.notes && <div className="ex-notes">{exam.notes}</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {toast && (
        <div className="ex-toast" role="status">
          <span>{toast.message}</span>
          <button onClick={toast.undo}>Undo</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Stiller ---------- */

const css = `
.ex {
  --page-bg: #FDE8D8; --card-bg: #FFFFFF; --card-alt: #FAF3EC; --border: #EDD9C8;
  --text: #1A0E05; --muted: #9C7A5A; --orange: #C85A1A; --input-bg: #FAF3EC;
  --danger: #C0392B; --danger-bg: #FEE8E8; --icon-bg: #FDEEE4;
  --urgent-bg: #FEE8E8; --soon-bg: #FDEEE4; --later-bg: #EEF2FF; --later: #3949AB; --passed-bg: #F5F5F5;
  background: var(--page-bg); color: var(--text);
  min-height: 100vh; width: 100%; font-family: Inter, sans-serif; transition: background .3s;
}
.ex.dark {
  --page-bg: #1A110A; --card-bg: #2A1A0F; --card-alt: #241508; --border: #3D2410;
  --text: #F5E6D5; --muted: #8C6A4A; --input-bg: #1A110A;
  --danger-bg: #4A1A1A; --icon-bg: #3D2410;
  --urgent-bg: #3D1010; --soon-bg: #3D2410; --later-bg: #1A1A3D; --passed-bg: #2A2A2A;
}
.ex *, .ex *::before, .ex *::after { box-sizing: border-box; }
.ex button, .ex input { font-family: inherit; }
.ex h1, .ex h2, .ex h3, .ex p, .ex ul { margin: 0; padding: 0; }
.ex ul { list-style: none; }
.ex :focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }

.ex-inner { padding: 28px 40px 40px 80px; display: flex; flex-direction: column; gap: 20px; }
.ex h1 { font-size: 26px; font-weight: 700; }
.muted { color: var(--muted); }
.small { font-size: 13px; margin-top: 4px; }
.xs { font-size: 12px; }

.card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; }
.card h2 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.card.ex-empty { text-align: center; color: var(--muted); font-size: 14px; padding: 32px 0; border-radius: 12px; }

.ex input { width: 100%; padding: 9px 13px; border-radius: 10px; border: 1px solid var(--border); background: var(--input-bg); color: var(--text); font-size: 13px; }
.ex-form { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 10px; margin-top: 14px; }
.ex-error { color: var(--danger); font-size: 12px; margin-top: 8px; }
.ex-primary { margin-top: 12px; padding: 9px 20px; border-radius: 10px; border: none; background: var(--orange); color: #FFF; font-weight: 700; font-size: 13px; cursor: pointer; }
.ex-primary:hover { filter: brightness(1.08); }

.ex-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ex-chip { padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border); background: none; color: var(--muted); font-weight: 600; font-size: 12px; cursor: pointer; transition: all .15s; }
.ex-chip .count { margin-left: 4px; opacity: .8; }
.ex-chip.active { background: var(--orange); border-color: var(--orange); color: #FFF; }

.ex-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
.ex-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.ex-card.tone-passed { opacity: .7; }
.ex-bar { height: 3px; background: var(--muted); }
.tone-urgent .ex-bar, .tone-soon .ex-bar { background: var(--orange); }
.ex-body { padding: 16px 18px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.ex-top { display: flex; align-items: flex-start; justify-content: space-between; width: 100%; margin-bottom: 2px; }
.ex-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--icon-bg); color: var(--orange); display: flex; align-items: center; justify-content: center; }
.ex-del { width: 28px; height: 28px; border-radius: 8px; border: none; background: var(--danger-bg); color: var(--danger); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ex-card h3 { font-size: 15px; font-weight: 700; overflow-wrap: anywhere; }
.ex-when { display: flex; flex-wrap: wrap; gap: 4px 12px; }
.ex-when span { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--orange); }

.ex-days { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.tone-urgent .ex-days { background: var(--urgent-bg); color: var(--danger); }
.tone-soon .ex-days { background: var(--soon-bg); color: var(--orange); }
.tone-later .ex-days { background: var(--later-bg); color: var(--later); }
.tone-passed .ex-days { background: var(--passed-bg); color: var(--muted); }

.ex-notes { width: 100%; margin-top: 2px; padding: 8px 12px; border-radius: 8px; background: var(--card-alt); font-size: 12px; color: var(--muted); overflow-wrap: anywhere; }

.ex-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; max-width: calc(100% - 32px); padding: 12px 18px; border-radius: 12px; background: #1A0E05; color: #F5E6D5; font-size: 13px; box-shadow: 0 6px 24px rgba(0,0,0,.25); z-index: 40; }
.dark .ex-toast { background: #F5E6D5; color: #1A0E05; }
.ex-toast button { background: none; border: none; color: #F0A272; font-weight: 700; font-size: 13px; cursor: pointer; }
.dark .ex-toast button { color: #C85A1A; }

@media (max-width: 900px) {
  .ex-inner { padding: 20px 20px 32px 76px; }
  .ex-form { grid-template-columns: 1fr 1fr; }
  .ex-form > :first-child { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .ex-inner { padding: 16px 12px 28px 64px; }
  .ex h1 { font-size: 21px; }
  .ex-form { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .ex, .ex-chip { transition: none; } }

/* Son sayfa hizalamalari */
.ex-inner { padding: 24px 32px 40px 15px; }
.ex-inner > .card,
.ex-inner > .ex-grid {
  transform: translateX(-60px);
  width: calc(100% + 60px);
}
.ex-chips {
  transform: translateX(-60px);
  width: calc(100% + 60px);
}
@media (max-width: 900px) {
  .ex-inner { padding: 20px 20px 32px 76px; }
  .ex-inner > .card,
  .ex-inner > .ex-grid,
  .ex-chips {
    transform: none;
    width: 100%;
  }
}
@media (max-width: 520px) {
  .ex-inner { padding: 16px 12px 28px 64px; }
}
`;

export default Exams;