const mongoose = require('mongoose');
const userschema = require('../schema/userschema.js');

const usermodel = new mongoose.model('users' , userschema);

module.exports = usermodel;