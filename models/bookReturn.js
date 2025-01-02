const mongoose = require('mongoose');

const BookReturnSchema = {
    
    username: {
        type : String,
        required: true 
    },
    bookName: {
        type : String,
        required: true 
    },
    bookId: {
        type : Number,
        required: true 
    },
    status: {
        type: String,
        required: false
    }
    
};


const UserBookReturn = new mongoose.model("UserBookReturn", BookReturnSchema);

module.exports = UserBookReturn;