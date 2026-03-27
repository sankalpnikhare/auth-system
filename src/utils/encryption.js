const bcrypt = require('bcrypt');

async function hashedpassword(password){
    const saltrounds = 10 ;

    const hashed = await bcrypt.hash(password , saltrounds);
    return hashed; 
}

module.exports = hashedpassword ; 