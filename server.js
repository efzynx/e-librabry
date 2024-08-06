const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = 'mongodb+srv://efzyn:ALTRp6Dzp5eDIumw@db0.0xjiilk.mongodb.net/?retryWrites=true&w=majority&appName=db0';
mongoose.connect(mongoUri);

// Define a schema and model for books
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    cover: String,
    harga: Number
});
const Book = mongoose.model('Book', bookSchema);

// Routing for HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/books.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'books.html'));
});
app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
app.get('/tambahBuku.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tambahBuku.html'));
});

// API routes
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error('Failed to fetch books:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Failed to add book:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        console.error('Failed to update book:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid book ID');
    }
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send('Book not found');
        }
        res.status(204).end();
    } catch (error) {
        console.error('Failed to delete book:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
