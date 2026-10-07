window.CompletionResult = (() => {
  const host = document.querySelector('#results');
  const form = document.createElement('form');
  form.className = 'completion-form';
  form.innerHTML = `
    <h3>Send your result to your teacher</h3>
    <p class="score-note">Your score counts questions you solved, including retries.</p>
    <label for="student-name">Student name</label>
    <input id="student-name" name="student_name" required maxlength="100" autocomplete="off">
    <label for="class-section">Class section</label>
    <select id="class-section" name="class_section" required>
      <option value="">Choose your section</option>
      <option>CE2 A</option><option>CE2 D</option>
    </select>
    <button class="primary-button" type="submit">Submit result</button>
    <p class="submission-status" role="status" aria-live="polite"></p>`;
  host.insertBefore(form, host.querySelector('.result-actions'));
  const status = form.querySelector('.submission-status');
  const controls = [...form.querySelectorAll('input, select, button')];
  let completion = null;
  let sending = false;
  let saved = false;
  let record = null;
  function reset() {
    completion = null;
    record = null;
    saved = false;
    form.reset();
    status.textContent = '';
    controls.forEach(control => { control.disabled = false; });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!completion || sending || saved) return;
    const name = form.elements.student_name.value.trim();
    if (!name) {
      form.elements.student_name.setCustomValidity('Please enter your name.');
      form.elements.student_name.reportValidity();
      return;
    }
    record ||= { ...completion, student_name: name, class_section: form.elements.class_section.value };
    // Keep the same payload and ID on retry, even if the network response was lost.
    const submitted = record;
    sending = true;
    controls.forEach(control => { control.disabled = true; });
    status.textContent = 'Sending… Please wait.';
    try {
      await ResultsAPI.submit(submitted);
      if (record === submitted) {
        saved = true;
        status.textContent = 'Your result has been sent to your teacher!';
      }
    } catch {
      if (record === submitted) {
        status.textContent = 'Your result could not be confirmed. Check your connection and press Submit result to retry.';
        // Freeze identity while retrying this same completion.
        form.querySelector('button').disabled = false;
      }
    } finally {
      sending = false;
    }
  });
  form.elements.student_name.addEventListener('input', () => form.elements.student_name.setCustomValidity(''));
  return {
    reset,
    show(game, exercise, score, total) {
      reset();
      completion = { id: crypto.randomUUID(), game, exercise, score, total };
    },
  };
})();
