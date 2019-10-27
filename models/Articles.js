const mongoose = require('mongoose');


const ArticleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    
    link:{
        type:String,
        required:true
    },

    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
})


module.exports = mongoose.model('Articles', ArticleSchema);
