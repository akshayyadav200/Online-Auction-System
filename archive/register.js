document.getElementById('register-form').addEventListener('submit', function (event) {
  event.preventDefault();

  // Collect user inputs
  let username = document.getElementById('username').value.trim();
  let email = document.getElementById('email').value.trim();
  let password = document.getElementById('password').value.trim();
  let confirmPassword = document.getElementById('confirm-password').value.trim();
  let country = document.getElementById('country').value.trim();

  // Password confirmation check
  if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
  }

  // Retrieve existing users from local storage or initialize an empty array
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Check for duplicate usernames
  if (users.some(user => user.username === username)) {
      alert('Username already exists! Please choose a different username.');
      return;
  }

  // Save new user data
  let newUser = {
      username: username,
      email: email,
      password: password, // In production, hash the password before saving
      country: country,
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful! You can now log in.');
  window.location.href = 'login.html'; // Redirect to login page
});
