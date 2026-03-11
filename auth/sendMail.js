const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport(
        {
            secure:true,
            host:'smtp.gmail.com',
            port:465,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }                                                              //---This can be eliminated
        }
    );                                       

    function sendMail(to,sub,msg){
        transporter.sendMail({
            to:to,
            subject:sub,
            html:msg
        });
    };


module.exports = sendMail ; 
