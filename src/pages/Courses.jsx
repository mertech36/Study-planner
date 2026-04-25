import { useState, useEffect } from "react";

function Courses() {
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [color, setColor] = useState("");

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

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
    <div className="container">
      <h1>Courses</h1>
      <p>Add and manage your courses</p>

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

      <div className="task-box">
        <h2>Course List</h2>

        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              backgroundColor: course.color,
              color: "black",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "10px"
            }}
          >
            <strong>{course.name}</strong>
            <p>{course.semester}</p>

            

            <button
              onClick={() => deleteCourse(course.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px"
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;