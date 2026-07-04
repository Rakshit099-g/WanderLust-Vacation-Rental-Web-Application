const express = require("express")
const router =  express.Router()
const Listing = require("../models/Listing")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError")

const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")

const listingController = require("../controllers/listing.js") 

const {storage} = require("../cloudConfig.js")

const multer  = require('multer')
const upload = multer({storage})


/*
router.route() aur router.get(), router.post() me bas itna difference hai ki same URL ke multiple HTTP methods ko ek jagah group kar deta hai.
*/

//Index Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    validateListing,
    upload.single("listing[image]"),// upload.single() is a middleware provided bu multer
    wrapAsync(listingController.createListing))

//Create route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//search destination 
router.get("/search",wrapAsync(listingController.findLocationListing))

//show route 
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.patch(isLoggedIn,isOwner,validateListing, upload.single("listing[image]"),wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner ,wrapAsync(listingController.destroyListing))//DELETE  (baad m humne relationship with database wala bhi kaam kiya ki jab listing delete ho toh uske corresponding review m se uss listing ki data bhi delete ho jo ki post middleware handle kiya hai in Listing.js m)


//Update 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//for filters
router.get("/category/:category",wrapAsync(listingController.findCategory))

module.exports = router