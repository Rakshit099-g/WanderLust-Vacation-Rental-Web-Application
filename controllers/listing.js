const Listing = require("../models/Listing")

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({})
     res.render("listings/index.ejs", { allListing }); 
    
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path
    let filename = req.file.filename


    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = {url,filename}
    await newListing.save()
    console.log(newListing)
    req.flash("success","Listing is created successfully!")
    res.redirect("/listings")
}

module.exports.showListings = async (req,res)=>{
    const {id} = req.params
    /* const listing = await Listing.findById(id).populate("reviews").populate("owner")
    
    abhi tak hum kewal owner of listing ko populate kr rhe the lekin ab hum nested populate k through each reviews k author ko bhi populate krenge 
    */
   const listing = await Listing.findById(id)
   .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner")
    console.log(listing)
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}


module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing does not Exists!")
        return res.redirect("/listings")
    }
    let originalImage = listing.image.url
    originalImage = originalImage.replace("/upload","/upload/c_fill,w_250") //image k pixel ko change krne k liye aur previously uploaded image ko show krne k liye
    res.render("listings/edit.ejs",{listing,originalImage})
}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true})//yaha urlencoded wala data req.body m aa jayega 
    
    //image edit form se update krne k liye
    

    if(typeof req.file!== "undefined"){ //image edit form m required nhi hai toh ho skta hai ki blank hi reh jaye issiliye aur agar hum phir save kr diye toh existing image update hokar null image rhega issiliye hum tab hi update renge jab file hoga
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url,filename}
        await listing.save()
    }

    req.flash("success","Updated Successfully!")
    res.redirect(`/listings/${id}`)

}
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Deleted Successfully!")
    res.redirect("/listings")
}