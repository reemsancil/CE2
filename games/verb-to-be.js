const exercises = {
  "affirmative": [
    {
      "sentence": "I _____ eight years old.",
      "answer": "am",
      "choices": [
        "am",
        "is",
        "are"
      ]
    },
    {
      "sentence": "You _____ my friend.",
      "answer": "are",
      "choices": [
        "am",
        "is",
        "are"
      ]
    },
    {
      "sentence": "He _____ happy.",
      "answer": "is",
      "choices": [
        "am",
        "is",
        "are"
      ]
    },
    {
      "sentence": "She _____ at school.",
      "answer": "is",
      "choices": [
        "is",
        "am",
        "are"
      ]
    },
    {
      "sentence": "It _____ a cat.",
      "answer": "is",
      "choices": [
        "are",
        "am",
        "is"
      ]
    },
    {
      "sentence": "We _____ in Grade 3.",
      "answer": "are",
      "choices": [
        "am",
        "are",
        "is"
      ]
    },
    {
      "sentence": "They _____ ready to play.",
      "answer": "are",
      "choices": [
        "are",
        "am",
        "is"
      ]
    }
  ],
  "negative": [
    {
      "sentence": "I _____ tired. (negative)",
      "answer": "am not",
      "choices": [
        "am not",
        "is not",
        "are not"
      ]
    },
    {
      "sentence": "You _____ late. (negative)",
      "answer": "are not",
      "choices": [
        "am not",
        "is not",
        "are not"
      ]
    },
    {
      "sentence": "He _____ cold. (negative)",
      "answer": "is not",
      "choices": [
        "am not",
        "is not",
        "are not"
      ]
    },
    {
      "sentence": "She _____ angry. (negative)",
      "answer": "is not",
      "choices": [
        "is not",
        "am not",
        "are not"
      ]
    },
    {
      "sentence": "It _____ a dog. (negative)",
      "answer": "is not",
      "choices": [
        "are not",
        "am not",
        "is not"
      ]
    },
    {
      "sentence": "We _____ sad. (negative)",
      "answer": "are not",
      "choices": [
        "am not",
        "are not",
        "is not"
      ]
    },
    {
      "sentence": "They _____ at home. (negative)",
      "answer": "are not",
      "choices": [
        "are not",
        "am not",
        "is not"
      ]
    }
  ],
  "interrogative": [
    {
      "sentence": "_____ I in your team?",
      "answer": "Am",
      "choices": [
        "Am",
        "Is",
        "Are"
      ]
    },
    {
      "sentence": "_____ you ready?",
      "answer": "Are",
      "choices": [
        "Am",
        "Is",
        "Are"
      ]
    },
    {
      "sentence": "_____ he your brother?",
      "answer": "Is",
      "choices": [
        "Am",
        "Is",
        "Are"
      ]
    },
    {
      "sentence": "_____ she happy?",
      "answer": "Is",
      "choices": [
        "Is",
        "Am",
        "Are"
      ]
    },
    {
      "sentence": "_____ it your pencil?",
      "answer": "Is",
      "choices": [
        "Are",
        "Am",
        "Is"
      ]
    },
    {
      "sentence": "_____ we late?",
      "answer": "Are",
      "choices": [
        "Am",
        "Are",
        "Is"
      ]
    },
    {
      "sentence": "_____ they at school?",
      "answer": "Are",
      "choices": [
        "Are",
        "Am",
        "Is"
      ]
    }
  ]
};
exercises.mixed = [
  { instruction: "Choose the correct sentence.", sentence: "Talk about yourself.", choices: ["I is eight years old.", "I am eight years old.", "I are eight years old."], answer: "I am eight years old." },
  { instruction: "Put the words in order.", sentence: "Build an affirmative sentence.", words: ["happy.", "is", "He"], answer: "He is happy." },
  { instruction: "Choose the correct sentence.", sentence: "Say that we are NOT sad.", choices: ["We are sad.", "We is not sad.", "We are not sad."], answer: "We are not sad." },
  { instruction: "Put the words in order.", sentence: "Build a negative sentence.", words: ["tired.", "not", "I", "am"], answer: "I am not tired." },
  { instruction: "Sort this sentence into a category.", sentence: "Are they at school?", choices: ["Affirmative", "Negative", "Question"], answer: "Question" },
  { instruction: "Put the words in order.", sentence: "Build a question.", words: ["ready?", "you", "Are"], answer: "Are you ready?" },
];
const guides = {
  affirmative: "I am · You / We / They are · He / She / It is",
  negative: "I am not · You / We / They are not · He / She / It is not",
  interrogative: "Put Am, Is or Are first: Are you happy?"
};
let currentExercise = "affirmative";
let questions = exercises[currentExercise];
const positiveMessages = ["Great job!", "Correct!", "Excellent!", "Well done!"];
let currentQuestion = 0;
let score = 0;
let questionSolved = false;

const elements = {
  quizView: document.querySelector("#quiz-view"), results: document.querySelector("#results"),
  questionNumber: document.querySelector("#question-number"), sentence: document.querySelector("#sentence"),
  instruction: document.querySelector("#instruction"), guide: document.querySelector("#grammar-guide"), answers: document.querySelector("#answers"),
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
  elements.instruction.textContent = currentExercise === "interrogative" ? "Complete the question." : (currentExercise === "negative" ? "Complete the negative sentence." : "Complete the affirmative sentence.");
  if (question.instruction) elements.instruction.textContent = question.instruction;
  elements.guide.textContent = guides[currentExercise] || "Read, choose, sort and build sentences with am, is and are.";
  document.querySelectorAll(".question-total").forEach(el => { el.textContent = questions.length; });
  elements.progressBar.setAttribute("aria-valuemax", questions.length);
  elements.sentence.textContent = question.sentence;
  elements.feedback.textContent = "";
  elements.feedback.className = "feedback";
  elements.nextButton.classList.remove("visible");
  elements.progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  elements.progressBar.setAttribute("aria-valuenow", currentQuestion + 1);
  elements.progressLabel.textContent = currentQuestion === 0 ? "Let’s begin!" : (question.section ? "Choose the best answer!" : "Keep going!");
  if (question.words) { renderWordOrder(question, elements.answers); return; }
  elements.answers.classList.remove("word-order");
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
function selectExercise(name) {
  currentExercise = name;
  questions = exercises[name];
  document.querySelectorAll("[data-exercise]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.exercise === name));
  });
  restartGame();
}
document.querySelectorAll("[data-exercise]").forEach(button => {
  button.addEventListener("click", () => selectExercise(button.dataset.exercise));
});
renderQuestion();
