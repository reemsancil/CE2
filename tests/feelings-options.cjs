const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(fs.readFileSync('games/feelings.html', 'utf8'), { runScripts: 'outside-only' });
const w = dom.window, d = w.document;
let completed;
w.CompletionResult = { reset() {}, show(...result) { completed = result; } };
w.eval(fs.readFileSync('games/word-order.js', 'utf8'));
w.eval(fs.readFileSync('games/feelings.js', 'utf8') + '\nwindow.testQuestions = {sentenceQuestions, pictureQuestions};');
for (const mode of ['sentence', 'picture']) {
  const questions = w.testQuestions[mode + 'Questions'];
  const original = JSON.stringify(questions);
  for (let run = 0; run < 4; run++) {
    d.querySelector('#' + mode + '-mode').click();
    const positions = [0, 0, 0];
    for (const q of questions) {
      const buttons = [...d.querySelectorAll('#answers button')];
      assert.equal(buttons.length, 3);
      assert.deepEqual(buttons.map(b => b.dataset.answer).sort(), [...q.choices].sort());
      const correct = buttons.findIndex(b => b.dataset.answer === q.answer);
      positions[correct]++;
      buttons.find(b => b.dataset.answer !== q.answer).click();
      assert.match(d.querySelector('#feedback').textContent, /Try again/);
      assert.deepEqual([...d.querySelectorAll('#answers button')], buttons);
      buttons[correct].click();
      assert(buttons.every(b => b.disabled));
      d.querySelector('#next-button').click();
    }
    assert(Math.max(...positions) - Math.min(...positions) <= 1);
    assert(positions.every(count => count > 0));
    assert.equal(completed[2], questions.length);
    assert.equal(JSON.stringify(questions), original);
  }
}
d.querySelector('#order-mode').click();
assert(d.querySelector('#answers').classList.contains('word-order'));
dom.window.close();
console.log('Passed Feelings: balanced answer positions across sentences/pictures, retries, scoring, replays, original choices and word-order mode.');
