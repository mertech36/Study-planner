import { useState } from "react";

import {
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

function Exams({ exams, setExams }) {
  const [examTitle, setExamTitle] = useState("");
  const [course, setCourse] = useState("");
  const [examDate, setExamDate] = useState("");
  const [notes, setNotes] = useState("");

  const addExam = () => {
    if (!examTitle || !course || !examDate)
      return;

    const newExam = {
      id: Date.now(),
      examTitle,
      course,
      examDate,
      notes,
    };

    setExams([...exams, newExam]);

    setExamTitle("");
    setCourse("");
    setExamDate("");
    setNotes("");
  };

  const deleteExam = (id) => {
    setExams(
      exams.filter((exam) => exam.id !== id)
    );
  };

  const getDaysLeft = (date) => {
    const today = new Date();

    const examDay = new Date(date);

    const diff =
      examDay.getTime() - today.getTime();

    return Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-5xl font-extrabold text-slate-900">
          Exams
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Track your upcoming exams and deadlines.
        </p>

      </div>

      {/* CREATE EXAM */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Add New Exam
            </h2>

            <p className="text-slate-500 mt-1">
              Create a new exam reminder
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-orange-100 flex items-center justify-center">

            <FiPlus
              className="text-orange-500"
              size={28}
            />

          </div>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* TITLE */}
          <input
            type="text"
            placeholder="Exam title"
            value={examTitle}
            onChange={(e) =>
              setExamTitle(e.target.value)
            }
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-100 transition-all"
          />

          {/* COURSE */}
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-100 transition-all"
          />

          {/* DATE */}
          <input
            type="date"
            value={examDate}
            onChange={(e) =>
              setExamDate(e.target.value)
            }
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-100 transition-all"
          />

          {/* NOTES */}
          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-orange-100 transition-all"
          />

        </div>

        {/* BUTTON */}
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
          <div className="col-span-full bg-white rounded-3xl p-12 text-center shadow-sm">

            <p className="text-slate-500 text-lg">
              No exams added yet 📝
            </p>

          </div>
        ) : (
          exams.map((exam) => {
            const daysLeft = getDaysLeft(
              exam.examDate
            );

            return (
              <div
                key={exam.id}
                className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >

                {/* TOP BAR */}
                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-orange-400 to-red-500"></div>

                {/* HEADER */}
                <div className="flex items-center justify-between mt-2">

                  <div className="w-16 h-16 rounded-3xl bg-orange-100 flex items-center justify-center">

                    <FiCalendar
                      className="text-orange-500"
                      size={30}
                    />

                  </div>

                  <button
                    onClick={() =>
                      deleteExam(exam.id)
                    }
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center text-slate-500"
                  >

                    <FiTrash2 size={20} />

                  </button>

                </div>

                {/* CONTENT */}
                <div className="mt-8">

                  <h2 className="text-3xl font-bold text-slate-900">
                    {exam.examTitle}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    {exam.course}
                  </p>

                  {/* DATE */}
                  <div className="mt-6 flex items-center gap-3 text-orange-500 font-semibold">

                    <FiClock />

                    <span>
                      {exam.examDate}
                    </span>

                  </div>

                  {/* COUNTDOWN */}
                  <div className="mt-6 inline-flex px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">

                    {daysLeft > 0
                      ? `${daysLeft} days left`
                      : "Today"}
                  </div>

                  {/* NOTES */}
                  {exam.notes && (
                    <div className="mt-6 bg-slate-50 rounded-2xl p-4">

                      <p className="text-slate-600 leading-relaxed">
                        {exam.notes}
                      </p>

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