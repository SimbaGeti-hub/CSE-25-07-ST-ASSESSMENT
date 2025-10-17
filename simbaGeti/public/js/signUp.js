// const fullName = document.getElementById('fullName');
// const email = document.getElementById('email');
// const phone = document.getElementById('phone');
// const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirmPassword');
// const signupBtn = document.getElementById('signupBtn');
// const signupSuccess = document.getElementById('signupSuccess');
// const closeSuccess = document.getElementById('closeSuccess');

// signupBtn.addEventListener('click', () => {
//   let hasError = false;

//   if (!fullName.value.trim()) {
//     fullName.classList.add('error');
//     hasError = true;
//   } else {
//     fullName.classList.remove('error');
//   }

//   if (!email.value.trim()) {
//     email.classList.add('error');
//     hasError = true;
//   } else {
//     email.classList.remove('error');
//   }

//   if (!phone.value.trim()) {
//     phone.classList.add('error');
//     hasError = true;
//   } else {
//     phone.classList.remove('error');
//   }

//   if (!password.value.trim()) {
//     password.classList.add('error');
//     hasError = true;
//   } else {
//     password.classList.remove('error');
//   }

//   if (!confirmPassword.value.trim()) {
//     confirmPassword.classList.add('error');
//     hasError = true;
//   } else {
//     confirmPassword.classList.remove('error');
//   }

//   if (!hasError) {
//     signupSuccess.classList.remove('hidden');
//     fullName.value = '';
//     email.value = '';
//     phone.value = '';
//     password.value = '';
//     confirmPassword.value = '';
//   }
// });

// closeSuccess.addEventListener('click', () => {
//   signupSuccess.classList.add('hidden');
// });

// [fullName, email, phone, password, confirmPassword].forEach(input => {
//   input.addEventListener('input', () => {
//     input.classList.remove('error');
//   });
// });


const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signupBtn = document.getElementById('signupBtn');
const signupSuccess = document.getElementById('signupSuccess');
const closeSuccess = document.getElementById('closeSuccess');

signupBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  let hasError = false;

  // Clear previous errors
  [fullName, email, phone, password, confirmPassword].forEach(input => {
    input.classList.remove('error');
  });

  // Validate fields
  if (!fullName.value.trim()) {
    fullName.classList.add('error');
    hasError = true;
  }

  if (!email.value.trim()) {
    email.classList.add('error');
    hasError = true;
  }

  if (!phone.value.trim()) {
    phone.classList.add('error');
    hasError = true;
  }

  if (!password.value.trim()) {
    password.classList.add('error');
    hasError = true;
  }

  if (!confirmPassword.value.trim()) {
    confirmPassword.classList.add('error');
    hasError = true;
  }

  if (password.value !== confirmPassword.value) {
    password.classList.add('error');
    confirmPassword.classList.add('error');
    hasError = true;
  }

  if (hasError) return;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value,
        confirmPassword: confirmPassword.value
      })
    });

    const data = await response.json();

    if (data.success) {
      signupSuccess.classList.remove('hidden');
      fullName.value = '';
      email.value = '';
      phone.value = '';
      password.value = '';
      confirmPassword.value = '';
    } else {
      alert(data.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
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