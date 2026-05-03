function Dashboard({ tasks, exams, courses }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const upcomingTasks = tasks.filter(
    (task) => !task.completed
  );

  const upcomingExams = exams.length;

  const totalCourses = courses.length;

  return (
    <div className="dashboard-bg">
      <div className="container">
        <h1>Dashboard</h1>
        <p>Welcome to your Study Planner</p>

        {/* STATS */}
        <div className="stats-row">
          <div className="stats-card">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>

          <div className="stats-card">
            <h3>Completed</h3>
            <p>{completedTasks}</p>
          </div>

          <div className="stats-card">
            <h3>Upcoming Exams</h3>
            <p>{upcomingExams}</p>
          </div>

          <div className="stats-card">
            <h3>Courses</h3>
            <p>{totalCourses}</p>
          </div>
        </div>

        {/* UPCOMING TASKS */}
        <div className="task-box">
          <h2>Upcoming Tasks</h2>

          {upcomingTasks.length === 0 ? (
            <p>No pending tasks</p>
          ) : (
            upcomingTasks.map((task) => (
              <p key={task.id}>
                {task.title} - {task.course}
              </p>
            ))
          )}
        </div>

        {/* UPCOMING EXAMS */}
        <div className="task-box">
          <h2>Upcoming Exams</h2>

          {exams.length === 0 ? (
            <p>No exams added</p>
          ) : (
            exams.map((exam) => (
              <p key={exam.id}>
                {exam.examTitle} - {exam.examDate}
              </p>
            ))
          )}
        </div>

        {/* COURSES */}
        <div className="task-box">
          <h2>Courses</h2>

          {courses.length === 0 ? (
            <p>No courses added</p>
          ) : (
            courses.map((course) => (
              <p key={course.id}>
                {course.name}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;