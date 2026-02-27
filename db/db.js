const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const userModel = require('../db/model/usermodel.js');


async function mongodbConnect(){
    mongoose.connect(process.env.MONGO_URI);
    console.log("__Connected to DB yes it is connected to the db_______ ");
    
}


module.exports = mongodbConnect ; 
