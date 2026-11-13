import { useState, useRef, useEffect } from "react";
import { FiBookOpen, FiTrash2, FiFileText, FiPlus } from "react-icons/fi";

const COLOR_MAP = {
  blue:   "#1D6FA4",
  purple: "#7F77DD",
  green:  "#639922",
  red:    "#E24B4A",
  orange: "#C85A1A",
  pink:   "#D4537E",
};

const COLORS = Object.keys(COLOR_MAP);

function Courses({ courses, setCourses, darkMode }) {
  const [form, setForm] = useState({ name: "", semester: "", notes: "" });
  const [selectedColor, setSelectedColor] = useState("blue");
  const [error, setError] = useState("");
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

  const addCourse = () => {
    const name = form.name.trim();
    if (!name) { setError("Enter a course name to add it."); return; }
    // Görevler derse ad üzerinden bağlı olduğu için aynı isim iki kez eklenmez
    if (courses.some((c) => c.name.trim().toLowerCase() === name.toLowerCase())) {
      setError(`"${name}" is already in your courses.`);
      return;
    }
    setCourses((prev) => [
      ...prev,
      { id: Date.now(), name, semester: form.semester.trim(), notes: form.notes.trim(), color: selectedColor },
    ]);
    setForm({ name: "", semester: "", notes: "" });
    setSelectedColor("blue");
    setError("");
  };

  const deleteCourse = (id) => {
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) return;
    const course = courses[index];
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast(`Deleted "${course.name}"`, () => {
      setCourses((prev) => {
        const copy = [...prev];
        copy.splice(Math.min(index, copy.length), 0, course);
        return copy;
      });
      setToast(null);
    });
  };

  return (
    <div className={`cr ${darkMode ? "dark" : "light"}`}>
      <style>{css}</style>

      <div className="cr-inner">
        <header>
          <h1>Courses</h1>
          <p className="muted small">Manage your study subjects.</p>
        </header>

        {/* Ekleme formu */}
        <section className="card" aria-labelledby="add-course-title">
          <h2 id="add-course-title">Add new course</h2>

          <div className="cr-two">
            <input type="text" placeholder="Course name" aria-label="Course name"
              value={form.name} onChange={setField("name")}
              onKeyDown={(e) => e.key === "Enter" && addCourse()} />
            <input type="text" placeholder="Semester (optional, e.g. Spring 2026)" aria-label="Semester"
              value={form.semester} onChange={setField("semester")}
              onKeyDown={(e) => e.key === "Enter" && addCourse()} />
          </div>

          <textarea placeholder="Notes (optional)" aria-label="Notes" rows={2}
            value={form.notes} onChange={setField("notes")} />

          <fieldset className="cr-colors">
            <legend>Color</legend>
            <div className="cr-swatches">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`swatch ${selectedColor === color ? "active" : ""}`}
                  style={{ "--c": COLOR_MAP[color] }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={color}
                  aria-pressed={selectedColor === color}
                />
              ))}
            </div>
          </fieldset>

          {error && <p className="cr-error" role="alert">{error}</p>}

          <button className="cr-primary" onClick={addCourse}>
            <FiPlus size={14} aria-hidden="true" /> Add course
          </button>
        </section>

        {/* Ders kartları */}
        {courses.length === 0 ? (
          <div className="card cr-empty">
            <div className="cr-empty-icon"><FiBookOpen size={24} aria-hidden="true" /></div>
            <p className="cr-empty-title">No courses yet</p>
            <p className="muted small">Add your first course above.</p>
          </div>
        ) : (
          <ul className="cr-grid">
            {courses.map((course) => (
              <li key={course.id} className="cr-card"
                style={{ "--c": COLOR_MAP[course.color] || COLOR_MAP.blue }}>
                <div className="cr-card-top">
                  <span className="cr-badge"><FiBookOpen size={16} aria-hidden="true" /></span>
                  <button className="cr-del" onClick={() => deleteCourse(course.id)}
                    aria-label={`Delete ${course.name}`}>
                    <FiTrash2 size={12} aria-hidden="true" />
                  </button>
                </div>

                <div className="cr-card-body">
                  <h3 title={course.name}>{course.name}</h3>
                  {course.semester && <span className="cr-semester">{course.semester}</span>}
                  {course.notes && (
                    <div className="cr-notes" title={course.notes}>
                      <FiFileText size={11} aria-hidden="true" />
                      <p>{course.notes}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && (
        <div className="cr-toast" role="status">
          <span>{toast.message}</span>
          <button onClick={toast.undo}>Undo</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Stiller ---------- */

const css = `
.cr {
  --page-bg: #FDE8D8; --card-bg: #FFFFFF; --card-alt: #FAF3EC; --border: #EDD9C8;
  --text: #1A0E05; --muted: #9C7A5A; --orange: #C85A1A; --input-bg: #FAF3EC; --danger: #C0392B;
  background: var(--page-bg); color: var(--text);
  min-height: 100vh; width: 100%; font-family: Inter, sans-serif; transition: background .3s;
}
.cr.dark {
  --page-bg: #1A110A; --card-bg: #2A1A0F; --card-alt: #241508; --border: #3D2410;
  --text: #F5E6D5; --muted: #8C6A4A; --input-bg: #1A110A;
}
.cr *, .cr *::before, .cr *::after { box-sizing: border-box; }
.cr button, .cr input, .cr textarea { font-family: inherit; }
.cr h1, .cr h2, .cr h3, .cr p, .cr ul, .cr fieldset, .cr legend { margin: 0; padding: 0; }
.cr ul { list-style: none; }
.cr :focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }

.cr-inner { padding: 28px 40px 40px 80px; display: flex; flex-direction: column; gap: 24px; }
.cr h1 { font-size: 26px; font-weight: 700; line-height: 1.2; }
.muted { color: var(--muted); }
.small { font-size: 13px; margin-top: 4px; }

.card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 24px 28px; transition: background .3s; }
.card h2 { font-size: 16px; font-weight: 700; margin-bottom: 16px; }

.cr input, .cr textarea { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--input-bg); color: var(--text); font-size: 14px; }
.cr textarea { resize: vertical; min-height: 64px; margin-bottom: 16px; }
.cr-two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }

.cr-colors { border: none; margin-bottom: 20px; }
.cr-colors legend { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 10px; }
.cr-swatches { display: flex; flex-wrap: wrap; gap: 10px; }
.swatch { width: 32px; height: 32px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--c); cursor: pointer; opacity: .6; transition: transform .15s, opacity .15s; }
.swatch:hover { opacity: 1; }
.swatch.active { opacity: 1; transform: scale(1.15); border-color: var(--c); outline: 2px solid var(--c); outline-offset: 2px; }

.cr-error { color: var(--danger); font-size: 13px; margin-bottom: 12px; }
.cr-primary { display: inline-flex; align-items: center; gap: 6px; padding: 11px 22px; border-radius: 10px; border: none; background: var(--orange); color: #FFF; font-weight: 700; font-size: 13px; cursor: pointer; }
.cr-primary:hover { filter: brightness(1.08); }

.cr-empty { text-align: center; padding: 48px 28px; }
.cr-empty-icon { width: 56px; height: 56px; border-radius: 14px; background: var(--card-alt); color: var(--muted); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
.cr-empty-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }

.cr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.cr-card { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; min-height: 180px; padding: 16px; border-radius: 16px; background: var(--c); color: #FFF; transition: transform .25s; }
.cr-card:hover { transform: scale(1.02); }
.cr-card::before, .cr-card::after { content: ""; position: absolute; border-radius: 50%; pointer-events: none; }
.cr-card::before { top: -24px; right: -24px; width: 96px; height: 96px; background: rgba(255,255,255,.1); }
.cr-card::after { bottom: -20px; left: -20px; width: 64px; height: 64px; background: rgba(0,0,0,.1); }
.cr-card > * { position: relative; z-index: 1; }

.cr-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
.cr-badge { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.2); display: flex; align-items: center; justify-content: center; }
.cr-del { width: 28px; height: 28px; border-radius: 8px; border: none; background: rgba(0,0,0,.25); color: #FFF; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s, opacity .2s; }
.cr-del:hover { background: rgba(220,50,50,.9); }
/* Fare ile gelince veya klavye ile odaklanınca görünür; dokunmatik ekranda hep görünür */
@media (hover: hover) {
  .cr-del { opacity: 0; }
  .cr-card:hover .cr-del, .cr-del:focus-visible { opacity: 1; }
}

.cr-card-body { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; width: 100%; }
.cr-card h3 { font-size: 14px; font-weight: 700; line-height: 1.3; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cr-semester { font-size: 12px; font-weight: 600; background: rgba(0,0,0,.25); padding: 3px 9px; border-radius: 8px; }
.cr-notes { display: flex; align-items: flex-start; gap: 6px; width: 100%; background: rgba(0,0,0,.25); border-radius: 10px; padding: 8px 10px; }
.cr-notes svg { margin-top: 2px; flex-shrink: 0; }
.cr-notes p { font-size: 12px; line-height: 1.4; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.cr-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; max-width: calc(100% - 32px); padding: 12px 18px; border-radius: 12px; background: #1A0E05; color: #F5E6D5; font-size: 13px; box-shadow: 0 6px 24px rgba(0,0,0,.25); z-index: 40; }
.dark .cr-toast { background: #F5E6D5; color: #1A0E05; }
.cr-toast button { background: none; border: none; color: #F0A272; font-weight: 700; font-size: 13px; cursor: pointer; }
.dark .cr-toast button { color: #C85A1A; }

@media (max-width: 900px) { .cr-inner { padding: 20px 20px 32px 76px; } }
@media (max-width: 520px) {
  .cr-inner { padding: 16px 12px 28px 64px; gap: 18px; }
  .cr h1 { font-size: 21px; }
  .card { padding: 18px 16px; }
  .cr-two { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .cr, .cr-card, .swatch, .cr-del { transition: none; }
  .cr-card:hover { transform: none; }
}

/* Son sayfa hizalamalari */
.cr-inner { padding: 24px 32px 40px 15px; }
.cr-inner > .card,
.cr-inner > .cr-grid {
  transform: translateX(-60px);
  width: calc(100% + 60px);
}
@media (max-width: 900px) {
  .cr-inner { padding: 20px 20px 32px 76px; }
  .cr-inner > .card,
  .cr-inner > .cr-grid {
    transform: none;
    width: 100%;
  }
}
@media (max-width: 520px) {
  .cr-inner { padding: 16px 12px 28px 64px; gap: 18px; }
}
`;

export default Courses;