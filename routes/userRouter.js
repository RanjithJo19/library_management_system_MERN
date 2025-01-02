const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');
const UserBookReturn = require('../models/bookReturn');
const issuedBook = require('../models/IssuedBook');
const bookRequest = require('../models/requestBook');
const UserRequest = require('../models/userRequest');
const authMiddleware = require('../middlewares/authMiddleware');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const router = express.Router();


// get all user request
router.get('/RequestedUser', authMiddleware, async (request, response) => {
    
        // const decoded = request.user;
        // if (decoded.userType =! 'Librarian') throw new Error('Access Denied!');

try {

    const studentsRequest = await UserRequest.find({});
    response.status(200).json(studentsRequest);
} catch (error) {
    response.status(500).json({ message: error.message });
}
});


// Register route
router.post('/register', async (request, response) => {

    console.log(request.body);
    
    try {
        const UserRequest = mongoose.model("UserRequest");
        const { name, username, email, password, userType } = request.body;

        // Check if the name already exists
        const existingName = await UserRequest.findOne({ name: request.name});
        if (existingName) {
            return response.status(400).json({ message: "name already exists" });
        }

        // Check if the user already exists
        const existingUser = await UserRequest.findOne({ username: request.username });
        if (existingUser) {
            return response.status(400).json({ message: "Username already exists" });
        }

        // Check if the email already exist
        const existingEmail = await UserRequest.findOne({ email: request.email });
        if (existingEmail) {
            return response.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUserRequest = new UserRequest({
            name,
            username,
            email,
            password: hashedPassword,
            userType
        });

        // Save the user
        await newUserRequest.save();

        response.status(201).json({ message: "User requested successfully" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Admin approves request and transfers to User DB
router.post('/admin/Approve', authMiddleware, async (request, response) => {
    
        const decoded = request.user;
        if (decoded.userType =! 'Librarian') throw new Error('Access Denied!');
        
    try {
        // Find the request by user Detail
        const { name, username, email, password,  } = request.body;

        // const userRequestData = await UserRequest.findOne({username:username});
        const existingUser = await User.findOne({ name, username, email });
        if (existingUser) {
            return response.status(404).json({ message: "This User Already in User DB" });
        }

        
        if (request.body.isApproved) {
            const UserRequest = mongoose.model("UserRequest");
            const newUser = new User({
                name: name,
                username: username,
                email: email,
                password: password, // Hashed Password
                userType: 'Student'    
            });
            await newUser.save();            
            await UserRequest.findOneAndDelete({username:username});
            
        }else {
            return response.status(400).json({ message: "Request not approved" });
        }

        response.status(200).json({ message: 'Request approved and user added to User database & user data deleted from user Request' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server error' });
    }
});


// Login route
router.post('/login', async (request, response) => {
    try {

        const { username, password } = request.body;

        // Check if the user exists
        const getUser = await User.findOne({ 
            username: username 
        });
        if (!getUser) {
            return response.status(400).json({ message: "Invalid Username" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, getUser.password);

        if (!isMatch) {
            return response.status(400).json({ message: "Invalid Password" });
        }

        // Generate a token
        const accessToken = await jwt.sign({ 
            _Id: getUser._id,
            username: getUser.username,
            userType: getUser.userType,
        },
            process.env.JWT_SECRET
        );

    response.status(200).json({ 
        status: "Success",
        message: "User logged in successfully",
        accessToken : accessToken,
        
    });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
});


// book Return Request
router.post('/bookReturnRequest', authMiddleware, async (request, response) => {  
        
    try {

        const { username, bookName, bookId } = request.body;
        

        const userData = await User.findOne({ username : username});
        const bookData = await Book.findOne({ bookId : bookId});
        const issuedBookDetail = await issuedBook.findOne({username: username});
        
        

        const UserBookReturnRequest = new UserBookReturn({ 
            username,
            bookName,
            bookId,
            status: 'Book-Return'
         });


        await UserBookReturnRequest.save();

        //Update book count in DB
        bookData.quantity += 1;
        await bookData.save();

        //user BookCount Update
        userData.bookCount -= 1;
        await userData.save();


        // fine calculation
        const daysLate = await Math.ceil(( Date.now() - issuedBookDetail.returnDate) / (1000 * 60 * 60 * 24));

        if (daysLate <= 7) {
           userData.fineAmount = 5;
           await userData.save();
            
        }else{
            fine = 5;
            userData.fineAmount = (daysLate - 7) * 10;
            await userData.save();
        }

        await issuedBook.findOneAndDelete({username:username});

        response.status(201).json({ message: 'Thanks for your book returning request' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Get user info by username
router.get('/:username',authMiddleware, async (request, response) => {

        const decoded = request.user;
        if (decoded.userType =! 'Librarian') throw new Error('Access Denied!');
        
    try {
        
        const getUser = await User.findOne({ username: decoded.username });
        if (!getUser) {
            return response.status(404).json({ message: "User not found" });
        }
        
    response.status(200).json(getUser);

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// Route to update user profile
router.put('/edit-profile',authMiddleware , async (request, response) => {
    const decoded = request.user;
    try {

        const username = decoded.username;

        const updatedUser = await User.findByIdAndUpdate(
            username,
            request.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        response.status(200).json({message:"Profile updated successfully"});
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


// get all user
router.get('/', authMiddleware, async (request, response) => {
    
        const decoded = request.user;
        if (decoded.userType =! 'Librarian') throw new Error('Access Denied!');

    try {

        const students = await User.find({});
        response.status(200).json(students);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;
