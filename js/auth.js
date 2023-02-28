//controlla che l'utente sia loggato
function checkUserLogged(isadmin) {
  fetch(isadmin ? '../php/auth.php?action=checkUserLogged&admin=1' : './php/auth.php?action=checkUserLogged&admin=0', {
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
        if (data.message === 'logged') {
          if (isadmin) {
            adminUserLogged();
          } else {
            playerUserLogged();
          }
        }
      }
    });
}

//effettua il login
function submitLogin(isadmin) {
  if (!checkLoginFields()) {
    document.getElementById('loginError').innerText = 'Compilare tutti i campi per proseguire.';
    document.getElementById('loginError').style.visibility = 'visible';
    return false;
  }

  document.getElementById('loginError').style.visibility = 'hidden';

  let data = JSON.stringify({
    action: 'login',
    username: document.getElementById('nameInputL').value,
    password: document.getElementById('passInputL').value,
    rememberMe: document.getElementById('rememberMe').checked ? 1 : 0,
    admin: isadmin ? 1 : 0,
  });

  fetch(isadmin ? '../php/auth.php' : './php/auth.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.getElementById('loginError').innerText = data.message;
        document.getElementById('loginError').style.visibility = 'visible';
        setTimeout(function () {
          document.getElementById('loginError').style.visibility = 'hidden';
        }, 3000);
      } else {
        if (isadmin) {
          adminUserLogged();
        } else {
          playerUserLogged();
        }
      }
    });
}

//permette la registrazione di un nuovo utente
function submitRegister() {
  let data = JSON.stringify({
    action: 'register',
    username: document.getElementById('nameInputR').value,
    password: document.getElementById('passInputR').value,
  });

  fetch('./php/auth.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.getElementById('registerError').innerText = data.message;
      } else {
        clearRegisterFields();
        showLoginForm();
        displayPopupMessage(false, 'Registrazione effettuata con successo!');
        setTimeout(function () {
          hidePopupMessage();
        }, 1500);
      }
    });
}

//effettua il logout
function logout(isadmin) {
  fetch(isadmin ? '../php/auth.php?action=logout' : './php/auth.php?action=logout', {
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
        displayPopupMessage(false, 'Logout effettuato con successo!');
        setTimeout(function () {
          hidePopupMessage();
        }, 1500);

        document.getElementById('loginFormDiv').style.display = 'block';

        let elements = document.getElementsByClassName('needLogin');
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.visibility = 'hidden';
        }
      }
    });
}
