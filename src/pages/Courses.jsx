import { useState } from "react";
import { FiBookOpen, FiTrash2, FiPlus } from "react-icons/fi";

function Courses({ courses, setCourses, darkMode }) {
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const dm = darkMode;

  const addCourse = () => {
    if (!name || !semester) return;
    setCourses([...courses, { id: Date.now(), name, semester, color: selectedColor }]);
    setName(""); setSemester(""); setSelectedColor("blue");
  };

  const deleteCourse = (id) => setCourses(courses.filter((c) => c.id !== id));

  const getCardColor = (color) => {
    const map = {
      blue: "from-blue-500 to-indigo-600",
      purple: "from-purple-500 to-fuchsia-600",
      green: "from-green-500 to-emerald-600",
      red: "from-red-500 to-rose-600",
      orange: "from-orange-500 to-amber-600",
      pink: "from-pink-500 to-rose-500",
    };
    return map[color] || "from-blue-500 to-indigo-600";
  };

  const cardForm = dm ? "bg-[#1a1f35] border border-white/5" : "bg-white/70 backdrop-blur-xl border border-white/40";
  const input = dm
    ? "bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
    : "bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100 transition-all";
  const textMain = dm ? "text-white" : "text-slate-900";
  const textSub = dm ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className={`text-5xl font-extrabold ${textMain}`}>Courses</h1>
        <p className={`mt-3 text-lg ${textSub}`}>Manage your study subjects beautifully.</p>
      </div>

      {/* ADD COURSE */}
      <div className={`${cardForm} rounded-[32px] p-8 shadow-xl`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${textMain}`}>Add New Course</h2>
            <p className={`mt-1 ${textSub}`}>Create a new subject workspace</p>
          </div>
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${dm ? "bg-purple-500/20" : "bg-purple-100"}`}>
            <FiPlus className={dm ? "text-purple-400" : "text-purple-600"} size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" placeholder="Course name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
          <input type="text" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} className={input} />
        </div>

        {/* COLOR PICKER */}
        <div className="mt-8">
          <p className={`font-semibold mb-4 ${textMain}`}>Choose Course Color</p>
          <div className="flex gap-3 flex-wrap">
            {["blue", "purple", "green", "red", "orange", "pink"].map((color) => (
              <button key={color} type="button" onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-2xl transition-all duration-300 border-4
                  ${color === "blue" && "bg-blue-500"}
                  ${color === "purple" && "bg-purple-500"}
                  ${color === "green" && "bg-green-500"}
                  ${color === "red" && "bg-red-500"}
                  ${color === "orange" && "bg-orange-500"}
                  ${color === "pink" && "bg-pink-500"}
                  ${selectedColor === color ? "scale-110 border-white shadow-2xl" : "border-transparent opacity-80 hover:scale-105"}
                `}
              />
            ))}
          </div>
        </div>

        <button onClick={addCourse} className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all duration-300">
          Add Course
        </button>
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className={`${dm ? "bg-[#1a1f35] border border-white/5" : "bg-white"} rounded-3xl p-10 text-center shadow-sm col-span-full`}>
            <p className={`text-lg ${textSub}`}>No courses added 📚</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id}
              className={`bg-gradient-to-br ${getCardColor(course.color)} rounded-[36px] p-6 text-white shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <FiBookOpen size={30} />
                </div>
                <button onClick={() => deleteCourse(course.id)}
                  className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-red-500 transition-all flex items-center justify-center"
                ><FiTrash2 size={20} /></button>
              </div>
              <div className="mt-10">
                <h2 className="text-4xl font-bold tracking-tight">{course.name}</h2>
                <div className="mt-6 inline-flex px-4 py-2 rounded-2xl bg-white/20 text-white font-semibold backdrop-blur-md">
                  {course.semester}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;
