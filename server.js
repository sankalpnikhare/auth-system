const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongodbConnect = require('./db/db.js');
const usermodel = require('./db/model/usermodel.js');

const hashedpassword = require('./utils/encryption.js');



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
    const hash = await hashedpassword(req.body.password);
    console.log(hash);
    if(!req.body.username ||!req.body.email ||!req.body.password ){
        res.send("Something is missing");
    }
    res.send("done");
    const data = await usermodel.create({
        username: req.body.username ,
        email:req.body.email ,
        password:hash
    })


})

app.get('/login' , (req,res)=>{
    res.render('Login')

})

app.post('/user-login' , async (req,res)=>{
    const Username = req.body.username ;
    const Password = req.body.password ; 
    const user = await usermodel.findOne({username : Username});
    if(!user){
        res.send("User Not found")
    }
    
    const ismatch = await bcrypt.compare(Password , user.password);
    if(!ismatch){
        res.send("Password is incorrect ")
    }

    res.send("Login successful");

})


app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server runnning on port ${process.env.PORT}`);
    
})


