require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri);

mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
  });
  
  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Atlas');
  });

// Define a schema and model for books
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    cover: String,
    harga: Number
});
const Book = mongoose.model('Book', bookSchema);

// User model
const UserSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: String,
});

const User = mongoose.model('User', UserSchema);

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

// Register route
app.post('/register', async (req, res) => {
    const { name, username, email, password, role } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
        role
    });

    await user.save();
    res.sendStatus(201);
});


// Login Route
app.post('/login', async (req, res) => {
    const { email, username, password } = req.body;

    console.log('Login attempt with:', { email, username, password });

    try {
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, 'your-jwt-secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

  

// Start server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
