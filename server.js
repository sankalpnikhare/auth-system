const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
// const bcrypt = require('bcrypt');
const mongodbConnect = require('./db/db.js');
// const usermodel = require('./db/model/usermodel.js');
const check_email = require('./auth/check_email.js');
const create_user = require('./auth/create_user.js');
// const hashedpassword = require('./utils/encryption.js');
const auth = require('./auth/auth.js');
const app = express(); 
app.use(express.static("public"));

require('./google_auth.js');
mongodbConnect();



app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());




app.get('/' , (req,res)=>{
    res.render('Home');
});

app.get('/register' , (req,res)=>{
    res.render('Register');
    

})

app.post('/create-user', async (req, res) => {
    const {name ,  email, password } = req.body;

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
    res.render('Login')

})

app.post('/user-login' , async (req,res)=>{
    // const Username = req.body.username ;
     const Email = req.body.email ;
    const Password = req.body.password ; 
    const result = await auth( Email , Password);
    if(result ){
        return res.send(`Login Successfull `);
    }
    return res.send("Email or Password is incorrect  ")
    //Login Bug Fixed 
    
    

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


app.get('/profile',isLoggedIn , (req, res) => {
    
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


