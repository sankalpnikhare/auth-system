const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
    googleId: String,
    name:String , 
    email:{
        type:String ,
        required:true 
    }, 
    password:{
        type:String ,
        required:false
    },
    authtype: String,
    photo:String
    
});

module.exports = userschema;