const mongoose = require('mongoose');

const connectDB = async ()=>{
   const conn= await mongoose.connect(URI_CONNECTION=mongodb,{
       useNewUrlParser: true,
       useCreateIndex: true,
       useFindAndModify:false,
       useUnifiedTopology: true
   });
   console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports= connectDB;