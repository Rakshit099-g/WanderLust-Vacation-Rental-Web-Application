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

const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/reviews.js")


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

main().then(()=>{
    console.log("CONNECTED TO DB")
}).catch(err=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}
//validation Middleware
//For server side validation of Listing
const validateListing = (req,res,next)=>{
    //joi ne individual fields k upar validation apply kar diya
    let {error} = listingSchema.validate(req.body)//iska mtlb ye hai ki hum check kr rhe listingSchema k andar jo bhi schema define kiye kya wo define schema ko satisfy kr rhi hai (server side validation)
    console.log(error)//joi ka provided result
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
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

app.use("/listings",listingRouter)

app.use("/listings/:id/reviews",reviewRouter)


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