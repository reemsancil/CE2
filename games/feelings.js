const questions = [
  { sentence: "I feel _____ when it's really sunny outside.", choices: ["hot", "cold", "sad"], answer: "hot" },
  { sentence: "I feel _____ when I have a big test coming up.", choices: ["worried", "excited", "calm"], answer: "worried" },
  { sentence: "I feel _____ when it's snowing outside.", choices: ["cold", "hot", "happy"], answer: "cold" },
  { sentence: "I feel _____ when I'm playing with my favorite toy.", choices: ["happy", "scared", "worried"], answer: "happy" },
  { sentence: "I feel _____ after a long day at school.", choices: ["tired", "excited", "angry"], answer: "tired" },
  { sentence: "I feel _____ when I watch a scary movie.", choices: ["scared", "happy", "calm"], answer: "scared" },
  { sentence: "I feel _____ when someone takes my things without asking.", choices: ["angry", "sad", "cold"], answer: "angry" },
  { sentence: "I feel _____ when I know we're going on a field trip.", choices: ["excited", "tired", "happy"], answer: "excited" },
  { sentence: "I feel _____ when I take deep breaths and relax.", choices: ["calm", "worried", "angry"], answer: "calm" },
  { sentence: "I feel _____ when I miss my family.", choices: ["sad", "happy", "excited"], answer: "sad" },
  { sentence: "I feel _____ when I run outside on a very warm day.", choices: ["hot", "cold", "tired"], answer: "hot" },
  { sentence: "I feel _____ when I hear a strange noise at night.", choices: ["scared", "calm", "happy"], answer: "scared" },

  { section: "Choose the correct feeling", sentence: "It is really sunny outside.", choices: ["hot", "cold", "sad"], answer: "hot" },
  { section: "Choose the correct feeling", sentence: "I have a big test coming up.", choices: ["worried", "happy", "calm"], answer: "worried" },
  { section: "Choose the correct feeling", sentence: "I watch a scary movie.", choices: ["scared", "excited", "tired"], answer: "scared" },
  { section: "Choose the correct feeling", sentence: "We are going on a field trip.", choices: ["excited", "angry", "cold"], answer: "excited" },
  { section: "Choose the correct feeling", sentence: "I take deep breaths and relax.", choices: ["calm", "worried", "hot"], answer: "calm" },
  { section: "Choose the correct feeling", sentence: "I miss my family.", choices: ["sad", "happy", "excited"], answer: "sad" },
];

const positiveMessages = ["Great job!", "Correct!", "Excellent!", "Well done!"];
let currentQuestion = 0;
let score = 0;
let questionSolved = false;

const elements = {
  quizView: document.querySelector("#quiz-view"), results: document.querySelector("#results"),
  questionNumber: document.querySelector("#question-number"), sentence: document.querySelector("#sentence"),
  instruction: document.querySelector("#instruction"), answers: document.querySelector("#answers"),
  feedback: document.querySelector("#feedback"),
  score: document.querySelector("#score"), nextButton: document.querySelector("#next-button"),
  progressFill: document.querySelector("#progress-fill"), progressBar: document.querySelector("[role='progressbar']"),
  progressLabel: document.querySelector("#progress-label"), finalScore: document.querySelector("#final-score"),
  playAgain: document.querySelector("#play-again"),
};

function renderQuestion() {
  questionSolved = false;
  const question = questions[currentQuestion];
  elements.questionNumber.textContent = currentQuestion + 1;
  elements.instruction.textContent = question.section || "How do I feel?";
  elements.sentence.textContent = question.sentence;
  elements.feedback.textContent = "";
  elements.feedback.className = "feedback";
  elements.nextButton.classList.remove("visible");
  elements.progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  elements.progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
  elements.progressLabel.textContent = currentQuestion === 0 ? "Let’s begin!" : (question.section ? "Choose the best answer!" : "Keep going!");
  elements.answers.replaceChildren(...question.choices.map((choice) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.dataset.answer = choice;
    button.textContent = choice;
    return button;
  }));
}

function checkAnswer(button) {
  if (questionSolved) return;
  if (button.dataset.answer === questions[currentQuestion].answer) {
    questionSolved = true;
    score += 1;
    button.classList.add("correct");
    button.setAttribute("aria-label", `${button.textContent}, correct answer`);
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
