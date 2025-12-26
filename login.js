document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  // Collect user inputs
  let username = document.getElementById('username').value.trim();
  let password = document.getElementById('password').value.trim();

  // Retrieve users from local storage
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Validate credentials
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
      alert('Login successful!');
      window.location.href = 'index.html'; // Redirect to the main page
  } else {
      alert('Invalid username or password. Please try again.');
  }
});
