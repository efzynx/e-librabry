$(document).ready(function() {
    $.ajax({
        url: '/api/books',
        method: 'GET',
        success: function(data) {
            data.forEach(book => {
                $('#book-list').append(`
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div class="card h-100">
                            <img src="${book.cover}" class="card-img-top" alt="${book.title}">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">${book.author}<br>${book.harga}</p>
                            </div>
                        </div>
                    </div>
                `);
            });
        },
        error: function() {
            console.error('Gagal mengambil buku');
        }
    });
});
