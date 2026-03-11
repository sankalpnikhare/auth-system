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

const app = express();

require('./auth/google_auth.js');

mongodbConnect();

app.set('trust proxy', 1);


app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/create-user', async (req, res) => {

    const { name, email, password } = req.body;

    const emailAvailable = await check_email(email);

    if (!emailAvailable) {
        return res.send("Email already taken");
    }

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
        return res.send("Email or Password is incorrect");
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



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});