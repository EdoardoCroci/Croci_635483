let block = false; //variabile per mostrare nuovamente il popup se era visibile

function hideDivs() {
  document.getElementById('instructions').style.display = 'none';
  document.getElementById('generatedHTML').style.display = 'none';
  document.getElementById('newGameDiv').style.display = 'none';
}

//mostra o nasconde il manuale di gioco
function showHowToPlay() {
  if (
    document.getElementById('instructions').style.display === 'none' ||
    document.getElementById('instructions').style.display === ''
  ) {
    document.getElementById('latestGamesDiv').classList.add('d-none');
    document.getElementById('leaderboardDiv').classList.add('d-none');
    document.getElementById('generatedHTML').style.display = 'none';
    document.getElementById('newGameDiv').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
    //setto la variabile per mostrare nuovamente il popup, se è già true non devo cambiarla
    if (!block) document.getElementById('popupMessage').style.display === 'block' ? (block = true) : (block = false);
    hidePopupMessage();
  } else {
    document.getElementById('generatedHTML').style.display = 'block';
    document.getElementById('newGameDiv').style.display = 'block';
    document.getElementById('instructions').style.display = 'none';
    if (block) {
      document.getElementById('popupMessage').style.display = 'block';
      block = false;
    }
  }
}

//navigazione alla pagina admin
function goToAdminPage() {
  logout();
  window.location.replace('/croci_635483/admin');
}

//mostra messaggio popup
function displayPopupMessage(error, text) {
  if (error) {
    document.getElementById('popupMessage').innerText = text;
    document.getElementById('popupMessage').classList.remove('correctChar');
    document.getElementById('popupMessage').classList.add('bgError');
    document.getElementById('popupMessage').style.display = 'block';
  } else {
    document.getElementById('popupMessage').innerText = text;
    document.getElementById('popupMessage').classList.remove('bgError');
    document.getElementById('popupMessage').classList.add('correctChar');
    document.getElementById('popupMessage').style.display = 'block';
  }
}

//nasconde messaggio popup
function hidePopupMessage() {
  document.getElementById('popupMessage').style.display = 'none';
}

//crea e popola la tabella delle ultime partite giocate
function populateLatestGamesTable(games) {
  //rimuovo il contenuto del div
  document.getElementById('latestGamesDiv').replaceChildren();

  //creo un'intestazione
  let title = document.createElement('h3');
  title.innerText = 'Utile 10 partite giocate';
  title.classList.add('textCentered');

  let titleImg = document.createElement('img');
  titleImg.src = 'images/circle-xmark-regular.svg';
  titleImg.addEventListener('click', function () {
    showLatestGames();
  });
  titleImg.classList.add('iconMedium');
  titleImg.classList.add('closeBtn');
  titleImg.alt = 'chiudi';
  title.appendChild(titleImg);

  let hr = document.createElement('hr');

  document.getElementById('latestGamesDiv').appendChild(title);
  document.getElementById('latestGamesDiv').appendChild(hr);

  if (games.length === 0) {
    let p = document.createElement('p');
    p.innerText = 'Nessuna partita salvata';
    p.classList.add('textCentered');
    document.getElementById('latestGamesDiv').appendChild(p);
    return;
  }

  //costruisco l'head della tabella
  let table = document.createElement('table');
  table.id = 'latestGamesTable';
  let thead = document.createElement('thead');
  let thtr = document.createElement('tr');

  let th1 = document.createElement('th');
  th1.innerText = 'Parola da indovinare';
  thtr.appendChild(th1);
  let th2 = document.createElement('th');
  th2.innerText = 'Tentativo registrato';
  thtr.appendChild(th2);
  let th3 = document.createElement('th');
  th3.innerText = 'Punti ottenuti';
  thtr.appendChild(th3);
  let th4 = document.createElement('th');
  th4.innerText = 'Data';
  thtr.appendChild(th4);

  thead.appendChild(thtr);
  table.appendChild(thead);

  //costruisco il body della tabella
  let tbody = document.createElement('tbody');

  for (let i = 0; i < games.length; i++) {
    let tbtr = document.createElement('tr');

    let td1 = document.createElement('td');
    let correctWordp = document.createElement('p');
    correctWordp.classList.add('m-0');
    correctWordp.classList.add('textCentered');

    //scorro le lettere della parola corretta
    for (let j = 0; j < games[i].correctWord.length; j++) {
      let tmpBtn = document.createElement('button');
      tmpBtn.classList.add('latestGamesWordCell');
      tmpBtn.classList.add('correctChar');
      tmpBtn.innerText = games[i].correctWord[j];
      correctWordp.appendChild(tmpBtn);
    }
    td1.appendChild(correctWordp);
    tbtr.appendChild(td1);

    let td2 = document.createElement('td');
    let guessP = document.createElement('p');
    guessP.classList.add('m-0');
    guessP.classList.add('textCentered');

    //scorro le lettere del tentativo registrato
    for (let j = 0; j < games[i].guess.length; j++) {
      let c;
      if (games[i].compare[j] === 'Y') c = 'correctChar';
      else if (games[i].compare[j] === '#') c = 'wrongPlaceChar';
      else c = 'wrongChar';

      let tmpBtn = document.createElement('button');
      tmpBtn.classList.add('latestGamesWordCell');
      tmpBtn.classList.add(c);
      tmpBtn.innerText = games[i].guess[j];

      guessP.appendChild(tmpBtn);
    }

    td2.appendChild(guessP);
    tbtr.appendChild(td2);

    let td3 = document.createElement('td');
    td3.classList.add('textCentered');
    td3.innerText = games[i].points;
    tbtr.appendChild(td3);

    let td4 = document.createElement('td');
    td4.classList.add('textCentered');
    td4.innerText = games[i].date;
    tbtr.appendChild(td4);

    tbody.appendChild(tbtr);
  }

  table.appendChild(tbody);
  document.getElementById('latestGamesDiv').appendChild(table);
}

//mostra le ultime 10 partite giocate
function showLatestGames() {
  if (document.getElementById('latestGamesDiv').classList.contains('d-none')) {
    fetch('./php/game.php?action=getLatestGames', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayPopupMessage(true, data.message);
        } else {
          hideDivs();
          document.getElementById('leaderboardDiv').classList.add('d-none');
          //setto la variabile per mostrare nuovamente il popup, se è già true non devo cambiarla
          if (!block) document.getElementById('popupMessage').style.display === 'block' ? (block = true) : (block = false);
          hidePopupMessage();

          document.getElementById('latestGamesDiv').classList.remove('d-none');
          populateLatestGamesTable(data.message);
        }
      });
  } else {
    document.getElementById('newGameDiv').style.display = 'block';
    document.getElementById('generatedHTML').style.display = 'block';
    if (block) {
      document.getElementById('popupMessage').style.display = 'block';
      block = false;
    }

    document.getElementById('latestGamesDiv').classList.add('d-none');
  }
}

//crea e popola la classifica
function populateLeaderboard(data) {
  //rimuovo il contenuto del div
  document.getElementById('leaderboardDiv').replaceChildren();

  //creo un'intestazione
  let title = document.createElement('h3');
  let letters = ['C', 'L', 'A', 'S', 'S', 'I', 'F', 'I', 'C', 'A'];

  for (let i = 0; i < letters.length; i++) {
    let tmpBtn = document.createElement('button');
    tmpBtn.classList.add('leaderboardTitleBtn');
    tmpBtn.classList.add('correctChar');
    tmpBtn.innerText = letters[i];
    title.appendChild(tmpBtn);
  }

  let leaderboardImg = document.createElement('img');
  leaderboardImg.classList.add('iconMedium');
  leaderboardImg.classList.add('closeBtn');
  leaderboardImg.addEventListener('click', function () {
    showLeaderboard();
  });
  leaderboardImg.alt = 'chiudi';

  leaderboardImg.src = 'images/circle-xmark-regular.svg';
  title.appendChild(leaderboardImg);
  title.classList.add('textCentered');

  let subTitle = document.createElement('h4');
  subTitle.innerText = 'top 50 giocatori';
  subTitle.classList.add('textCentered');
  subTitle.classList.add('m-0');

  let hr = document.createElement('hr');

  document.getElementById('leaderboardDiv').appendChild(title);
  document.getElementById('leaderboardDiv').appendChild(subTitle);
  document.getElementById('leaderboardDiv').appendChild(hr);

  if (data.length === 0) {
    let p = document.createElement('p');
    p.innerText = 'Nessun giocatore presente in classifica';
    p.classList.add('textCentered');
    document.getElementById('leaderboardDiv').appendChild(p);
    return;
  }

  //costruisco l'head della tabella
  let table = document.createElement('table');
  table.id = 'leaderboardTable';
  let thead = document.createElement('thead');

  let thtr = document.createElement('tr');

  let th1 = document.createElement('th');
  thtr.appendChild(th1);
  let th2 = document.createElement('th');
  th2.innerText = 'Nome giocatore';
  thtr.appendChild(th2);
  let th3 = document.createElement('th');
  th3.innerText = 'Punteggio totale';
  thtr.appendChild(th3);
  let th4 = document.createElement('th');
  th4.innerText = 'Partite giocate';
  thtr.appendChild(th4);
  let th5 = document.createElement('th');
  th5.innerText = 'Data registrazione account';
  thtr.appendChild(th5);
  let th6 = document.createElement('th');
  th6.innerText = 'Data ultima partita giocata';
  thtr.appendChild(th6);

  thead.appendChild(thtr);
  table.appendChild(thead);

  //costruisco il body della tabella
  let tbody = document.createElement('tbody');

  for (let i = 0; i < data.length; i++) {
    let tbtr = document.createElement('tr');

    let td1 = document.createElement('td');
    td1.innerText = i + 1;
    tbtr.appendChild(td1);

    let td2 = document.createElement('td');
    td2.innerText = data[i].username;
    tbtr.appendChild(td2);

    let td3 = document.createElement('td');
    td3.innerText = data[i].totPoints;
    tbtr.appendChild(td3);

    let td4 = document.createElement('td');
    td4.innerText = data[i].totGames;
    tbtr.appendChild(td4);

    let td5 = document.createElement('td');
    td5.innerText = data[i].registrationDate;
    tbtr.appendChild(td5);

    let td6 = document.createElement('td');
    td6.innerText = data[i].lastMatchDate;
    tbtr.appendChild(td6);

    tbody.appendChild(tbtr);
  }

  table.appendChild(tbody);
  document.getElementById('leaderboardDiv').appendChild(table);
}

//mostra la classifica
function showLeaderboard() {
  if (document.getElementById('leaderboardDiv').classList.contains('d-none')) {
    fetch('./php/game.php?action=getLeaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          displayPopupMessage(true, data.message);
        } else {
          hideDivs();
          document.getElementById('latestGamesDiv').classList.add('d-none');
          //setto la variabile per mostrare nuovamente il popup, se è già true non devo cambiarla
          if (!block) document.getElementById('popupMessage').style.display === 'block' ? (block = true) : (block = false);
          hidePopupMessage();

          document.getElementById('leaderboardDiv').classList.remove('d-none');
          populateLeaderboard(data.message);
        }
      });
  } else {
    document.getElementById('newGameDiv').style.display = 'block';
    document.getElementById('generatedHTML').style.display = 'block';
    if (block) {
      document.getElementById('popupMessage').style.display = 'block';
      block = false;
    }

    document.getElementById('leaderboardDiv').classList.add('d-none');
  }
}

function removeKeyboardStyles() {
  //rimuovo tutti i possibili colori di sfondo da tutte le lettere della tastiera e rimetto il colore nero
  for (let i = 65; i <= 90; i++) {
    document.getElementById('letter' + String.fromCharCode(i)).classList.remove('correctChar');
    document.getElementById('letter' + String.fromCharCode(i)).classList.remove('wrongPlaceChar');
    document.getElementById('letter' + String.fromCharCode(i)).classList.remove('wrongChar');
    document.getElementById('letter' + String.fromCharCode(i)).style.color = '';
  }
}

//abilita/disabilita la tastiera
function disableKeyboard(disabled) {
  let buttons = document.getElementsByClassName('keyboardBtn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = disabled;
  }

  document.getElementById('deleteBtn').disabled = disabled;
  document.getElementById('tryBtn').disabled = disabled;

  enabled = !disabled;
}
