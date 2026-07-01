const express = require("express")
const router =  express.Router()
const User  = require("../models/User")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")
//signup
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.userSignup))



//Login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/users/login",failureFlash:true}),userController.userLogin)


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
/*router.post("/login",
    passport.authenticate('local',{failureRedirect:"/users/login",failureFlash:true}),//
    async (req,res)=>{
    res.redirect("/listings")
})*/ 
/*1. abhi tak login jab hum krte the toh wo /listings par redirect kr deta tha login k baad.Ab hum chahte hai ki login k pehle jis page par hum jana chah rhe the ussi par chale jaye 
jaise maan lo ki hum bina login kiye hue create new listing par ja rhe hai toh  wo hume login krne k liye bolega, phir jaise hi hum login kr lenge toh login k baad create new listing wale par redirect hona chahte teh lekin abhi tak hum /listings par ho rhe the. 

2.Isko achieve krne k liye jab hum create new listing par ja rhe hai toh uss time par hum uska path save kr lete hai through middleware.js jisme req contain krta hai "originalUrl" field. 

3.: go to "middleware.js"
*/
/*
Generally ye kam krna chaiye but hume passport ek dikkat dega yaha par ki jaise hi hum logged in honge passport session ko reset kr deta hai toh reated variable session k delete ho jaate hai issiliye hum originalUrl ko res.locals m save krayenge 
Login ke baad Passport session ko regenerate kyun karta hai?
A:Taaki Session Fixation Attack se bach sake. Login ke baad passport purani session ID ko invalidate karke ek nayi session ID generate ki jaati hai, aur usme authenticated user ki information store hoti hai. Isse attacker purani session ID ka use karke account access nahi kar sakta.

router.post("/login",
    passport.authenticate('local',{failureRedirect:"/users/login",failureFlash:true}),//
    async (req,res)=>{
    res.redirect(req.session.redirectUrl)
})
*/

//logout
router.get("/logout",userController.userLogout)

module.exports = router