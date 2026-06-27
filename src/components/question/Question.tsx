const LABELS = ["A", "B", "C", "D", "E"]

const Question = ({ number, body, options, selected, onSelect, correct, reviewMode }) => {
  return (
    <div className="question">
      <div className="text">
        <span>{number}. </span>
        <span>{body}</span>
      </div>
      <div className="options">
        {options.map((option, i) => (
          <button
            key={i}
            className={"option-btn"}
            onClick={!reviewMode ? () => onSelect(option) : undefined}
            disabled={reviewMode}
          >
            <span className="option-label">{LABELS[i]}</span>
            <span className="option-text">{option}</span>
            {reviewMode && option === correct && (
              <span className="option-correct">✓</span>
            )}
            {reviewMode && option === selected && option !== correct && (
              <span className="option-wrong">✗</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Question