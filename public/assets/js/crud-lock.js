$(document).ready(function() {
    // Fungsi untuk mengambil buku dari server
    function fetchBooks() {
        $.ajax({
            url: '/api/books',
            method: 'GET',
            success: function(data) {
                $('#bookTableBody').empty();
                data.forEach(book => {
                    $('#bookTableBody').append(`
                        <tr>
                            <td><img src="${book.cover}" class="table-img" alt="${book.title}"></td>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.harga}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-book" data-id="${book._id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-book" data-id="${book._id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });

                // Menangani klik pada tombol Edit
                $('.edit-book').on('click', function() {
                    const bookId = $(this).data('id');
                    const book = data.find(b => b._id === bookId);
                    $('#editTitle').val(book.title);
                    $('#editAuthor').val(book.author);
                    $('#editCover').val(book.cover);
                    $('#editHarga').val(book.harga);
                    $('#editBookForm').data('id', bookId); // Simpan ID untuk update
                    $('#editModal').modal('show');
                });

                // Menangani klik pada tombol Delete
                $('.delete-book').on('click', function() {
                    const bookId = $(this).data('id');
                    $('#confirmDelete').data('id', bookId);
                    $('#deleteConfirmModal').modal('show');
                });
            },
            error: function() {
                console.error('Gagal mengambil buku');
            }
        });
    }

    fetchBooks();
    setInterval(fetchBooks, 5000); // Fetch books every 5 seconds

    $('#addBookForm').on('submit', function(e) {
        e.preventDefault();
        const newBook = {
            title: $('#title').val(),
            author: $('#author').val(),
            cover: $('#cover').val(),
            harga: $('#harga').val()
        };

        $.ajax({
            url: '/api/books',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newBook),
            success: function() {
                fetchBooks();
                $('#addBookForm')[0].reset();
                $('#alertModal').modal('show'); // Tampilkan modal alert setelah menambah buku
            },
            error: function() {
                console.error('Gagal menambah buku');
            }
        });
    });

    $('#editBookForm').on('submit', function(e) {
        e.preventDefault();
        const updatedBook = {
            title: $('#editTitle').val(),
            author: $('#editAuthor').val(),
            cover: $('#editCover').val(),
            harga: $('#editHarga').val()
        };
        const bookId = $('#editBookForm').data('id');
        
        $.ajax({
            url: `/api/books/${bookId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedBook),
            success: function() {
                fetchBooks();
                $('#editModal').modal('hide');
                $('#alertModal').modal('show'); // Tampilkan modal alert setelah mengedit buku
            },
            error: function() {
                console.error('Gagal mengedit buku');
            }
        });
    });

    $('#confirmDelete').on('click', function() {
        const bookId = $(this).data('id');
        
        $.ajax({
            url: `/api/books/${bookId}`,
            method: 'DELETE',
            success: function() {
                fetchBooks();
                $('#deleteConfirmModal').modal('hide');
                $('#alertModal').modal('show'); // Tampilkan modal alert setelah menghapus buku
            },
            error: function() {
                console.error('Gagal menghapus buku');
            }
        });
    });
});
