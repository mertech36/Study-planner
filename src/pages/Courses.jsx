import { useState } from "react";
import { FiBookOpen, FiTrash2, FiPlus, FiFileText } from "react-icons/fi";

const COLOR_MAP = {
  blue:   { gradient: "from-blue-500 to-indigo-600",    btn: "bg-blue-500",    ring: "ring-blue-400" },
  purple: { gradient: "from-purple-500 to-fuchsia-600", btn: "bg-purple-500",  ring: "ring-purple-400" },
  green:  { gradient: "from-green-500 to-emerald-600",  btn: "bg-green-500",   ring: "ring-green-400" },
  red:    { gradient: "from-red-500 to-rose-600",       btn: "bg-red-500",     ring: "ring-red-400" },
  orange: { gradient: "from-orange-500 to-amber-600",   btn: "bg-orange-500",  ring: "ring-orange-400" },
  pink:   { gradient: "from-pink-500 to-rose-500",      btn: "bg-pink-500",    ring: "ring-pink-400" },
};

const COLORS = Object.keys(COLOR_MAP);

function Courses({ courses, setCourses, darkMode }) {
  const [name, setName]               = useState("");
  const [semester, setSemester]       = useState("");
  const [notes, setNotes]             = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const dm = darkMode;

  const addCourse = () => {
    if (!name.trim() || !semester.trim()) return;
    setCourses([...courses, {
      id: Date.now(),
      name: name.trim(),
      semester: semester.trim(),
      notes: notes.trim(),
      color: selectedColor,
    }]);
    setName(""); setSemester(""); setNotes(""); setSelectedColor("blue");
  };

  const deleteCourse = (id) => setCourses(courses.filter((c) => c.id !== id));
  const handleKeyDown = (e) => { if (e.key === "Enter") addCourse(); };

  const cardBg  = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white border border-slate-100 shadow-sm";
  const inputCls = dm
    ? "w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
    : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-900";
  const textMain  = dm ? "text-white"      : "text-slate-900";
  const textSub   = dm ? "text-slate-400"  : "text-slate-500";
  const textMuted = dm ? "text-slate-500"  : "text-slate-400";

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-black ${textMain}`}>Courses</h1>
        <p className={`mt-1 ${textSub}`}>Manage your study subjects beautifully.</p>
      </div>

      {/* ADD FORM */}
      <div className={`${cardBg} rounded-[28px] p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`text-xl font-black ${textMain}`}>Add New Course</h2>
            <p className={`text-sm mt-0.5 ${textSub}`}>Create a new subject workspace</p>
          </div>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${dm ? "bg-purple-500/20" : "bg-purple-100"}`}>
            <FiPlus className={dm ? "text-purple-400" : "text-purple-600"} size={20} />
          </div>
        </div>

        {/* ROW 1: name + semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text" placeholder="Course name"
            value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown}
            className={inputCls}
          />
          <input
            type="text" placeholder="Semester (e.g. Spring 2026)"
            value={semester} onChange={(e) => setSemester(e.target.value)} onKeyDown={handleKeyDown}
            className={inputCls}
          />
        </div>

        {/* ROW 2: notes textarea */}
        <div className="mb-5">
          <textarea
            placeholder="Notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={inputCls + " resize-none"}
          />
        </div>

        {/* COLOR PICKER */}
        <div className="mb-5">
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${textMuted}`}>Choose Color</p>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map((color) => {
              const active = selectedColor === color;
              return (
                <button
                  key={color} type="button"
                  onClick={() => setSelectedColor(color)}
                  className={[
                    "w-8 h-8 rounded-xl transition-all duration-200",
                    COLOR_MAP[color].btn,
                    active
                      ? `scale-110 ring-4 ring-offset-2 ${COLOR_MAP[color].ring} ${dm ? "ring-offset-[#1a1f35]" : "ring-offset-white"} shadow-lg`
                      : "opacity-50 hover:opacity-80 hover:scale-105",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        <button
          onClick={addCourse}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Add Course
        </button>
      </div>

      {/* GRID */}
      {courses.length === 0 ? (
        <div className={`${cardBg} rounded-[28px] p-12 text-center`}>
          <div className={`w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center ${dm ? "bg-white/5" : "bg-slate-100"}`}>
            <FiBookOpen size={26} className={textMuted} />
          </div>
          <p className={`text-lg font-bold ${textMain}`}>No courses yet</p>
          <p className={`text-sm mt-1 ${textSub}`}>Add your first course above 📚</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => {
            const c = COLOR_MAP[course.color] || COLOR_MAP.blue;
            return (
              <div
                key={course.id}
                className={[
                  "group relative rounded-[24px] overflow-hidden",
                  "hover:scale-[1.02] hover:shadow-2xl",
                  "transition-all duration-300",
                  `bg-gradient-to-br ${c.gradient}`,
                ].join(" ")}
                style={{ minHeight: "180px" }}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-4">

                  {/* TOP */}
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <FiBookOpen className="text-white" size={16} />
                    </div>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="w-7 h-7 rounded-lg bg-black/20 hover:bg-red-500 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 className="text-white" size={12} />
                    </button>
                  </div>

                  {/* BOTTOM */}
                  <div>
                    <h2 className="text-sm font-black text-white leading-tight mb-1.5 line-clamp-2">
                      {course.name}
                    </h2>
                    <span className="inline-flex text-xs font-semibold text-white/80 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-lg mb-2">
                      {course.semester}
                    </span>

                    {/* NOTES */}
                    {course.notes && (
                      <div className="flex items-start gap-1.5 bg-black/20 backdrop-blur-sm rounded-xl px-2.5 py-1.5 mt-1">
                        <FiFileText className="text-white/70 mt-0.5 shrink-0" size={11} />
                        <p className="text-white/80 text-xs leading-snug line-clamp-2">{course.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-black/10 pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Courses;