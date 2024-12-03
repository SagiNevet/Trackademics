import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem("schedule");
    return savedSchedule ? JSON.parse(savedSchedule) : {};
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("הרצאה");
  const [practiceLink, setPracticeLink] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [day, setDay] = useState("ראשון");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask = {
      title: taskTitle,
      link,
      type,
      practiceLink,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setLink("");
    setType("הרצאה");
    setPracticeLink("");
  };

  const addScheduleEvent = (e) => {
    e.preventDefault();
    if (!eventTitle || !day || !startTime || !endTime) return;

    const newEvent = { title: eventTitle, startTime, endTime };
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newEvent],
    }));

    setEventTitle("");
    setDay("ראשון");
    setStartTime("");
    setEndTime("");
  };

  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const deleteScheduleEvent = (day, index) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule[day] = updatedSchedule[day].filter((_, i) => i !== index);

    if (updatedSchedule[day].length === 0) {
      delete updatedSchedule[day];
    }

    setSchedule(updatedSchedule);
  };

  const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  return (
    <div className="App">
      <div className="left-side">
        <div className="main">
          <h1>🎓 מעקב לימודים לסטודנטים</h1>

          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="כותרת משימה (לדוגמה, הרצאה 1)"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="קישור (לא חובה)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="הרצאה">הרצאה</option>
              <option value="תרגול">תרגול</option>
            </select>
            <button type="submit">הוסף משימה</button>
          </form>

          <div className="task-list">
            {tasks.map((task, index) => (
              <div key={index} className={`task ${task.completed ? "completed" : ""}`}>
                <h3>{task.title} ({task.type})</h3>
                {task.link && (
                  <a href={task.link} target="_blank" rel="noopener noreferrer">
                    קישור להרצאה
                  </a>
                )}
                {task.practiceLink && (
                  <a href={task.practiceLink} target="_blank" rel="noopener noreferrer">
                    קישור לתרגול
                  </a>
                )}
                <button onClick={() => toggleCompletion(index)}>
                  {task.completed ? "סמן כלא הושלם" : "סמן כהושלם"}
                </button>
                <button onClick={() => deleteTask(index)}>מחק משימה</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="schedule">
        <h2>📅 מערכת שעות</h2>
        <form onSubmit={addScheduleEvent}>
          <input
            type="text"
            placeholder="כותרת אירוע (לדוגמה, שיעור)"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="שעת התחלה (לדוגמה, 08:00)"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="שעת סיום (לדוגמה, 10:00)"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button type="submit">הוסף אירוע</button>
        </form>

        <div className="schedule-grid">
          {daysOfWeek.map((d) => (
            <div key={d} className="day-card">
              <h3>{d}</h3>
              <ul>
                {(schedule[d] || []).map((event, i) => (
                  <li key={i}>
                    {event.startTime} - {event.endTime} : {event.title}
                    <button onClick={() => deleteScheduleEvent(d, i)}>מחק</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
