import { useState, useEffect } from "react";

function Courses({ refreshDashboard }) {
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [color, setColor] = useState("");

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  /* localStorage kaydet + dashboard yenile */
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));

    if (refreshDashboard) {
      refreshDashboard();
    }
  }, [courses, refreshDashboard]);

  const addCourse = () => {
    if (!courseName || !semester || !color) return;

    const newCourse = {
      id: Date.now(),
      name: courseName,
      semester: semester,
      color: color
    };

    setCourses([...courses, newCourse]);

    setCourseName("");
    setSemester("");
    setColor("");
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="courses-bg">
      <div className="container">
        <h1>Courses</h1>
        <p>Add and manage your courses</p>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCourse();
          }}
        >
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />

          <input
            type="text"
            placeholder="Color (red, blue, green...)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <button type="submit">Add Course</button>
        </form>

        {/* COURSE LIST */}
        <div className="task-box">
          <h2>Course List</h2>

          {courses.length === 0 ? (
            <p>No courses added</p>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: course.color,
                  color: "black",
                  padding: "15px",
                  margin: "10px 0",
                  borderRadius: "10px",
                  transition: "0.3s"
                }}
              >
                <strong>{course.name}</strong>
                <p>{course.semester}</p>

                <button
                  onClick={() => deleteCourse(course.id)}
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;