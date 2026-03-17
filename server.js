const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const mongodbConnect = require('./db/db.js');

const check_email = require('./auth/check_email.js');
const create_user = require('./auth/create_user.js');

const auth = require('./auth/auth.js');

const authOrToken = require('./auth/authortoken.js');
const check_credentials = require('./auth/check_credentials.js');
const checkotp = require('./auth/checkotp.js');
const sendMail = require('./auth/sendMail.js');
const hashedpassword = require('./utils/encryption.js');

const app = express();

require('./auth/google_auth.js');

mongodbConnect();

app.set('trust proxy', 1);


app.use(cors());
app.use(cookieParser());
let otp;
// let limit = 0 ;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production"
    }
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res) => {
    res.render('home');
});




app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/check-otp', async (req, res) => {
    const { name, email, password } = req.body;
    const valid = check_credentials(name, email, password);
    if (!valid) {
        return res.send("Something is missing");
    }
    const emailAvailable = await check_email(email);

    if (emailAvailable) {
        return res.send("Email already taken");
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    otp = String(code);
    req.session.otp = otp;
    req.session.name = name;
    req.session.email = email;
    req.session.password = password;
    


    await sendMail(email, "Code", otp);
    res.render('check_code', { name, email, password });

})

app.post('/users', async (req, res) => {


    const code = req.body.code;
    if (code !== req.session.otp) {
        return res.send("Otp is wrong ");
    }
    const { name, email, password } = req.session;




    const created = await create_user(name, email, password);

    if (!created) {
        return res.status(400).send("Something went wrong");
    }

    const payload = { name, email };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.cookie("token", token, {
        httpOnly: true
    });

    res.status(201).send("User created successfully");
});




app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/user-login', async (req, res) => {

    const { email, password } = req.body;

    const user = await auth(email, password);
     

    if (!user) {
        
        // return res.send("Email or Password is incorrect");
        return res.send(req.session.limit);
    }

    const payload = {
        name: user.name,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.cookie("token", token, {
        httpOnly: true
    });

    req.login(user, function (err) {

        if (err) {
            return res.send("Login Failed");
        }

        return res.redirect('/profile');
    });
});




app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/profile');
    }
);




app.get('/profile', authOrToken, (req, res) => {

    res.send(`Welcome ${req.user.name}`);

});




app.get('/logout', (req, res) => {

    req.logout(() => {
        res.clearCookie("token");
        res.redirect('/');
    });

});
app.get('/resend-otp', async (req, res) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    otp = String(code);
    req.session.otp = otp;
    email = req.session.email;
    name = req.session.name;
    

    password = req.session.password;
    await sendMail(email, "Code", otp);
    res.render('check_code');
})

app.get('/forgot-password', (req, res) => {
    res.render('forgot_pass');
})

app.post('/pass_email',authOrToken ,  async (req, res) => {
    
    const user = await check_email(req.body.email);
    if (!user) {
        return res.send("This user isnt in the db")

    }


        
        email = user.email;
        name = user.name;

        const code = Math.floor(100000 + Math.random() * 900000);
        const otp = String(code);

        req.session.otp = otp;

        await sendMail(req.body.email, "Pass reset", otp);

        return res.render('check_code2', { email , name  })
    





})

app.post('/reset-pass',authOrToken , async (req, res) => {
    email = req.body.email ; 

    res.render('reset_pass' , {email});

    
    


})

app.post('/re_pass' ,authOrToken,  async(req,res)=>{
    const {password ,  email} = req.body;
    const user = await check_email(email);
    const hash = await hashedpassword(password);
    user.password = hash  ;
    await user.save() ; 
    req.session.destroy();
    res.send("Password changed successfully ");

})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});