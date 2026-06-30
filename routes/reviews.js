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
const {isLoggedIn,isAuthor,validateReview} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")
//Review post route one to many database relationship
//Create Review 
router.post("/",isLoggedIn ,validateReview,wrapAsync(reviewController.createReview))

//Delete Review
router.delete("/:review_id",isLoggedIn,isAuthor ,wrapAsync(reviewController.destroyReview))
//but abhi bhi ek case bach rha hai ki agar hum puri listing hi delete kr de toh Review colllection m uss listing k corresponding bhi review delete ho jana chaiye iske liye hum post middleware use krenge (see in listing.js) normal delete route par jab request ayegi tab wo findByIdAndDelete ko hit krega jisse wo internally findOneAndDelete wale ka post middleware par le jayega see (listing.js)

module.exports = router