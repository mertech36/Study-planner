import { useState } from "react";
import {FiTrash2, FiCalendar, FiClock } from "react-icons/fi";

function Exams({ exams, setExams, darkMode }) {
  const [examTitle, setExamTitle] = useState("");
  const [examDate, setExamDate]   = useState("");
  const [examHour, setExamHour]   = useState("");
  const [notes, setNotes]         = useState("");

  const dm = darkMode;

  const addExam = () => {
    if (!examTitle || !examDate) return;
    setExams([...exams, { id: Date.now(), examTitle, examDate, examHour, notes }]);
    setExamTitle(""); setExamDate(""); setExamHour(""); setNotes("");
  };

  const deleteExam = (id) => setExams(exams.filter((e) => e.id !== id));

  const getDaysLeft = (date) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const cardForm = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white/70 backdrop-blur-xl border border-white/40";
  const card     = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white border border-slate-100";
  const input    = dm
    ? "bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400 transition-all w-full"
    : "bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-100 transition-all w-full";
  const textMain = dm ? "text-white"     : "text-slate-900";
  const textSub  = dm ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className={`text-5xl font-extrabold ${textMain}`}>Exams</h1>
        <p className={`mt-3 text-lg ${textSub}`}>Track your upcoming exams and deadlines.</p>
      </div>

      {/* ADD EXAM */}
      <div className={`${cardForm} rounded-[32px] p-8 shadow-xl`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${textMain}`}>Add New Exam</h2>
            <p className={`mt-1 ${textSub}`}>Create a new exam reminder</p>
          </div>
        </div>

        {/* INPUTS: Title | Date | Hour | Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <input
            type="text" placeholder="Exam title"
            value={examTitle} onChange={(e) => setExamTitle(e.target.value)}
            className={input}
          />
          <input
            type="date"
            value={examDate} onChange={(e) => setExamDate(e.target.value)}
            className={input}
          />
          <input
            type="time"
            value={examHour} onChange={(e) => setExamHour(e.target.value)}
            className={input}
          />
          <input
            type="text" placeholder="Notes (optional)"
            value={notes} onChange={(e) => setNotes(e.target.value)}
            className={input}
          />
        </div>

        <button
          onClick={addExam}
          className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-7 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Add Exam
        </button>
      </div>

      {/* EXAMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className={`col-span-full ${card} rounded-3xl p-12 text-center shadow-sm`}>
            <p className={`text-lg ${textSub}`}>No exams added yet 📝</p>
          </div>
        ) : (
          exams.map((exam) => {
            const daysLeft = getDaysLeft(exam.examDate);
            const urgent   = daysLeft <= 7;
            return (
              <div key={exam.id}
                className={`${card} rounded-[32px] p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
              >
                {/* TOP BAR */}
                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-orange-400 to-red-500" />

                {/* HEADER ROW */}
                <div className="flex items-center justify-between mt-2">
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${dm ? "bg-orange-500/20" : "bg-orange-100"}`}>
                    <FiCalendar className={dm ? "text-orange-400" : "text-orange-500"} size={26} />
                  </div>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${dm ? "bg-white/10 text-slate-400 hover:bg-red-500 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white"}`}
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="mt-6">
                  <h2 className={`text-2xl font-bold ${textMain}`}>{exam.examTitle}</h2>

                  {/* DATE + HOUR */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
                      <FiCalendar size={14} />
                      <span>{exam.examDate}</span>
                    </div>
                    {exam.examHour && (
                      <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
                        <FiClock size={14} />
                        <span>{exam.examHour}</span>
                      </div>
                    )}
                  </div>

                  {/* DAYS LEFT */}
                  <div className={`mt-4 inline-flex px-4 py-1.5 rounded-full font-bold text-sm ${
                    urgent
                      ? dm ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"
                      : dm ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"
                  }`}>
                    {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? "Today! 🔥" : "Passed"}
                  </div>

                  {/* NOTES */}
                  {exam.notes && (
                    <div className={`mt-5 rounded-2xl p-4 ${dm ? "bg-white/5" : "bg-slate-50"}`}>
                      <p className={`text-sm ${textSub}`}>{exam.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Exams;