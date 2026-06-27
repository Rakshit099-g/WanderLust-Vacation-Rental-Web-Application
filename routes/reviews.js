const express = require("express")

// mergeParams: true isliye use kiya hai kyuki parent router ka :id
// child router ke req.params me by default available nahi hota.
// Iske bina let { id } = req.params undefined hoga.
// mergeParams parent aur child router ke params ko merge kar deta hai.
/*
Request:
POST /listings/685fbc123/reviews

        │
        ▼
listingRouter
/:id/reviews
        │
        │ req.params = { id: "685fbc123" }
        ▼
reviewRouter
        │
        ├── mergeParams: false
        │      req.params = {}
        │
        └── mergeParams: true
               req.params = { id: "685fbc123" }
*/

const router = express.Router({mergeParams:true}) 
const Listing = require("../models/Listing")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")
const {reviewSchema} = require("../schema.js")
const Review = require("../models/Review")



//For server side validation of Review
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body) //validate joi ka predefined validate method h aur reviewSchema(schema.js m defined hai) par validate kiya gya hai 
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    }
}

//Review post route one to many database relationship
//Create Review 
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params
    let newReview = new Review(req.body.review) 
    let listing = await Listing.findById(id)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    //yaha par upar ki 4 line se humne ye handle kiya ki agar review create kr rhe hai toh wo review humare listing.reviews m bhi add ho jaye
    req.flash("success","Review submitted!") //ye register kr rha hai flash message jaise hi redirect ho jayega tab flash ho jayega ho message
    res.redirect(`/listings/${id}`)
}))

//Delete Review
router.delete("/:review_id",wrapAsync(async(req,res)=>{    // https://chatgpt.com/c/6a3d2b55-8d14-83e8-b636-9e6470dae6ba(For revision)
    let {id,review_id} = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}})  // $pull --> reviews array se us review ki id remove kar dega.
    await Review.findByIdAndDelete(review_id)
    //upar ki 2 line se toh humne ye handle kiya ki agr hum review ko delete krte hai toh Review collection se delete hoga wo review and listing.revies se bhi delete ho jayega 
    req.flash("success","Review Deleted successfully!!")
    res.redirect(`/listings/${id}`)
}))
//but abhi bhi ek case bach rha hai ki agar hum puri listing hi delete kr de toh Review colllection m uss listing k corresponding bhi review delete ho jana chaiye iske liye hum post middleware use krenge (see in listing.js) normal delete route par jab request ayegi tab wo findByIdAndDelete ko hit krega jisse wo internally findOneAndDelete wale ka post middleware par le jayega see (listing.js)

module.exports = router