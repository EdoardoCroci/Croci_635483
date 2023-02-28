function setElementValid(id) {
  document.getElementById(id).classList.remove('invalid');
  document.getElementById(id).classList.add('valid');
}

function setElementInvalid(id) {
  document.getElementById(id).classList.remove('valid');
  document.getElementById(id).classList.add('invalid');
}

//effettua controlli sulla password
function checkPassword() {
  let pass = document.getElementById('passInputR').value;
  let boolean = true;

  //controllo sulla lunghezza
  if (pass.length >= 8 && pass.length <= 12) {
    setElementValid('lengthCondition');
  } else {
    setElementInvalid('lengthCondition');
    boolean = false;
  }

  //controllo sulla lettera minuscola
  if (/[a-z]/.test(pass)) {
    setElementValid('lowerCondition');
  } else {
    setElementInvalid('lowerCondition');
    boolean = false;
  }

  //controllo sulla lettera minuscola
  if (/[A-Z]/.test(pass)) {
    setElementValid('upperCondition');
  } else {
    setElementInvalid('upperCondition');
    boolean = false;
  }

  //controllo del numero
  if (/\d/.test(pass)) {
    setElementValid('numberCondition');
  } else {
    setElementInvalid('numberCondition');
    boolean = false;
  }

  //controllo della conferma
  if (document.getElementById('passInputR').value === document.getElementById('passConfInput').value) {
    setElementValid('matchCondition');
  } else {
    setElementInvalid('matchCondition');
    boolean = false;
  }

  return boolean;
}

//abilita il pulsante per registrarsi
function enableRegister() {
  document.getElementById('registerBtn').disabled = false;
  document.getElementById('registerBtn').classList.remove('wrongChar');
  document.getElementById('registerBtn').classList.add('correctChar');
}

//disabilita il pulsante per registrarsi
function disableRegister() {
  document.getElementById('registerBtn').disabled = true;
  document.getElementById('registerBtn').classList.remove('correctChar');
  document.getElementById('registerBtn').classList.add('wrongChar');
}

//keyup campo password form di registrazione
function passKeyUp() {
  if (checkPassword()) {
    enableRegister();
  } else {
    disableRegister();
  }
}

//keyup campo conferma password form di registrazione
function confKeyUp() {
  if (checkPassword()) {
    enableRegister();
  } else {
    disableRegister();
  }
}

//keyup per nascondere errore nome già preso
function usernameKeyUp() {
  document.getElementById('registerError').innerText = '';
}

/*Gestione form*/
//mostra il form di registrazione e nasconde il form di login
function showRegisterForm() {
  clearLoginFields();
  document.getElementById('loginFormDiv').style.display = 'none';
  document.getElementById('registerFormDiv').style.display = 'block';
}

//mostra il form di login e nasconde il form di registrazione
function showLoginForm() {
  clearRegisterFields();
  document.getElementById('registerFormDiv').style.display = 'none';
  document.getElementById('loginFormDiv').style.display = 'block';
}

//pulisce i campi del form di registrazione
function clearRegisterFields() {
  document.getElementById('registerForm').reset();
  document.getElementById('registerError').innerText = '';
  document.getElementById('numberCondition').classList.remove('valid', 'invalid');
  document.getElementById('lowerCondition').classList.remove('valid', 'invalid');
  document.getElementById('upperCondition').classList.remove('valid', 'invalid');
  document.getElementById('lengthCondition').classList.remove('valid', 'invalid');
  document.getElementById('matchCondition').classList.remove('valid', 'invalid');
}

//pulisce i campi del form di login
function clearLoginFields() {
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').innerText = '';
}

//controlla che siano stati inseriti tutti i campi nel form di login
function checkLoginFields() {
  if (document.getElementById('nameInputL').value !== undefined && document.getElementById('nameInputL').value !== '')
    if (document.getElementById('passInputL').value !== undefined && document.getElementById('passInputL').value !== '')
      return true;

  return false;
}
