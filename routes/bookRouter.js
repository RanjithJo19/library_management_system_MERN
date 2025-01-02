const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all books
router.get('/',authMiddleware, async (request, response) => {
        const decoded = request.user;
        if (decoded.userType =! 'Librarian') throw new Error('Access Denied!');
    try {
        const books = await Book.find({});
        response.status(200).json(books);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Get a book by name
router.get('/:name',authMiddleware, async (request, response) => {
    try {
        const book = await Book.findById(request.params.name);
        if (!book) {
            return response.status(404).json({ message: "Book not found" });
        }
        response.status(200).json(book);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Add a new book
router.post('/', authMiddleware, async (request, response) => {    
    try {

        const decoded = request.user;   
        if (decoded.userType === 'Student') {
            return response.status(403).json({ message: "You are not authorized to access this API" });
        }
        const book = new Book(request.body);
        await book.save();
        response.status(201).json(book);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Update a book by ID
router.put('/:id', authMiddleware, async (request, response) => {
    try {
        const user = await User.findById(request.user.userId);
        if (user.userType === 'Student') {
            return response.status(403).json({ message: "You are not authorized to access this API" });
        }
        const book = await Book.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!book) {
            return response.status(404).json({ message: "Book not found" });
        }
        response.status(200).json(book);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Delete a book by ID
router.delete('/:name', authMiddleware, async (request, response) => {

    const decoded = request.user;
    console.log(request.body);
    
    try {
        
        if (decoded.userType === 'Student') {
            return response.status(403).json({ message: "You are not authorized to access this API" });
        }
        if (book.quantity < 1) {
            return response.status(404).json({ message: "No stock in this Book" });
        }
        const book = await Book.findByIdAndDelete(request.params.name);
        if (!book) {
            return response.status(404).json({ message: "Book not found" });
        }
        response.status(200).json(book);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;
