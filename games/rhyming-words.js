const questions = [
  { word: "CAT", choices: ["hat", "dog", "sun"], answer: "hat" },
  { word: "CAKE", choices: ["fish", "lake", "car"], answer: "lake" },
  { word: "STAR", choices: ["car", "tree", "book"], answer: "car" },
  { word: "LIGHT", choices: ["night", "pen", "ball"], answer: "night" },
  { word: "BLUE", choices: ["shoe", "cat", "bed"], answer: "shoe" },
  { word: "BEE", choices: ["tree", "mouse", "book"], answer: "tree" },
  { word: "BOAT", choices: ["coat", "fish", "cake"], answer: "coat" },
  { word: "RING", choices: ["king", "dog", "chair"], answer: "king" },
  { word: "DAY", choices: ["play", "book", "fish"], answer: "play" },
  { word: "MOON", choices: ["spoon", "cat", "tree"], answer: "spoon" },
];

const positiveMessages = ["Great job!", "Excellent!", "You got it!", "Wonderful!"];
let currentQuestion = 0;
let score = 0;
let questionSolved = false;

const elements = {
  quizView: document.querySelector("#quiz-view"), results: document.querySelector("#results"),
  questionNumber: document.querySelector("#question-number"), targetWord: document.querySelector("#target-word"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"),
  score: document.querySelector("#score"), nextButton: document.querySelector("#next-button"),
  progressFill: document.querySelector("#progress-fill"), progressBar: document.querySelector("[role='progressbar']"),
  progressLabel: document.querySelector("#progress-label"), finalScore: document.querySelector("#final-score"),
  playAgain: document.querySelector("#play-again"),
};

function renderQuestion() {
  const question = questions[currentQuestion];
  questionSolved = false;
  elements.questionNumber.textContent = currentQuestion + 1;
  elements.targetWord.textContent = question.word;
  elements.feedback.textContent = "";
  elements.feedback.className = "feedback";
  elements.nextButton.classList.remove("visible");
  elements.progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  elements.progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
  elements.progressLabel.textContent = currentQuestion === 0 ? "Let’s begin!" : "Keep going!";
  elements.answers.replaceChildren();

  question.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = choice;
    button.addEventListener("click", () => checkAnswer(button, choice));
    elements.answers.append(button);
  });
}

function checkAnswer(button, choice) {
  if (questionSolved) return;
  if (choice === questions[currentQuestion].answer) {
    questionSolved = true;
    score += 1;
    button.classList.add("correct");
    button.setAttribute("aria-label", `${choice}, correct answer`);
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
  elements.results.querySelector("h2").focus?.();
}

function restartGame() {
  currentQuestion = 0;
  score = 0;
  elements.score.textContent = "0";
  elements.results.hidden = true;
  elements.quizView.hidden = false;
  renderQuestion();
}

elements.nextButton.addEventListener("click", nextQuestion);
elements.playAgain.addEventListener("click", restartGame);
renderQuestion();
