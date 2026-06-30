const User  = require("../models/User")

//signup
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.userSignup = async (req,res)=>{
    try{
        let {username,email,password} = req.body
        let newUser = new User({email,username})
        let registeredUser = await User.register(newUser,password)
       
        //signup hone k baad automatically login hone k liye hum passport ka req.login(user,callback) use krenge
       
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","you are logged In!!")
            res.redirect("/listings")
        })
    }
    catch(err){
        req.flash("error","User already exists!")
        res.redirect("/users/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}
//Login
module.exports.userLogin = async (req,res)=>{
   // res.redirect(res.locals.redirectUrl) // isme ek aur flaw hai ki jab iss /login route par jayenge toh iss post request m toh loggedIn middleware trigger ho hi nhi rha hai toh hum req.session.redirectUrl ko access hi mhi kr paynge toh iske liye hum ek middleware bana rhe saveRedirectUrl
    let redirectPage = (res.locals.redirectUrl) || "/listings"
    res.redirect(redirectPage)
}

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