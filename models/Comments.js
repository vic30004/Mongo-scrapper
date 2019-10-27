const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    body:{
        type:String,
        required:true
    }

})


module.exports = mongoose.model('Comments', CommentsSchema);
