const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path untuk data buku
const booksDataPath = path.join(__dirname, 'data', 'books.json');

// Fungsi untuk membaca data buku
const readBooksData = () => {
    if (!fs.existsSync(booksDataPath)) {
        fs.writeFileSync(booksDataPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(booksDataPath, 'utf8'));
};

// Fungsi untuk menulis data buku
const writeBooksData = (data) => {
    fs.writeFileSync(booksDataPath, JSON.stringify(data, null, 2));
};

// Routing untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routing untuk halaman buku
app.get('/books.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'books.html'));
});

// Routing untuk halaman kontak
app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Routing untuk halaman tambah buku
app.get('/tambahBuku.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tambahBuku.html'));
});

// API untuk mendapatkan semua buku
app.get('/api/books', (req, res) => {
    try {
        const books = readBooksData();
        res.json(books);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// API untuk menambah buku
app.post('/api/books', (req, res) => {
    try {
        const books = readBooksData();
        books.push(req.body);
        writeBooksData(books);
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// API untuk mengupdate buku
app.put('/api/books/:title', (req, res) => {
    try {
        let books = readBooksData();
        books = books.map(book => book.title === req.params.title ? req.body : book);
        writeBooksData(books);
        res.json(req.body);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// API untuk menghapus buku
app.delete('/api/books/:title', (req, res) => {
    try {
        let books = readBooksData();
        books = books.filter(book => book.title !== req.params.title);
        writeBooksData(books);
        res.status(204).end();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
