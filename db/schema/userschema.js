const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
    username: String,
    email:{
        type:String ,
        required:true 
    }, 
    password:String
});

module.exports = userschema;