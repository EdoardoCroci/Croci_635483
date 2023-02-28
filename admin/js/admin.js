//funzione chiamata appena la pagina è "pronta"
document.addEventListener('DOMContentLoaded', function () {
  checkUserLogged(true); //index.js
});

function createUsersTable(users) {
  document.getElementById('generatedHTML').replaceChildren();

  let titolo = document.createElement('h3');
  titolo.classList.add('textCentered');
  titolo.innerText = 'Amministrazione utenti';
  let separatore = document.createElement('hr');

  document.getElementById('generatedHTML').appendChild(titolo);
  document.getElementById('generatedHTML').appendChild(separatore);

  if (users.length === 0) {
    let p = document.createElement('p');
    p.innerText = 'Nessun giocatore presente';
    p.classList.add('textCentered');
    document.getElementById('generatedHTML').appendChild(p);
    return;
  }

  //costruisco l'head della tabella
  let table = document.createElement('table');
  table.id = 'usersTable';
  let thead = document.createElement('thead');

  let thtr = document.createElement('tr');
  let th1 = document.createElement('th');
  th1.innerText = 'Nome giocatore';
  thtr.appendChild(th1);
  let th2 = document.createElement('th');
  th2.innerText = 'Disabilitato';
  thtr.appendChild(th2);
  let th3 = document.createElement('th');
  th3.innerText = 'Partite giocate';
  thtr.appendChild(th3);
  let th4 = document.createElement('th');
  th4.innerText = 'Data registrazione account';
  thtr.appendChild(th4);
  let th5 = document.createElement('th');
  th5.innerText = 'Data ultima partita giocata';
  thtr.appendChild(th5);
  let th6 = document.createElement('th');
  th6.innerText = 'Azioni';
  thtr.appendChild(th6);

  thead.appendChild(thtr);
  table.appendChild(thead);

  //costruisco il body della tabella
  let tbody = document.createElement('tbody');

  for (let i = 0; i < users.length; i++) {
    let actionsTd = document.createElement('td');

    let deleteUserDiv = document.createElement('div');
    deleteUserDiv.classList.add('tooltip');
    let deleteUserBtn = document.createElement('button');
    deleteUserBtn.classList.add('actionBtn');
    deleteUserBtn.addEventListener('click', function () {
      deleteUser(users[i].id);
    });
    deleteUserBtn.innerText = 'X';
    let deleteUserSpan = document.createElement('span');
    deleteUserSpan.classList.add('tooltipText');
    deleteUserSpan.innerText = 'Elimina utente';

    deleteUserDiv.appendChild(deleteUserBtn);
    deleteUserDiv.appendChild(deleteUserSpan);

    let banUserDiv = document.createElement('div');
    banUserDiv.classList.add('tooltip');
    let banUserBtn = document.createElement('button');

    banUserBtn.classList.add('actionBtn');
    let banUserImg = document.createElement('img');
    banUserImg.src = '../images/ban-solid.svg';
    banUserImg.alt = 'disabilita';
    let banUserSpan = document.createElement('span');
    banUserSpan.classList.add('tooltipText');
    banUserSpan.innerText = 'Disabilita utente';

    if (users[i].isBanned === 'no') {
      banUserBtn.addEventListener('click', function () {
        banUser(users[i].id, true);
      });

      banUserDiv.appendChild(banUserBtn);
      banUserBtn.appendChild(banUserImg);
      banUserDiv.appendChild(banUserSpan);
      actionsTd.appendChild(banUserDiv);
    } else {
      banUserBtn.addEventListener('click', function () {
        banUser(users[i].id, false);
      });

      banUserImg.src = '../images/circle-check-regular.svg';
      banUserImg.alt = 'abilita';
      banUserSpan.innerText = 'Abilita utente';

      banUserDiv.appendChild(banUserBtn);
      banUserBtn.appendChild(banUserImg);
      banUserDiv.appendChild(banUserSpan);
      actionsTd.appendChild(banUserDiv);
    }

    actionsTd.appendChild(deleteUserDiv);

    let tbtr = document.createElement('tr');
    let td1 = document.createElement('td');
    td1.innerText = users[i].username;
    tbtr.appendChild(td1);
    let td2 = document.createElement('td');
    td2.innerText = users[i].isBanned;
    tbtr.appendChild(td2);
    let td3 = document.createElement('td');
    td3.innerText = users[i].totGames;
    tbtr.appendChild(td3);
    let td4 = document.createElement('td');
    td4.innerText = users[i].registrationDate;
    tbtr.appendChild(td4);
    let td5 = document.createElement('td');
    td5.innerText = users[i].lastMatchDate;
    tbtr.appendChild(td5);
    tbtr.appendChild(actionsTd);

    tbody.appendChild(tbtr);
  }

  table.appendChild(tbody);
  document.getElementById('generatedHTML').appendChild(table);
}

function getUsersList() {
  fetch('../php/admin.php?action=getAllUsers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        createUsersTable([]);
      } else {
        createUsersTable(data.message);
      }
    });
}

function adminUserLogged() {
  displayPopupMessage(false, 'Login effettuato con successo!');
  setTimeout(function () {
    hidePopupMessage();
  }, 1500);
  document.getElementById('loginFormDiv').style.display = 'none';

  let elements = document.getElementsByClassName('needLogin');
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.visibility = 'visible';
  }

  getUsersList();
}

function goToGamePage() {
  logout();
  window.location.replace('/croci_635483');
}

// funzione per ban/unban dell'utente, prende in input id e valore booleano per ban/unban
function banUser(id, ban) {
  let data = JSON.stringify({
    action: ban ? 'banUser' : 'unbanUser',
    id: id,
  });

  fetch('../php/admin.php', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        displayPopupMessage(true, data.message);
      } else {
        displayPopupMessage(false, data.message);
        setTimeout(function () {
          hidePopupMessage();
        }, 1500);

        getUsersList();
      }
    });
}

// funzione che elimina un utente dato l'id
function deleteUser(id) {
  let data = JSON.stringify({
    action: 'deleteUser',
    id: id,
  });

  fetch('../php/admin.php', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        displayPopupMessage(true, data.message);
      } else {
        displayPopupMessage(false, data.message);
        setTimeout(function () {
          hidePopupMessage();
        }, 1500);

        getUsersList();
      }
    });
}
