document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = 'login.html';
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error registering:', error);
    }
});