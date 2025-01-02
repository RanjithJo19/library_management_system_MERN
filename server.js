const express = require('express');
const db = require('./db');
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const bookRouter = require('./routes/bookRouter');
const issuedBookRouter = require('./routes/issuedBookRouter');

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());


app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/issuedBook', issuedBookRouter);



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`); // Print the port number in the log message
});
