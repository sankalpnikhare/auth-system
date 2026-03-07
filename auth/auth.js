
const usermodel = require('../db/model/usermodel');
const bcrypt = require('bcrypt');



async function auth(Email , Password){
    const user = await usermodel.findOne({email : Email});
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