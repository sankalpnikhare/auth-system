const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const bcrypt = require('bcrypt');
const mongodbConnect = require('./db/db.js');
const usermodel = require('./db/model/usermodel.js');

const hashedpassword = require('./utils/encryption.js');
const auth = require('./auth/auth.js');
const check_username = require('./auth/check_username.js');
const create_user = require('./auth/create_user.js');







mongodbConnect();


const app = express();
app.use(cors());
app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/' , (req,res)=>{
    res.render('Home');
});

app.get('/register' , (req,res)=>{
    res.render('Register');
    

})

app.post('/create-user' , async (req,res)=>{
    const {username , email , password} = req.body ;
    const result = await check_username(username);
    if(result){
        const result1 = await create_user(username , email , password );
        if(result1){
            res.send("User create successfully")
        }
        res.send("Something is missing")
        
    }
    res.send("Username already taken")



})

app.get('/login' , (req,res)=>{
    res.render('Login')

})

app.post('/user-login' , async (req,res)=>{
    const Username = req.body.username ;
    const Password = req.body.password ; 
    const result = await auth(Username , Password);
    if(result ){
        res.send("Login successful");
    }
    res.send("teri maa ki chit ")
    
    

})


app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server runnning on port ${process.env.PORT}`);
    
})


