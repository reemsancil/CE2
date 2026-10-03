const questions = [
  { sentence: "Open your book.", answer: "command" },
  { sentence: "Turn left at the corner.", answer: "direction" },
  { sentence: "Sit down, please.", answer: "command" },
  { sentence: "Go straight ahead.", answer: "direction" },
  { sentence: "Don't run in the classroom.", answer: "command" },
  { sentence: "Turn right after the school.", answer: "direction" },
  { sentence: "Listen to the teacher.", answer: "command" },
  { sentence: "Cross the street carefully.", answer: "direction" },
  { sentence: "Don't touch the computer.", answer: "command" },
  { sentence: "Walk past the park.", answer: "direction" },
];

const positiveMessages = ["Great job!", "Correct!", "Excellent!", "Well done!"];
let currentQuestion = 0;
let score = 0;
let questionSolved = false;

const elements = {
  quizView: document.querySelector("#quiz-view"), results: document.querySelector("#results"),
  questionNumber: document.querySelector("#question-number"), sentence: document.querySelector("#sentence"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"),
  score: document.querySelector("#score"), nextButton: document.querySelector("#next-button"),
  progressFill: document.querySelector("#progress-fill"), progressBar: document.querySelector("[role='progressbar']"),
  progressLabel: document.querySelector("#progress-label"), finalScore: document.querySelector("#final-score"),
  playAgain: document.querySelector("#play-again"),
};

function renderQuestion() {
  questionSolved = false;
  elements.questionNumber.textContent = currentQuestion + 1;
  elements.sentence.textContent = questions[currentQuestion].sentence;
  elements.feedback.textContent = "";
  elements.feedback.className = "feedback";
  elements.nextButton.classList.remove("visible");
  elements.progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  elements.progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
  elements.progressLabel.textContent = currentQuestion === 0 ? "Let’s begin!" : "Keep going!";

  elements.answers.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
    button.removeAttribute("aria-label");
  });
}

function checkAnswer(button) {
  if (questionSolved) return;
  if (button.dataset.answer === questions[currentQuestion].answer) {
    questionSolved = true;
    score += 1;
    button.classList.add("correct");
    button.setAttribute("aria-label", `${button.textContent.trim()}, correct answer`);
    elements.answers.querySelectorAll("button").forEach((answer) => { answer.disabled = true; });
    elements.score.textContent = score;
    elements.feedback.textContent = positiveMessages[currentQuestion % positiveMessages.length];
    elements.feedback.className = "feedback feedback--correct";
    elements.nextButton.classList.add("visible");
    elements.nextButton.focus();
  } else {
    button.classList.add("wrong");
    button.disabled = true;
    elements.feedback.textContent = "Try again!";
    elements.feedback.className = "feedback feedback--wrong";
  }
}

function nextQuestion() {
  currentQuestion += 1;
  if (currentQuestion < questions.length) renderQuestion();
  else showResults();
}

function showResults() {
  elements.quizView.hidden = true;
  elements.results.hidden = false;
  elements.finalScore.textContent = score;
  elements.results.querySelector("h2").focus();
}

function restartGame() {
  currentQuestion = 0;
  score = 0;
  elements.score.textContent = "0";
  elements.results.hidden = true;
  elements.quizView.hidden = false;
  renderQuestion();
}

elements.answers.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-answer]");
  if (button) checkAnswer(button);
});
elements.nextButton.addEventListener("click", nextQuestion);
elements.playAgain.addEventListener("click", restartGame);
renderQuestion();
