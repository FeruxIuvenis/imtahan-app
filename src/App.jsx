import { useState, useMemo, useRef } from "react";
import "./App.css";
import Question from "./components/question/Question";
import Timer from "./components/Timer";
import { questions as alqoQuestions } from "./assets/alqo.json";
import { questions as adiakQuestions } from "./assets/adiak.json";

const QUESTION_SETS = {
  adiak: adiakQuestions,
  alqo: alqoQuestions,
};

function shuffleOptions(q) {
  const options = [...q.wrong, q.correct].sort(() => Math.random() - 0.5);
  return { ...q, options };
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function App() {
  const [questionSet, setQuestionSet] = useState("adiak");
  const [range, setRange] = useState("1-700");
  const [count, setCount] = useState(50);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [started, setStarted] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  const elapsedRef = useRef(0);
  const examRunning = started && score === null;

  const questions = useMemo(() => {
    const [min, max] = range.split("-").map(Number);
    const limit = Number(count);
    const questionsData = QUESTION_SETS[questionSet];

    return shuffleArray(
      questionsData.filter((q) => q.number >= min && q.number <= max),
    )
      .slice(0, limit)
      .map(shuffleOptions);
  }, [started]);

  const handleSelect = (questionNumber, option) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: option }));
  };

  const handleStart = () => {
    setAnswers({});
    setScore(null);
    elapsedRef.current = 0;
    setStarted(true);
  };

  const handleFinish = () => {
    const correct = questions.filter(
      (q) => answers[q.number] === q.correct,
    ).length;
    setFinalTime(elapsedRef.current);
    setScore({ correct, total: questions.length });
  };

  const handleReset = () => {
    setStarted(false);
    setScore(null);
    setAnswers({});
  };

  const answeredCount = Object.keys(answers).length;

  if (!started) {
    return (
      <div id="center">
        <header className="app-header">
          <section className="filter">
            <label>Question Set</label>
            <select
              value={questionSet}
              onChange={(e) => setQuestionSet(e.target.value)}
            >
              <option value="adiak">Adiak</option>
              <option value="alqo">Alqo</option>
            </select>
          </section>
          <section className="filter">
            <label>Question Range</label>
            <input
              type="text"
              placeholder="e.g. 1-700"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
          </section>
          <section className="filter">
            <label>Count</label>
            <input
              type="text"
              placeholder="Enter a number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </section>
          <button className="btn-start" onClick={handleStart}>
            Start Exam
          </button>
        </header>
      </div>
    );
  }

  if (score !== null) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div id="center">
        <div className="score-screen">
          <h2>Exam Complete</h2>
          <p className="score">
            {score.correct} / {score.total}
          </p>
          <p className="percentage">{percentage}%</p>
          <p className="time-taken">Time: {formatTime(finalTime)}</p>
          <p className={percentage >= 70 ? "pass" : "fail"}>
            {percentage >= 70 ? "Pass ✓" : "Fail ✗"}
          </p>
          <button className="btn-start" onClick={handleReset}>
            Try Again
          </button>
        </div>

        {/* Wrong answers review */}
        <div className="review">
          <h3>Wrong Answers</h3>
          {questions
            .filter((q) => answers[q.number] !== q.correct)
            .map((q) => (
              <Question
                key={q.number}
                number={q.number}
                body={q.body}
                options={q.options}
                selected={answers[q.number] ?? null}
                correct={q.correct}
                reviewMode
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div id="center">
      <header className="app-header">
        <span className="progress">
          {answeredCount} / {questions.length} answered
        </span>
        <Timer
          running={examRunning}
          onTick={(s) => {
            elapsedRef.current = s;
          }}
        />
        <button
          className="btn-finish"
          onClick={handleFinish}
          disabled={answeredCount === 0}
        >
          Finish Exam
        </button>
      </header>
      <main className="app-main">
        {questions.map((q) => (
          <Question
            key={q.number}
            number={q.number}
            body={q.body}
            options={q.options}
            selected={answers[q.number] ?? null}
            onSelect={(option) => handleSelect(q.number, option)}
          />
        ))}
      </main>
      <footer className="app-footer">
        <span>
          {answeredCount} / {questions.length} answered
        </span>
        <button
          className="btn-finish"
          onClick={handleFinish}
          disabled={answeredCount === 0}
        >
          Finish Exam
        </button>
      </footer>
    </div>
  );
}

export default App;