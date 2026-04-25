import { useState } from "react";

function Tasks({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (!title || !course || !dueDate || !priority || !status) return;

    const newTask = {
      id: Date.now(),
      title,
      course,
      dueDate,
      priority,
      status,
      completed: false
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setCourse("");
    setDueDate("");
    setPriority("");
    setStatus("");
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(
      (task) => task.id !== id
    );

    setTasks(filteredTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Tasks</h1>
      <p>Add and manage your tasks</p>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addTask()
        }
      />

      <input
        type="text"
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addTask()
        }
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addTask()
        }
      />

      <input
        type="text"
        placeholder="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addTask()
        }
      />

      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addTask()
        }
      />

      <button onClick={addTask}>
        Add Task
      </button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button onClick={() => setFilter("pending")}>
          Pending
        </button>
      </div>

      <div className="task-box">
        <h2>Task List</h2>

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              margin: "10px 0",
              padding: "15px",
              borderRadius: "10px",
              backgroundColor: task.completed
                ? "#90ee90"
                : "#eee",
              color: "black"
            }}
          >
            <p>
              <strong
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : "none"
                }}
              >
                {task.title}
              </strong>
            </p>

            <p>Course: {task.course}</p>
            <p>Due: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() =>
                  toggleComplete(task.id)
                }
                style={{
                  marginRight: "10px",
                  backgroundColor: "green",
                  color: "white"
                }}
              >
                {task.completed
                  ? "Undo"
                  : "Complete"}
              </button>

              <button
                onClick={() =>
                  deleteTask(task.id)
                }
                style={{
                  backgroundColor: "red",
                  color: "white"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;