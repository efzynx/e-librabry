document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const loginInput = document.getElementById('loginEmailUsername').value;
    const password = document.getElementById('loginPassword').value;

    // pointing to your domain here
    // const apiUrlDomain = 'your domain here' || 'http://localhost:3000/login'
    const apiUrlDomain = 'http://localhost:3000/login'
    // Menentukan apakah input adalah email atau username
    const isEmail = loginInput.includes('@'); // Cek apakah input berisi '@' untuk menganggapnya sebagai email
    const response = await fetch(`${apiUrlDomain}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ username, password })
        body: JSON.stringify({
            email: isEmail ? loginInput : '',
            username: isEmail ? '' : loginInput,
            password: password
        }),
    });

    const data = await response.json();
    if (response.ok) {
        // toast success login
        localStorage.setItem('token', data.token);
        const toastEl = document.getElementById('loginToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        // Setelah 2 detik, redirect ke halaman index.html
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        // toast failed login
        const toastEl = document.getElementById('loginToastFail');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        setTimeout(function () {
            window.location.href = '#';
        }, 2000);
    }
});
