import { useState, useEffect } from "react";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import focus from "./pages/focus";

function App() {

  const [page, setPage] = useState("dashboard");

  /* DARK MODE */
  const [darkMode, setDarkMode] =
    useState(false);

  /* TASK FILTER */
  const [taskFilter, setTaskFilter] =
    useState("all");

  /* TASKS */
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(
      localStorage.getItem("tasks")
    ) || [];
  });

  /* EXAMS */
  const [exams, setExams] = useState(() => {
    return JSON.parse(
      localStorage.getItem("exams")
    ) || [];
  });

  /* COURSES */
  const [courses, setCourses] = useState(() => {
    return JSON.parse(
      localStorage.getItem("courses")
    ) || [];
  });

  /* LOCAL STORAGE SAVE */

  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "exams",
      JSON.stringify(exams)
    );
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(
      "courses",
      JSON.stringify(courses)
    );
  }, [courses]);

  /* PAGE RENDER */

  const renderPage = () => {

    /* DASHBOARD */
    if (page === "dashboard") {
      return (
        <Dashboard
          tasks={tasks}
          exams={exams}
          courses={courses}
          setPage={setPage}
          setTaskFilter={setTaskFilter}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      );
    }

    /* TASKS */
    if (page === "tasks") {
      return (
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
          taskFilter={taskFilter}
          setTaskFilter={setTaskFilter}
          darkMode={darkMode}
        />
      );
    }

    /* COURSES */
    if (page === "courses") {
      return (
        <Courses
          courses={courses}
          setCourses={setCourses}
          darkMode={darkMode}
        />
      );
    }

    /* EXAMS */
    if (page === "exams") {
      return (
        <Exams
          exams={exams}
          setExams={setExams}
          darkMode={darkMode}
        />
      );
    }

    /* FOCUS MODE */
    if (page === "focus") {
      return (
        <Focus
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      );
    }

  };

  return (

    <div
      className={`flex min-h-screen transition-all duration-500
      ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#081028] to-[#020617]"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"
      }`}
    >

      {/* SIDEBAR */}
      <Sidebar
        page={page}
        setPage={setPage}
        darkMode={darkMode}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPage()}
      </main>

    </div>

  );
}

export default App;