import { useState } from "react";

import {
  FiPlus,
  FiTrash2,
  FiBookOpen,
} from "react-icons/fi";

function Courses({ courses, setCourses }) {
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [color, setColor] = useState("blue");

  const addCourse = () => {
    if (!courseName || !semester) return;

    const newCourse = {
      id: Date.now(),
      name: courseName,
      semester,
      color,
    };

    setCourses([...courses, newCourse]);

    setCourseName("");
    setSemester("");
    setColor("blue");
  };

  const deleteCourse = (id) => {
    setCourses(
      courses.filter((course) => course.id !== id)
    );
  };

  const getCardStyle = (color) => {
    if (color === "blue") {
      return "from-blue-500 to-indigo-600";
    }

    if (color === "green") {
      return "from-emerald-500 to-green-600";
    }

    if (color === "purple") {
      return "from-purple-500 to-pink-500";
    }

    if (color === "orange") {
      return "from-orange-500 to-red-500";
    }

    return "from-slate-500 to-slate-700";
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-5xl font-extrabold text-slate-900">
          Courses
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Manage your active subjects and semesters.
        </p>

      </div>

      {/* CREATE COURSE */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-xl">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Add New Course
            </h2>

            <p className="text-slate-500 mt-1">
              Create a new course card
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center">

            <FiPlus
              className="text-purple-600"
              size={28}
            />

          </div>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* COURSE NAME */}
          <input
            type="text"
            placeholder="Course name"
            value={courseName}
            onChange={(e) =>
              setCourseName(e.target.value)
            }
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
          />

          {/* SEMESTER */}
          <input
            type="text"
            placeholder="Semester"
            value={semester}
            onChange={(e) =>
              setSemester(e.target.value)
            }
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
          />

          {/* COLOR */}
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
          </select>

        </div>

        {/* BUTTON */}
        <button
          onClick={addCourse}
          className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-7 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Add Course
        </button>

      </div>

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {courses.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center shadow-sm">

            <p className="text-slate-500 text-lg">
              No courses added yet 📚
            </p>

          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className={`bg-gradient-to-br ${getCardStyle(
                course.color
              )} rounded-[32px] p-7 text-white shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
            >

              {/* GLOW */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

              {/* TOP */}
              <div className="flex items-center justify-between relative z-10">

                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">

                  <FiBookOpen size={30} />

                </div>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-red-500 transition-all duration-300 flex items-center justify-center"
                >

                  <FiTrash2 size={20} />

                </button>

              </div>

              {/* CONTENT */}
              <div className="mt-10 relative z-10">

                <h2 className="text-3xl font-bold">
                  {course.name}
                </h2>

                <div className="mt-5 inline-flex px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl text-sm font-semibold">

                  {course.semester}
                </div>

                {/* PROGRESS */}
                <div className="mt-8">

                  <div className="flex items-center justify-between text-sm text-white/80 mb-2">

                    <span>Course Progress</span>

                    <span>72%</span>

                  </div>

                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">

                    <div className="h-full w-[72%] bg-white rounded-full"></div>

                  </div>

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