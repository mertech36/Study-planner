import { useState } from "react";

import {
  FiBookOpen,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

function Courses({ courses, setCourses }) {
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");

  const [selectedColor, setSelectedColor] =
    useState("blue");

  const addCourse = () => {
    if (!name || !semester) return;

    const newCourse = {
      id: Date.now(),
      name,
      semester,
      color: selectedColor,
    };

    setCourses([...courses, newCourse]);

    setName("");
    setSemester("");
    setSelectedColor("blue");
  };

  const deleteCourse = (id) => {
    const filteredCourses = courses.filter(
      (course) => course.id !== id
    );

    setCourses(filteredCourses);
  };

  const getCardColor = (color) => {
    if (color === "blue") {
      return "from-blue-500 to-indigo-600";
    }

    if (color === "purple") {
      return "from-purple-500 to-fuchsia-600";
    }

    if (color === "green") {
      return "from-green-500 to-emerald-600";
    }

    if (color === "red") {
      return "from-red-500 to-rose-600";
    }

    if (color === "orange") {
      return "from-orange-500 to-amber-600";
    }

    if (color === "pink") {
      return "from-pink-500 to-rose-500";
    }

    return "from-blue-500 to-indigo-600";
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-5xl font-extrabold text-slate-900">
          Courses
        </h1>

        <p className="text-slate-500 mt-3 text-lg">
          Manage your study subjects beautifully.
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
              Create a new subject workspace
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="Course name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
          />

          <input
            type="text"
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100 transition-all"
          />

        </div>

        {/* COLOR PICKER */}
        <div className="mt-8">

          <p className="text-slate-700 font-semibold mb-4">
            Choose Course Color
          </p>

          <div className="flex gap-3 flex-wrap">

            {[
              "blue",
              "purple",
              "green",
              "red",
              "orange",
              "pink",
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`
                  w-12 h-12 rounded-2xl transition-all duration-300 border-4
                  ${color === "blue" && "bg-blue-500"}
                  ${color === "purple" && "bg-purple-500"}
                  ${color === "green" && "bg-green-500"}
                  ${color === "red" && "bg-red-500"}
                  ${color === "orange" && "bg-orange-500"}
                  ${color === "pink" && "bg-pink-500"}

                  ${
                    selectedColor === color
                      ? "scale-110 border-white shadow-2xl"
                      : "border-transparent opacity-80 hover:scale-105"
                  }
                `}
              />
            ))}

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={addCourse}
          className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-7 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Add Course
        </button>

      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm col-span-full">

            <p className="text-slate-500 text-lg">
              No courses added 📚
            </p>

          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className={`bg-gradient-to-br ${getCardColor(
                course.color
              )} rounded-[36px] p-6 text-white shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
            >

              {/* TOP */}
              <div className="flex items-center justify-between">

                <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md">

                  <FiBookOpen size={30} />

                </div>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-red-500 transition-all flex items-center justify-center"
                >

                  <FiTrash2 size={20} />

                </button>

              </div>

              {/* CONTENT */}
              <div className="mt-10">

                <h2 className="text-4xl font-bold tracking-tight">
                  {course.name}
                </h2>

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