const LABELS = ["A", "B", "C", "D", "E"];

const Question = ({ number, body, options, selected, onSelect, correct, reviewMode }) => {
  return (
    <div className="question">
      <div className="text">
        <span>{number}. </span>
        <span>{body}</span>
      </div>
      <div className="options">
        {options.map((option, i) => {
          let className = "option-btn";
          if (reviewMode) {
            if (option === correct) className += " correct";
            else if (option === selected) className += " wrong";
          } else {
            if (option === selected) className += " selected";
          }

          return (
            <button
              key={i}
              className={className}
              onClick={!reviewMode ? () => onSelect(option) : undefined}
              disabled={reviewMode}
            >
              <span className="option-label">{LABELS[i]}</span>
              <span className="option-text">{option}</span>
              {reviewMode && option === correct && <span className="option-correct">✓</span>}
              {reviewMode && option === selected && option !== correct && <span className="option-wrong">✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Question;