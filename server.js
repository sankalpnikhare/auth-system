const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');

const cors = require('cors');
// const bcrypt = require('bcrypt');
const mongodbConnect = require('./db/db.js');
// const usermodel = require('./db/model/usermodel.js');
const check_email = require('./auth/check_email.js');
const create_user = require('./auth/create_user.js');
// const hashedpassword = require('./utils/encryption.js');
const auth = require('./auth/auth.js');

const verifytoken = require('./auth/verifytoken.js');
const authOrToken = require('./auth/authortoken.js');
const app = express(); 
app.use(express.static("public"));

require('./auth/google_auth.js');
mongodbConnect();



app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/');
// }
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());




app.get('/' , (req,res)=>{
    res.render('home');
});

app.get('/register' , (req,res)=>{
    res.render('register');
    

})

app.post('/create-user', async (req, res) => {
    const {name ,  email, password } = req.body;
    const payload = {
        name:req.body.name , 
        email:req.body.email
    }
    const jwtkey = process.env.JWT_SECRET_KEY ; 

    const token = jwt.sign(payload , jwtkey);
    res.cookie("token" , token , {
        httpOnly:true
    });

    const result = await check_email(req.body.email);
    if (!result) {
        return res.send("Email already Taken")
    }

    const result1 = await create_user(name ,  email, password);
    if (result1) {
        return res.status(201).send("User created successfully")
    }

    return res.status(400).send("Something went wrong ")
});

app.get('/login' , (req,res)=>{
    res.render('login')

})

app.post('/user-login' , async (req,res)=>{
    // const Username = req.body.username ;
    const Email = req.body.email ;
    const Password = req.body.password ; 
    const user = await auth( Email , Password);
    const payload = {
         
        email:req.body.email
    }
    const jwtkey = process.env.JWT_SECRET_KEY ; 

    const token = jwt.sign(payload , jwtkey);
    res.cookie("token" , token , {
        httpOnly:true
    });
    
    
    if(!user){
        return res.send("Email or Password is incorrect")
    }
    req.login(user, function(err){
        if(err){
            return res.send("Login Failed")
        }
        return res.redirect('/profile');
    })
    
    

})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/profile');
  }
);


app.get('/profile',authOrToken , (req, res) => {
    
    res.send(`Welcome ${req.user.name}`);
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});


app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server runnning on port ${process.env.PORT}`);
    
})


