// Registered names supplied by Mrs. Reem. Keep each name stable to retain its results.
window.StudentRoster = (() => {
  const classes = {
  "CE2 A": [
    "Yusuf R.",
    "Mathea",
    "Mattias",
    "Amir",
    "Jad",
    "Mia",
    "Lori Anna",
    "Zoe",
    "Youssef T.",
    "Sacha",
    "Lina",
    "Arion-Daniel",
    "Charbel",
    "Lana",
    "Sam",
    "Jade",
    "Luluah",
    "Karl",
    "Adam",
    "Ayden",
    "Kaylie",
    "Raphael"
  ],
  "CE2 D": [
    "Michael",
    "Nadya",
    "Hussein",
    "Charles",
    "Sofia",
    "Rihab",
    "Julia",
    "Malek",
    "Ibrahim",
    "Karine",
    "Rayan Z.",
    "Jacinta",
    "Baya",
    "Nadine",
    "Mila",
    "Leo",
    "Owen",
    "Sacha",
    "Edgar",
    "Rayan R.",
    "Rock",
    "Nour",
    "Ghassin",
    "Ahmed",
    "Moussa"
  ]
};
  function bind(form, nameField, sectionField) {
    const name = form.elements[nameField], section = form.elements[sectionField];
    const nameLabel = form.querySelector(`label[for="${name.id}"]`);
    const sectionLabel = form.querySelector(`label[for="${section.id}"]`);
    // Present the class first, followed by its registered names.
    form.insertBefore(sectionLabel, nameLabel);
    form.insertBefore(section, nameLabel);
    function refresh() {
      name.setCustomValidity('');
      const names = classes[section.value] || [];
      name.replaceChildren(new Option(names.length ? 'Choose your name' : 'Choose your class first', ''));
      for (const value of [...names].sort((a, b) => a.localeCompare(b, 'en'))) {
        name.add(new Option(value, value));
      }
    }
    section.addEventListener('change', refresh);
    name.addEventListener('change', () => name.setCustomValidity(''));
    form.addEventListener('reset', () => queueMicrotask(refresh));
    form.addEventListener('submit', event => {
      if (!(classes[section.value] || []).includes(name.value)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        name.setCustomValidity('Please choose your class and your registered name.');
        name.reportValidity();
      }
    }, true);
    refresh();
  }
  return { bind };
})();
