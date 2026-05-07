import TaskItem from "./TaskItem";

function TaskList({ tasks }) {
  return (
    <div className="task-box">
      <h2>Tasks</h2>
      {tasks.map((item, index) => (
        <TaskItem key={index} item={item} />
      ))}
    </div>
  );
}

export default TaskList;