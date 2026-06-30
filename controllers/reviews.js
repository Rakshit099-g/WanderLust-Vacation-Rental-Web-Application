const Review = require("../models/Review")
const Listing = require("../models/Listing")

module.exports.createReview = async (req,res)=>{
    let {id} = req.params
    let newReview = new Review(req.body.review) 

    newReview.author = req.user._id //added author of new review
    
    let listing = await Listing.findById(id)
    listing.reviews.push(newReview)
    console.log(newReview)
    await newReview.save()
    await listing.save()
    //yaha par upar ki 4 line se humne ye handle kiya ki agar review create kr rhe hai toh wo review humare listing.reviews m bhi add ho jaye
    req.flash("success","Review submitted!") //ye register kr rha hai flash message jaise hi redirect ho jayega tab flash ho jayega ho message
    res.redirect(`/listings/${id}`)
}

module.exports.destroyReview = async(req,res)=>{    // https://chatgpt.com/c/6a3d2b55-8d14-83e8-b636-9e6470dae6ba(For revision)
    let {id,review_id} = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:review_id}})  // $pull --> reviews array se us review ki id remove kar dega.
    await Review.findByIdAndDelete(review_id)
    //upar ki 2 line se toh humne ye handle kiya ki agr hum review ko delete krte hai toh Review collection se delete hoga wo review and listing.revies se bhi delete ho jayega 
    req.flash("success","Review Deleted successfully!!")
    res.redirect(`/listings/${id}`)
}

