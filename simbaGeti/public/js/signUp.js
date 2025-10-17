const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signupBtn = document.getElementById('signupBtn');
const signupSuccess = document.getElementById('signupSuccess');
const closeSuccess = document.getElementById('closeSuccess');

signupBtn.addEventListener('click', () => {
  let hasError = false;

  if (!fullName.value.trim()) {
    fullName.classList.add('error');
    hasError = true;
  } else {
    fullName.classList.remove('error');
  }

  if (!email.value.trim()) {
    email.classList.add('error');
    hasError = true;
  } else {
    email.classList.remove('error');
  }

  if (!phone.value.trim()) {
    phone.classList.add('error');
    hasError = true;
  } else {
    phone.classList.remove('error');
  }

  if (!password.value.trim()) {
    password.classList.add('error');
    hasError = true;
  } else {
    password.classList.remove('error');
  }

  if (!confirmPassword.value.trim()) {
    confirmPassword.classList.add('error');
    hasError = true;
  } else {
    confirmPassword.classList.remove('error');
  }

  if (!hasError) {
    signupSuccess.classList.remove('hidden');
    fullName.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
    confirmPassword.value = '';
  }
});

closeSuccess.addEventListener('click', () => {
  signupSuccess.classList.add('hidden');
});

[fullName, email, phone, password, confirmPassword].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
  });
});