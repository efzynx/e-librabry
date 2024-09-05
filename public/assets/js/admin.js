const token = localStorage.getItem('token');  // Ambil token dari localStorage
let userRole = ''; // Deklarasi awal role user

if (token) {
    try {
        // Ambil role dari token JWT
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userRole = decodedToken.role;  // Ambil role dari token
    } catch (error) {
        console.error('Failed to decode token:', error);
    }
}

// Sembunyikan tombol "Tambah Buku" jika bukan admin
$(document).ready(function() {
    if (userRole !== 'admin' && userRole !== 'Admin') {
        $('#tambahBukuBtn').hide();  // Sembunyikan tombol jika bukan admin
    }

    // Fungsi lain di dalam document ready...
});
