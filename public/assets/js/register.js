document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('dataListRoleRegister').value;
    
    // pointing to your domain here
    // const apiUrlDomain = 'your domain here' || 'http://localhost:3000/register'
    const apiUrlDomain = 'http://localhost:3000/register'

    const response = await fetch(`${apiUrlDomain}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, email, password, role })
    });

    if (response.ok) {
        // alert('Registration successful!');
        const toastEl = document.getElementById('registerToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        // alert('Registration failed!');
        const toastEl = document.getElementById('registerToastFail');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        setTimeout(function () {
            window.location.href = '#';
        }, 2000);
    }
});
