const express = require('express');
const mongoose = require('mongoose');
const usermodel = require('../db/model/usermodel');
const bcrypt = require('bcrypt');
const hashedpassword = require('../utils/encryption');



async function create_user(Username , email , password ){
   
    if(!Username ||!email ||!password ){
        return false ;
    }
    const hash = await hashedpassword(password);

    const data = await usermodel.create({
        username: Username ,
        email:email ,
        password:hash
    })

    return true ;


}

module.exports = create_user ; 