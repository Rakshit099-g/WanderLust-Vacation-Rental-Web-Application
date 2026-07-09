const User  = require("../models/User")
const generateAndSendOtp = require("../utils/sendOtp")
const Otp = require("../models/Otp")

//signup
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.userSignup = async (req,res)=>{
    try{
        let {username,email,password} = req.body

        let existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            if (existingUser.isVerified) {
                // Sach me registered hai, verified bhi hai
                req.flash("error", "User already exists! Please login.");
                return res.redirect("/users/login");
            } else {
                // User exist karta hai lekin verify nahi hua tha
                // Purana record delete karke fresh signup karenge
                await User.deleteOne({ _id: existingUser._id });
            }
        }

        let newUser = new User({email,username})
        let registeredUser = await User.register(newUser,password)
       
        //signup hone k baad automatically login hone k liye hum passport ka req.login(user,callback) use krenge
       //OTP
        await generateAndSendOtp(email);
        req.flash("success","OTP sent to your email. Please verify to continue!")
        req.session.tempEmail = email;// Session me email temporarily store kar denge taaki verify-otp page pe pata rahe
        res.redirect("/users/verify-otp");  //res.redirect() browser ko GET request bhejne ke liye hi bolta hai.

    }
    catch(err){
        req.flash("error","User already exists!")
        res.redirect("/users/signup")
    }
}
//OTP verify wala page dikhane ke liye

module.exports.renderVerifyOtp = (req,res)=>{
    console.log("Verify OTP Page");
    console.log(req.session.tempEmail);
    if(!req.session.tempEmail){
        req.flash("error", "Session expired. Please signup again.")
       return res.redirect("/users/signup")
    }
    res.render("users/verify-otp.ejs")
} 

module.exports.VerifyOtp = async (req,res)=>{
    const {otp} = req.body;
    const email = req.session.tempEmail

    const record = await Otp.findOne({email,otp})
    console.log(record)
    
    if (!record) {
        req.flash("error", "Invalid or expired OTP. Please try again.");
        return res.redirect("/users/verify-otp");
    }

    let user = await User.findOneAndUpdate(
        {email},
        {isVerified:true},
        {new :true}

    )
    await Otp.deleteOne({_id:record._id})
    delete req.session.tempEmail;
    req.login(user,(err)=>{
            if(err){
                return res.redirect("/users/signup");
            }
            req.flash("success","Email verified successfully! Welcome!")
            res.redirect("/listings")
        })
/*
Signup
   │
   ▼
Session:
tempEmail = abc@gmail.com

Database:
OTP = 483921

        │
        ▼
User enters OTP

        │
        ▼
OTP matched ✅

        │
        ├── User.isVerified = true
        ├── Delete OTP from DB
        ├── Delete tempEmail from Session
        └── Login user
*/

}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}
//Login
module.exports.userLogin = (req, res, next) => {
    if (!req.user.isVerified) {
        req.session.tempEmail = req.user.email;

        return req.logout((err) => {
            if (err) return next(err);

            req.flash("error", "Please verify your email first.");
            return res.redirect("/users/verify-otp");
        });
    }

    req.flash("success", "Welcome back!");

    let redirectPage = res.locals.redirectUrl || "/listings";
    res.redirect(redirectPage);
};

//Logout
module.exports.userLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged out now!!")
        res.redirect("/listings")
    })
}

module.exports.ResendOtp = async (req,res)=>{
    let email = req.session.tempEmail
    if(!email){
        req.flash("error", "Session expired. Please signup again.");
        return res.redirect("/users/signup");
    }
    await generateAndSendOtp(email);
    req.flash("success", "OTP resent to your email.");
    res.redirect("/users/verify-otp")


}