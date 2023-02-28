//variabili
let inputId = -1;
let row = 1;
let numChar = 6;
let finished = false;

//aggiunge un carattere nell'ultima posizione disponibile per il tentativo
function addChar(char) {
  if (inputId !== numChar * row - 1) {
    if (inputId < numChar * row) {
      inputId++;
      document.getElementById('carattere' + inputId).value = char;
    }
  }
}

//rimuove l'ultimo carattere inserito
function removeChar() {
  if (inputId >= 0 && inputId <= numChar * row - 1 && inputId >= numChar * (row - 1)) {
    document.getElementById('carattere' + inputId).value = '';
    inputId--;
  }
}

//inizia una nuova partita
function startNewGame() {
  let characters = document.getElementById('nCharactersInput').value;
  if (characters < 5 || characters > 8) {
    displayPopupMessage('true', 'Valore inserito non valido');
    return false;
  }

  //rimuovo tutti i possibili colori di sfondo da tutte le lettere della tastiera e rimetto il colore nero
  removeKeyboardStyles();

  displayPopupMessage(false, 'Nuova partita iniziata!');
  setTimeout(function () {
    hidePopupMessage();
  }, 1500);

  inputId = -1;
  row = 1;
  numChar = +characters;

  document.getElementById('gridContainer').replaceChildren();
  createGrid(characters);

  //abilito i bottoni
  disableKeyboard(false);

  //chiamata al php per estrarre una parola
  fetch('./php/game.php?action=getWord&characters=' + characters, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        displayPopupMessage(true, data.message);
      }
    });

  document.getElementById('newGameBtn').blur();
}

//controlla che il tentativo abbia tutti i caratteri
function checkTry() {
  if (inputId < numChar * row - 1) {
    displayPopupMessage(true, 'Non hai inserito tutti i caratteri richiesti!');
    setTimeout(function () {
      hidePopupMessage();
    }, 2500);
    return false;
  }
  return true;
}

//aggiorna la griglia dopo il tentativo
function updateTry(data, word) {
  let k = row * numChar - numChar;
  for (let i = 0; i < numChar; i++) {
    //aggiorna la tastiera
    if (data[i] === 'Y') {
      document.getElementById('letter' + word[i]).classList.remove('wrongChar'); //rimuovo eventuali colori di sfondo
      document.getElementById('letter' + word[i]).classList.remove('wrongPlaceChar'); //uguale a sopra
      document.getElementById('letter' + word[i]).classList.add('correctChar'); //coloro lo sfondo della lettera sulla tastiera
      document.getElementById('letter' + word[i]).style.color = 'white'; //coloro la lettera di bianco per leggibilità
      document.getElementById('carattere' + k).classList.add('correctChar');
      document.getElementById('carattere' + k).style.color = 'white';
    } else if (data[i] === '#') {
      //coloro di giallo la lettera sulla tastiera se non era verde
      if (!document.getElementById('letter' + word[i]).classList.contains('correctChar'))
        document.getElementById('letter' + word[i]).classList.add('wrongPlaceChar');
      document.getElementById('letter' + word[i]).style.color = 'white'; //coloro la lettera di bianco per leggibilità
      document.getElementById('carattere' + k).classList.add('wrongPlaceChar');
      document.getElementById('carattere' + k).style.color = 'white';
    } else {
      //coloro di grigio la lettera sulla tastiera se non era ne verde ne gialla
      if (
        !(
          document.getElementById('letter' + word[i]).classList.contains('correctChar') ||
          document.getElementById('letter' + word[i]).classList.contains('wrongPlaceChar')
        )
      )
        document.getElementById('letter' + word[i]).classList.add('wrongChar');
      document.getElementById('letter' + word[i]).style.color = 'white'; //coloro la lettera di bianco per leggibilità
      document.getElementById('carattere' + k).classList.add('wrongChar');
      document.getElementById('carattere' + k).style.color = 'white';
    }
    k++;
  }
}

//invia il tentativo
function makeTry() {
  if (!checkTry()) return false;

  let word = '';
  for (let i = row * numChar - numChar; i <= inputId; i++) {
    word += document.getElementById('carattere' + i).value;
  }

  fetch('./php/game.php?action=makeTry&word=' + word, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        displayPopupMessage(true, data.message);
        setTimeout(function () {
          hidePopupMessage();
        }, 1500);
      } else {
        updateTry(data.message, word);
        if (data.message === 'Y'.repeat(numChar)) {
          displayPopupMessage(false, 'Complimenti, hai indovinato la parola al ' + row + ' tentativo!');
          disableKeyboard(true);
        } else if (row === 6) {
          displayPopupMessage(true, 'Hai perso! La parola da indovinare era: ' + data.message.substring(numChar + 1));
          disableKeyboard(true);
        } else row++;
      }
    });
}
