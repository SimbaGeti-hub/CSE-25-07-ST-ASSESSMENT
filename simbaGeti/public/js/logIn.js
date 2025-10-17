// const loginEmail = document.getElementById('loginEmail');
// const loginPassword = document.getElementById('loginPassword');
// const loginBtn = document.getElementById('loginBtn');

// loginBtn.addEventListener('click', () => {
//   let hasError = false;

//   if (!loginEmail.value.trim()) {
//     loginEmail.classList.add('error');
//     hasError = true;
//   } else {
//     loginEmail.classList.remove('error');
//   }

//   if (!loginPassword.value.trim()) {
//     loginPassword.classList.add('error');
//     hasError = true;
//   } else {
//     loginPassword.classList.remove('error');
//   }

//   if (!hasError) {
//     window.location.href = 'success.html';
//   }
// });

// loginEmail.addEventListener('input', () => {
//   loginEmail.classList.remove('error');
// });

// loginPassword.addEventListener('input', () => {
//   loginPassword.classList.remove('error');
// });


const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  let hasError = false;

  // Clear previous errors
  loginEmail.classList.remove('error');
  loginPassword.classList.remove('error');

  if (!loginEmail.value.trim()) {
    loginEmail.classList.add('error');
    hasError = true;
  }

  if (!loginPassword.value.trim()) {
    loginPassword.classList.add('error');
    hasError = true;
  }

  if (hasError) return;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value
      })
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = data.redirect || '/landing';
    } else {
      alert(data.message || 'Login failed. Please check your credentials.');
      loginEmail.classList.add('error');
      loginPassword.classList.add('error');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});

loginEmail.addEventListener('input', () => {
  loginEmail.classList.remove('error');
});

loginPassword.addEventListener('input', () => {
  loginPassword.classList.remove('error');
});
