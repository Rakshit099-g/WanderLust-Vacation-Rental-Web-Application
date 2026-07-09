const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

/*
User Signup
     │
     ▼
generateAndSendOtp(email)
     │
     ▼
Generate OTP
483912
     │
     ▼
Delete old OTP
     │
     ▼
Save new OTP in MongoDB
     │
     ▼
Connect to Gmail (transporter)
     │
     ▼
Send Email
     │
     ▼
User receives:
-------------------------
Subject: Your OTP Code

Your OTP is 483912.
It will expire in 5 minutes.
-------------------------
*/

const transporter = nodemailer.createTransport({//Ye email bhejne ka connection/configuration banata hai.  Ye internally Gmail se connect hone ki information store karta hai.
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
const generateAndSendOtp = async (email)=>{
    const otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        specialChars:false,
        lowerCaseAlphabets:false
    })
    await Otp.deleteMany({email})
    await Otp.create({email,otp})

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    })
}

module.exports = generateAndSendOtp

