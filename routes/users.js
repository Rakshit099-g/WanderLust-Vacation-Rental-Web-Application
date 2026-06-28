const express = require("express")
const router =  express.Router()
const User  = require("../models/User")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")

//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password} = req.body
        let newUser = new User({email,username})
        let registeredUser = await User.register(newUser,password)
        console.log(registeredUser)
        req.flash("success","You are registered!")
        res.redirect("/listings")
    }
    catch(err){
        req.flash("failure","User already exists!")
        res.redirect("/users/signup")
    }
}))

//Login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
/*
POST /users/login
        │
        ▼
passport.authenticate("local")(passport middleware)
        │
        ▼
User.authenticate()
        │
        ▼
MongoDB
        │
        ▼
Username exists?
        │
 ┌──────┴──────────┐
 │                 │
No                Yes
 │                 │
 ▼                 ▼
Failure      Password Compare
 │                 │
 │          ┌──────┴──────┐
 │          │             │
 ▼          No           Yes
Flash        │             │
Redirect     ▼             ▼
             Flash      serializeUser()
             Redirect        │
                             ▼
                          Session
                             │
                             ▼
                           next()
                             │
                             ▼
                  res.redirect("/listings")
*/
router.post("/login",
    passport.authenticate('local',{failureRedirect:"/users/login",failureFlash:true}),//
    async (req,res)=>{
    res.redirect("/listings")

})

module.exports = router