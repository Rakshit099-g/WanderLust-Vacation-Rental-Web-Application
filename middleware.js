const Listing = require("./models/Listing")
const Review = require("./models/Review")
const {listingSchema,reviewSchema} = require("./schema.js")
const ExpressError = require("./utils/ExpressError")




module.exports.isLoggedIn = (req,res,next)=>{
    //logged in hone se pehle hum originalUrl ko save kr  lenge
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be LoggedIn")
        return res.redirect("/users/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}
/*
User -> /listings/new
        │
        ▼
req.session.redirectUrl = "/listings/new"
        │
        ▼
POST /login
        │
        ▼
saveRedirectUrl(middleware)
        │
        └── res.locals.redirectUrl = "/listings/new"
        │
        ▼
passport.authenticate()
        │
        ▼
Session regenerate
        │
        ▼
req.session.redirectUrl ho bhi sakta hai na mile
        │
        ▼
res.locals.redirectUrl abhi bhi safe hai ✅
        │
        ▼
res.redirect(res.locals.redirectUrl)

*/
//validation Middleware
//For server side validation of Listing
module.exports.validateListing = (req,res,next)=>{
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
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body) //validate joi ka predefined validate method h aur reviewSchema(schema.js m defined hai) par validate kiya gya hai 
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    }
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params
        let listing = await Listing.findById(id)
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","You are not the listing owner!!")
            return res.redirect(`/listings/${id}`)
        }
        next()
}
module.exports.isAuthor = async (req,res,next)=>{
    let {id,review_id} = req.params
    let reviewAuthor = await Review.findById(review_id)
    if(!reviewAuthor.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


/*
ye method passport.session aur passport.initialize le aate hai
Passport har request ke saath req object ko kuch extra methods de deta hai:
 req.login()
 req.logout()
 req.isAuthenticated()
 req.user
*/