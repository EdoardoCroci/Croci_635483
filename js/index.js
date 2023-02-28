//variabile che viene messa a true quando la partita è in corso
let enabled = false;

//creazione dinamica della pagina e append degli eventi
document.addEventListener('DOMContentLoaded', function () {
  setUpKeyBoard();
  checkUserLogged();

  //click di un tasto dalla tastiera fisica
  document.addEventListener('keydown', (event) => {
    let name = event.key;
    if (enabled) {
      if (name >= 'a' && name <= 'z') {
        addChar(name.toUpperCase());
      } else if (name === 'Enter') {
        makeTry();
      } else if (name === 'Backspace') {
        removeChar();
      }
    } else return;
  });
});

//mostra gli elementi dopo il login e ricrea la griglia di gioco
function playerUserLogged() {
  document.getElementById('gridContainer').replaceChildren();
  createGrid(5);

  removeKeyboardStyles();

  //disabilito i bottoni
  disableKeyboard(true);

  displayPopupMessage(false, 'Login effettuato con successo!');
  setTimeout(function () {
    displayPopupMessage(false, 'Inserisci un numero di caratteri e clicca su "Nuova partita" per iniziare a giocare');
  }, 1500);
  document.getElementById('loginFormDiv').style.display = 'none';

  let elements = document.getElementsByClassName('needLogin');
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.visibility = 'visible';
  }
}
