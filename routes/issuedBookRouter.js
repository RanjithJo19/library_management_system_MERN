const express = require('express');
const IssuedBook = require('../models/IssuedBook');
const UserBookRequest = require('../models/requestBook');
const Book = require('../models/Book');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all issued books
router.get('/', async (request, response) => {
    try {
        const issuedBooks = await IssuedBook.find({});
        response.status(200).json(issuedBooks);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Get a specific issued book by ID
router.get('/:id', async (request, response) => {
    try {
        const issuedBook = await IssuedBook.findById(request.body.id);
        if (!issuedBook) {
            return response.status(404).json({ message: "Issued book record not found" });
        }
        response.status(200).json(issuedBook);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Get issued books by student name
router.get('/studentName', async (request, response) => {
    try {
        const issuedBooks = await IssuedBook.find({ name: request.body.name });
        response.status(200).json(issuedBooks);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// book Request
router.post('/bookRequest', authMiddleware, async (request, response) => {  
        
    try {

        const { username, bookId, bookName, author } = request.body;

        const userData = await User.findOne({username : request.body.username});

        //check user fine amount
        if (userData.fineAmount >= 1) {
            return response.status(400).json({ message: `Pay the pending amount to get new book, ${userData.fineAmount}!` });
        }

        // BookCount Check
        if (userData.bookCount == 1) {
            return response.status(400).json({ message: "Return The old Book!" });
        }

        //Book Detail
        const bookDetail = await Book.findOne({bookName : bookName});
        console.log(bookDetail);

        // Check book availability
        const isBook = await Book.findOne({ bookName : bookName});
        if (isBook) {
            return response.status(400).json({ message: "no book found!" });
        }

        const bookRequest = new UserBookRequest({ 
            username: username,
            bookId: bookId,
            bookName: bookName,
            author: author,
            status: 'Request'
         });
        console.log(bookRequest)
        await bookRequest.save();

        response.status(201).json({ message: 'Successfully book requested to the librarian' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Issue a book
router.post('/issueBook', authMiddleware, async (request, response) => {

    
    
    if (request.user.userType =! 'Librarian') throw new Error('Access Denied!');

    try {
        const { username, bookId, bookName, returnDate} = request.body;
            
        const userData = await User.findOne({ username : username});
        console.log("userData", userData);
        
        if (userData.points == 1) {
            return response.status(404).json({ message: "You have no Points to get a Book" });
        }

        // Check if the book exists and has available copies
        const bookData = await Book.findOne({ bookId : bookId});
        
        if (!bookData) {
            return response.status(404).json({ message: "Book not found" });
        }

        if (bookData.quantity <= 1) {
            return response.status(400).json({ message: "Book is not available" });
        }

        // Create a new issued book record
        const issuedBook = new IssuedBook({
            username,
            bookId,
            bookName,
            returnDate,
            status: 'Issued',
            userBookCount: 1
        });

        // Save the issued book record
        await issuedBook.save();

        // Decrease the quantity of the book by 1
        bookData.quantity -= 1;
        await bookData.save();

        response.status(201).json({ message: "Book issued successfully", issuedBook });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Return a book
router.put('/return-book/:id', async (request, response) => {
    try {
        const { id } = request.params;

        // Find the issued book record
        const issuedBook = await IssuedBook.findById(id);
        if (!issuedBook) {
            return response.status(404).json({ message: "Issued book record not found" });
        }

        if (issuedBook.status === 'Returned') {
            return response.status(400).json({ message: "Book has already been returned" });
        }

        // Find the book
        const book = await Book.findById(issuedBook.bookId);
        if (!book) {
            return response.status(404).json({ message: "Book not found" });
        }

        // Update the issued book record status to 'Returned'
        issuedBook.status = 'Returned';
        await issuedBook.save();

        // Increase the quantity of the book by 1
        book.quantity += 1;
        await book.save();

        response.status(200).json({ message: "Book returned successfully", issuedBook });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;
