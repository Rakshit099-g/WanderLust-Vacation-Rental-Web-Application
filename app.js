const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/Listing")
const path = require("path")
const method = require("method-override")
const ejsMate = require("ejs-mate")  //ejs-mate hume layout (boilerplate) use karne deta hai.
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/Review")
const User = require("./models/User.js")

const passport = require("passport")
const LocalStrategy = require("passport-local")

const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/reviews.js")

const session = require("express-session")
const flash = require("connect-flash")


const userRouter = require("./routes/users.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
//client side k validation k liye form validation aur error se kr diya
//hum "joi" ko use krenge schema validation k liye different validation of different fields of schema on server side(ek question ye bhi aa skta hai ki hum apne website se toh galat data de hi nhi payenge form se kyuki fields required hai but ye hum tab k liye kr rhe jab khi postman ya hopscotch jaisi tools se direct post kiya jaye data aur fields(like description,location) missing ho )
//joi k liye hum ek alag schema define krenge jo ki database wala nhi hai

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}))
app.use(method("_method"));

app.use(express.static(path.join(__dirname,"/public")))

app.engine("ejs",ejsMate)

let sessionOptions = {
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{//cookie ka expiry set hogy aki abhi se kab expire hoga jo ki yaha par 7 din h
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),//expires → Exact date/time batata hai ki cookie kab expire hogi.
        maxAge:7 * 24 * 60 * 60 * 1000,//maxAge → Cookie kitni der (milliseconds) tak valid rahegi.
        httpOnly:true
    },
}


main().then(()=>{
    console.log("CONNECTED TO DB")
}).catch(err=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}



//sare routes jo /listings se aa rhe pehle ye middleware le lega phir /listings/... k baad jo bhi routehoga wo listingRouter object k pass jayega mlrb router in routes aur wha se saare routes map ho jayenge
/*Request aayi
      │
      ▼
Kya URL "/listings" se start ho rahi hai?
      │
      ├── Nahi
      │      ▼
      │  Dusre middleware/routes check honge
      │
      └── Haan
             │
             ▼
      listingRouter ko request de do
             │
             ▼
      Router ke andar remaining path match hoga
             │
             ▼
      Corresponding route execute hoga*/



app.get("/",(req,res)=>{
    res.redirect("/listings")
})

app.use(session(sessionOptions))
app.use(flash())
//Note session k baad hi passport ko use krna hai kyuki passport session ka use krta hai
/*==================================================
                SIGNUP
==================================================

Username
Email
Password
      │
      ▼
User.register()
      │
      │  (passport-local-mongoose)
      │  - Password ko Hash karta hai
      │  - Salt Generate karta hai
      │  - User ko MongoDB me Save karta hai
      ▼

MongoDB

{
_id : A123
username : rakshit
email : rakshit@gmail.com
hash : #####
salt : #####
}

❌ Passport use nahi hua
❌ Passport-Local use nahi hua
✅ Passport-Local-Mongoose use hua


==================================================
                LOGIN
==================================================

Username
Password
      │
      ▼
passport.authenticate("local")
      │
      │
      ├── passport
      │      Authentication process start karta hai
      │
      ├── passport-local
      │      "local" strategy use karta hai
      │      (Username + Password login)
      │
      └── passport-local-mongoose
             User.authenticate()
             Database se user nikalta hai
             Hash compare karta hai

      ▼
Password Match
      │
      ▼
passport.serializeUser()
      │
      │
      ├── passport
      │      Session banana start karta hai
      │
      └── passport-local-mongoose
             User.serializeUser()
             Sirf User ID Session me save karta hai

      ▼

Session

{
 passport:{
    user:"A123"
 }
}


==================================================
             NEW REQUEST
==================================================

GET /listings

Browser
      │
      ▼
Session

{
 passport:{
    user:"A123"
 }
}

      │
      ▼
passport.session()
      │
      │
      └── passport
             Session ko read karta hai

      ▼
passport.deserializeUser()
      │
      │
      ├── passport
      │      deserialize process start karta hai
      │
      └── passport-local-mongoose
             User.deserializeUser()
             Internally User.findById("A123") chalata hai

      ▼
MongoDB

{
 _id:A123
 username:rakshit
 email:rakshit@gmail.com
}

      │
      ▼
req.user

{
 _id:A123
 username:"rakshit"
 email:"rakshit@gmail.com"
}

      │
      ▼

Route

console.log(req.user.username)

Output

rakshit
*/
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// app.get("/demoUser",async (req,res)=>{
//       let newUser = new User({
//             email:"tuy@gmail.com",
//             username:"pqr"
//       })

//       let registeredUser = await User.register(newUser,"helloworld") //.register(userdata,password,callback) passport-local-mongoose method
//       res.send(registeredUser)
// })


//flash middleware ko listing k upar hi create krna hai kyuki hum use krne wale hai isko listing m 
/*
User Clicks Submit
        │
        ▼
POST /listings
        │
        ▼
Listing Saved
        │
        ▼
req.flash("success","Listing Created")
        │
        ▼
Session

{
 flash:{
   success:[
      "Listing Created"
 ]
}
}
        │
        ▼
res.redirect("/listings")
        │
        ▼
Browser Sends New GET Request
        │
        ▼
Express Middleware
        │
        ▼
req.flash("success")
        │
        ├──── Reads Message
        │
        ├──── Deletes Message
        │
        ▼
Returns

["Listing Created"]
        │
        ▼
res.locals.successMsg
        │
        ▼
Route Handler
        │
        ▼
res.render("index.ejs")
        │
        ▼
EJS Receives

successMsg
        │
        ▼
Alert Displayed
        │
        ▼
Response Finished
        │
        ▼
res.locals Destroyed
        │
        ▼
User Refresh
        │
        ▼
req.flash("success")
        │
        ▼
[]
        │
        ▼
No Alert
*/
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user //hum ek local variable bana rhe hai session k andar jo saare ejs pages m available hoga during session(signin signup and logout ko handle krne k liye ki kab wo dikhega ya nhi uske liye req.user ka access chaiye tha)
    next()
})

app.use("/listings",listingRouter)

app.use("/listings/:id/reviews",reviewRouter)

app.use("/users",userRouter)


//Invalid route handling
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})


//Middleware for error
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err
    res.status(status).render("./listings/Error.ejs",{err})
})

app.listen(8080,()=>{
    console.log("Listening")
})

//conclusion
// Client-side validation (HTML/Bootstrap) → Normal users ko galat data bhejne se rokta hai.
// Joi validation → Server par aane wale data ko verify karta hai, chahe request browser se aaye ya Postman/Hoppscotch se.
// wrapAsync → Async code me aane wale errors ko pakadkar error middleware tak pahuchata hai.
// Error Middleware → User ko final error response/show page deta hai.