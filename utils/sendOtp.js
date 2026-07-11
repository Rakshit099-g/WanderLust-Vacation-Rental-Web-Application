// /*const otpGenerator = require('otp-generator');
// const nodemailer = require('nodemailer');
// const Otp = require('../models/Otp');

// /*
// User Signup
//      │
//      ▼
// generateAndSendOtp(email)
//      │
//      ▼
// Generate OTP
// 483912
//      │
//      ▼
// Delete old OTP
//      │
//      ▼
// Save new OTP in MongoDB
//      │
//      ▼
// Connect to Gmail (transporter)
//      │
//      ▼
// Send Email
//      │
//      ▼
// User receives:
// -------------------------
// Subject: Your OTP Code

// Your OTP is 483912.
// It will expire in 5 minutes.
// -------------------------
// */

// /*const transporter = nodemailer.createTransport({//Ye email bhejne ka connection/configuration banata hai.  Ye internally Gmail se connect hone ki information store karta hai.
//     service:'gmail',
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// });*/


// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// //     tls: {
// //         rejectUnauthorized: false,
// //     },
// });

// const generateAndSendOtp = async (email)=>{
//      console.log("otp function started");
//     const otp = otpGenerator.generate(6,{
//         upperCaseAlphabets:false,
//         specialChars:false,
//         lowerCaseAlphabets:false
//     })
//     console.log("Otp generated:",otp)
//     await Otp.deleteMany({email})
//     console.log("Old OTP Deleted");
//     await Otp.create({email,otp})
//     console.log("New OTP Saved");

//      console.log("EMAIL_USER:", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS Exists:", !!process.env.EMAIL_PASS);

//     console.log("Sending Mail...");

//     await transporter.sendMail({
//         from:process.env.EMAIL_USER,
//         to:email,
//         subject: 'Your OTP Code',
//         text: `Your OTP is ${otp}. It will expire in 5 minutes.`
//     })
// }
//  console.log("Mail Sent Successfully");

// module.exports = generateAndSendOtp


const otpGenerator = require("otp-generator");
const sgMail = require("@sendgrid/mail");
const Otp = require("../models/Otp");

// Set SendGrid API Key
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const generateAndSendOtp = async (email) => {
    try {
        console.log("OTP Function Started");

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP Generated:", otp);

        // Delete old OTP
        await Otp.deleteMany({ email });
        console.log("Old OTP Deleted");

        // Save new OTP
        await Otp.create({ email, otp });
        console.log("New OTP Saved");

        // Email Object
        const msg = {
            to: email,
            from: process.env.SEND_GRID_EMAIL, // Verified Sender Email
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding:20px;">
                    <h2>Email Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP for verification is:</p>

                    <h1 style="letter-spacing:5px; color:#2563eb;">
                        ${otp}
                    </h1>

                    <p>This OTP is valid for <b>5 minutes</b>.</p>

                    <p>If you didn't request this OTP, you can ignore this email.</p>

                    <br>

                    <p>Regards,</p>
                    <b>WanderLust Team</b>
                </div>
            `,
        };

        console.log("Sending Email...");

        await sgMail.send(msg);

        console.log("Mail Sent Successfully");
    } catch (err) {
        console.error("Email Sending Error:", err.response?.body || err);
        throw err;
    }
};

module.exports = generateAndSendOtp;