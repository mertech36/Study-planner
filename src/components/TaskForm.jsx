function TaskForm({ task, setTask, addTask }) {
  return (
    <div>
      <input
        type="text"
        placeholder="New Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={addTask}>Add New Task</button>
    </div>
  );
}

export default TaskForm;