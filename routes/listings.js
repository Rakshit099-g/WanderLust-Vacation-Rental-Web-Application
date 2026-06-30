const express = require("express")
const router =  express.Router()
const Listing = require("../models/Listing")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")

const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")

const listingController = require("../controllers/listing.js") 





//Index Route
router.get("/",wrapAsync(listingController.index))

//Create route
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing))

//show route
router.get("/:id",wrapAsync(listingController.showListings))

//Update 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

router.patch("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListings))

//DELETE  (baad m humne relationship with database wala bhi kaam kiya ki jab listing delete ho toh uske corresponding review m se uss listing ki data bhi delete ho jo ki post middleware handle kiya hai in Listing.js m)
router.delete("/:id",isLoggedIn,isOwner ,wrapAsync(listingController.destroyListing))

module.exports = router