const sortingQuestions = [
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

const sentenceQuestions = [
  { sentence: "Ask someone to open their book.", choices: ["Open your book.", "Turn left at the corner.", "Go straight ahead."], answer: "Open your book." },
  { sentence: "Tell someone which way to go at the corner.", choices: ["Sit down, please.", "Turn left at the corner.", "Listen to the teacher."], answer: "Turn left at the corner." },
  { sentence: "Tell someone to stop running in class.", choices: ["Walk past the park.", "Cross the street carefully.", "Don't run in the classroom."], answer: "Don't run in the classroom." },
  { sentence: "Tell someone to continue forward.", choices: ["Go straight ahead.", "Don't touch the computer.", "Open your book."], answer: "Go straight ahead." },
];
let questions = sortingQuestions;
function selectExercise(mode) {
  questions = mode === "sort" ? sortingQuestions : sentenceQuestions;
  document.querySelectorAll("[data-exercise]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.exercise === mode)));
  restartGame();
}
document.querySelectorAll("[data-exercise]").forEach(button => button.addEventListener("click", () => selectExercise(button.dataset.exercise)));

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

  const question = questions[currentQuestion];
  document.querySelector("#instruction").textContent = question.choices ? "Choose the correct sentence." : "Sort the sentence: command or direction?";
  document.querySelectorAll(".question-total").forEach(el => { el.textContent = questions.length; });
  elements.progressBar.setAttribute("aria-valuemax", questions.length);
  elements.answers.replaceChildren(...(question.choices || ["command", "direction"]).map(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.dataset.answer = choice;
    button.textContent = choice === "direction" ? "Instruction / direction" : choice;
    return button;
  }));
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
  CompletionResult.show("Imperative Verbs", questions === sortingQuestions ? "Sort sentences" : "Choose a sentence", score, questions.length);
  elements.quizView.hidden = true;
  elements.results.hidden = false;
  elements.finalScore.textContent = score;
  elements.results.querySelector("h2").focus();
}

function restartGame() {
  CompletionResult.reset();
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
