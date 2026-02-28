const express = require('express');
const mongoose = require('mongoose');
const usermodel = require('../db/model/usermodel');


async function check_username(Username){
    const user = await usermodel.findOne({username: Username });
    if(user){
        return false ;
    }
    return true 
}


module.exports = check_username ;




    