document.getElementById('forgot-password-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    let email = document.getElementById('email').value;
  
    // Simulating password reset process
    alert('Password reset instructions sent to ' + email);
    window.location.href = 'login.html'; // Redirect to login page
  });
  