const express = require('express');
const mongoose = require('mongoose');
const usermodel = require('../db/model/usermodel');
const bcrypt = require('bcrypt');
const app = express();


async function auth(Username , Password){
    const user = await usermodel.findOne({username : Username});
    if(!user){
        return false
    }
    
    const ismatch = await bcrypt.compare(Password , user.password);
    if(!ismatch){
        return false
    }

    return true ;

    

}

module.exports = auth ;