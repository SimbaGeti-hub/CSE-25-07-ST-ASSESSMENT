const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', () => {
  let hasError = false;

  if (!loginEmail.value.trim()) {
    loginEmail.classList.add('error');
    hasError = true;
  } else {
    loginEmail.classList.remove('error');
  }

  if (!loginPassword.value.trim()) {
    loginPassword.classList.add('error');
    hasError = true;
  } else {
    loginPassword.classList.remove('error');
  }

  if (!hasError) {
    window.location.href = 'success.html';
  }
});

loginEmail.addEventListener('input', () => {
  loginEmail.classList.remove('error');
});

loginPassword.addEventListener('input', () => {
  loginPassword.classList.remove('error');
});