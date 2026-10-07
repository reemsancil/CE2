// Uses the game's existing answer handler and retry-friendly scoring.
function renderWordOrder(question, container) {
  container.replaceChildren();
  container.classList.add("word-order");
  const built = document.createElement("p");
  built.className = "built-sentence";
  built.setAttribute("aria-live", "polite");
  const bank = document.createElement("div");
  bank.className = "word-bank";
  const selected = [];
  const check = document.createElement("button");
  check.type = "button";
  check.className = "answer-button";
  check.textContent = "Check sentence";
  check.dataset.answer = "";
  check.disabled = true;
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "secondary-button";
  clear.textContent = "Start sentence again";
  question.words.forEach(word => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button";
    button.textContent = word;
    button.addEventListener("click", () => {
      selected.push(word);
      button.disabled = true;
      built.textContent = selected.join(" ");
      check.dataset.answer = built.textContent;
      check.disabled = selected.length !== question.words.length;
    });
    bank.append(button);
  });
  clear.addEventListener("click", () => {
    selected.length = 0;
    built.textContent = "Choose the words below.";
    check.dataset.answer = "";
    check.disabled = true;
    check.classList.remove("wrong");
    check.removeAttribute("aria-label");
    bank.querySelectorAll("button").forEach(button => { button.disabled = false; });
    bank.querySelector("button").focus();
  });
  built.textContent = "Choose the words below.";
  container.append(built, bank, check, clear);
}
