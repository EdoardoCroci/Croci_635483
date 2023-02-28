//genera la griglia di gioco
function createGrid(nCharacters) {
  for (let i = 0; i < 6; i++) {
    let grid = document.createElement('div');
    grid.classList.add('gridRow');

    for (let j = 0; j < nCharacters; j++) {
      let input = document.createElement('input');
      input.type = 'text';
      input.id = 'carattere' + (i * nCharacters + j);
      input.maxLength = 1;
      input.classList.add('gridCell');
      input.readOnly = true;

      grid.appendChild(input);
    }

    document.getElementById('gridContainer').appendChild(grid);
  }
}

function setUpKeyBoard() {
  // aggiungo gli event listener ai bottoni - inizialmente disabilitati
  let buttons = document.getElementsByClassName('keyboardBtn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      let char = buttons[i].innerText;
      addChar(char);
    });
  }

  document.getElementById('deleteBtn').addEventListener('click', function () {
    removeChar();
  });

  document.getElementById('tryBtn').addEventListener('click', function () {
    if (checkTry()) makeTry();
  });
}
