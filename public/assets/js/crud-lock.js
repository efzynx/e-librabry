$(document).ready(function() {
    fetchBooks();

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
                $('#alertModal').modal('show'); // Tampilkan modal alert setelah menambah
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
            harga: $('#editHarga').val()  // Referensi yang benar adalah #editHarga
        };
        const oldTitle = $('#editBookForm').data('old-title');
        
        $.ajax({
            url: `/api/books/${oldTitle}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedBook),
            success: function() {
                fetchBooks();
                $('#editModal').modal('hide');
                $('#alertModal').modal('show'); // Tampilkan modal alert setelah mengedit
            },
            error: function() {
                console.error('Gagal memperbarui buku');
            }
        });
    });

    $('#confirmDelete').on('click', function() {
        const title = $(this).data('title');
        
        $.ajax({
            url: `/api/books/${title}`,
            method: 'DELETE',
            success: function() {
                fetchBooks();
                $('#deleteConfirmModal').modal('hide');
                $('#alertModal').modal('show'); // Tampilkan modal alert setelah menghapus
            },
            error: function() {
                console.error('Gagal menghapus buku');
            }
        });
    });
});

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
                            <button class="btn btn-warning btn-sm edit-book" data-title="${book.title}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-book" data-title="${book.title}">Delete</button>
                        </td>
                    </tr>
                `);
            });

            $('.edit-book').on('click', function() {
                const title = $(this).data('title');
                const book = data.find(b => b.title === title);
                $('#editTitle').val(book.title);
                $('#editAuthor').val(book.author);
                $('#editCover').val(book.cover);
                $('#editHarga').val(book.harga);
                $('#editBookForm').data('old-title', title);
                $('#editModal').modal('show');
            });

            $('.delete-book').on('click', function() {
                const title = $(this).data('title');
                $('#confirmDelete').data('title', title);
                $('#deleteConfirmModal').modal('show');
            });
        },
        error: function() {
            console.error('Gagal mengambil buku');
        }
    });
}
