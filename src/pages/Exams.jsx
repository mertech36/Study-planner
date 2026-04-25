import { useState } from "react";

function Exams({ exams, setExams }) {
  const [examTitle, setExamTitle] = useState("");
  const [course, setCourse] = useState("");
  const [examDate, setExamDate] = useState("");
  const [notes, setNotes] = useState("");

  const addExam = () => {
    if (!examTitle || !course || !examDate || !notes) return;

    const newExam = {
      id: Date.now(),
      examTitle,
      course,
      examDate,
      notes
    };

    setExams([...exams, newExam]);

    setExamTitle("");
    setCourse("");
    setExamDate("");
    setNotes("");
  };

  const deleteExam = (id) => {
    const updatedExams = exams.filter(
      (exam) => exam.id !== id
    );

    setExams(updatedExams);
  };

  return (
    <div className="container">
      <h1>Exams</h1>
      <p>Add and manage your exams</p>

      <input
        type="text"
        placeholder="Exam Title"
        value={examTitle}
        onChange={(e) =>
          setExamTitle(e.target.value)
        }
        onKeyDown={(e) =>
          e.key === "Enter" && addExam()
        }
      />

      <input
        type="text"
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addExam()
        }
      />

      <input
        type="date"
        value={examDate}
        onChange={(e) =>
          setExamDate(e.target.value)
        }
        onKeyDown={(e) =>
          e.key === "Enter" && addExam()
        }
      />

      <input
        type="text"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && addExam()
        }
      />

      <button onClick={addExam}>
        Add Exam
      </button>

      <div className="task-box">
        <h2>Exam List</h2>

        {exams.map((exam) => (
          <div
            key={exam.id}
            style={{
              margin: "10px 0",
              padding: "15px",
              borderRadius: "10px",
              backgroundColor: "#eee",
              color: "black"
            }}
          >
            <p>
              <strong>{exam.examTitle}</strong>
            </p>

            <p>Course: {exam.course}</p>
            <p>Date: {exam.examDate}</p>
            <p>Notes: {exam.notes}</p>

            <button
              onClick={() =>
                deleteExam(exam.id)
              }
              style={{
                backgroundColor: "red",
                color: "white"
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

export default Exams;