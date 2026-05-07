import { useState, useEffect } from "react";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";

function App() {
  const [page, setPage] = useState("dashboard");

  /* TASKS */
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  /* EXAMS */
  const [exams, setExams] = useState(() => {
    return JSON.parse(localStorage.getItem("exams")) || [];
  });

  /* COURSES */
  const [courses, setCourses] = useState(() => {
    return JSON.parse(localStorage.getItem("courses")) || [];
  });

  /* LOCAL STORAGE SAVE */

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  /* PAGE RENDER */

  const renderPage = () => {
    if (page === "dashboard") {
      return (
        <Dashboard
          tasks={tasks}
          exams={exams}
          courses={courses}
        />
      );
    }

    if (page === "tasks") {
      return (
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
        />
      );
    }

    if (page === "courses") {
      return (
        <Courses
          courses={courses}
          setCourses={setCourses}
        />
      );
    }

    if (page === "exams") {
      return (
        <Exams
          exams={exams}
          setExams={setExams}
        />
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      {/* SIDEBAR */}
      <Sidebar
        page={page}
        setPage={setPage}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;