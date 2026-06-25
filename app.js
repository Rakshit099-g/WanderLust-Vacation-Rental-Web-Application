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

//For server side validation of Review
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    }
}

app.get("/",(req,res)=>{
    res.redirect("/listings")
})

// wrapAsync
// wrapAsync → Async code me aane wale errors ko pakadkar error middleware tak pahuchata hai.

// Async route handlers ke errors catch karta hai.
// Har route me try-catch likhne se bachata hai.
// Internally fn(...).catch(next) use karta hai.
// Error ko Express ke error-handling middleware tak bhej deta hai.


//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({})
     res.render("listings/index.ejs", { allListing }); 
    
}))

//Create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    console.log(newListing)
    res.redirect("/listings")
}))



//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs",{listing})
}))

//Update 
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
}))

app.patch("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true})
    res.redirect(`/listings/${id}`)

}))

//DELETE
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

//Review post route one to many database relationship
//Create Review 
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params
    let newReview = new Review(req.body.review) 
    let listing = await Listing.findById(id)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    //yaha par upar ki 4 line se humne ye handle kiya ki agar review create kr rhe hai toh wo review humare listing.reviews m bhi add ho jaye
    res.redirect(`/listings/${id}`)
}))

//Delete Review
app.delete("/listings/:id/reviews/:review_id",wrapAsync(async(req,res)=>{
    let {id,review_id} = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}})  // $pull --> reviews array se us review ki id remove kar dega.
    await Review.findByIdAndDelete(review_id)
    //upar ki do line se toh humne ye handle kiya ki agr hum review ko delete krte hai toh Review collection se delete hoga wo review and listing.revies se bhi delete ho jayega 
    res.redirect(`/listings/${id}`)
}))
//but abhi bhi ek case bach rha hai ki agar hum puri listing hi delete kr de toh Review colllection m uss listing k corresponding bhi review delete ho jana chaiye iske liye hum post middleware use krenge (see in listing.js) normal delete route par jab request ayegi tab wo findByIdAndDelete ko hit krega jisse wo internally findOneAndDelete wale ka post middleware par le jayega see (listing.js)

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