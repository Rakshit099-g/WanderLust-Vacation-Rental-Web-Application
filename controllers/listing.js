const Listing = require("../models/Listing")

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const NodeGeocoder = require("node-geocoder") //map k liye taki coordinates ko store kra paye
const options = {
    provider:'openstreetmap'
}
const geocoder = NodeGeocoder(options)



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

    //map
    let computedGeometry = {
    type: "Point",
    coordinates: [77.2090, 28.6139] // Default Delhi if not found
    };
    const fullAddress = `${req.body.listing.location}, ${req.body.listing.country}`;
    const geoData = await geocoder.geocode(fullAddress)
    console.log(geoData)
    const newListing = new Listing(req.body.listing)
    if (geoData && geoData.length > 0) {
            newListing.geometery = {
                type: "Point",
                coordinates: [geoData[0].longitude, geoData[0].latitude]
            };
        } else {
            // Fallback Delhi coordinates
            newListing.geometery = {
                type: "Point",
                coordinates: [77.2090, 28.6139]
            };
        }
    

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
    // originalImage = originalImage.replace("/upload","/upload/c_fill,w_250") //image k pixel ko change krne k liye aur previously uploaded image ko show krne k liye
    if (originalImage.includes("res.cloudinary.com")) {
        originalImage = originalImage.replace(
            "/upload",
            "/upload/c_fill,w_250"
    );
}
    res.render("listings/edit.ejs",{listing,originalImage})
}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params

     let response = await maptilerClient.geocoding.forward(
        `${req.body.listing.location}, ${req.body.listing.country}`,
        { limit: 1 }
    );

    if (!response.features.length) {
        req.flash("error", "Invalid location, please try again!");
        return res.redirect(`/listings/${id}/edit`);
    }

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true})//yaha urlencoded wala data req.body m aa jayega 
    //req.body se geometery nhi mila isiliye extract kra alag se
    listing.geometery  = {
        type: "Point",
        coordinates: response.features[0].geometry .coordinates
    };

    //image edit form se update krne k liye
    
    if(typeof req.file!== "undefined"){ //image edit form m required nhi hai toh ho skta hai ki blank hi reh jaye issiliye aur agar hum phir save kr diye toh existing image update hokar null image rhega issiliye hum tab hi update renge jab file hoga
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url,filename}
        
    }
    await listing.save()

    req.flash("success","Updated Successfully!")
    res.redirect(`/listings/${id}`)

}
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Deleted Successfully!")
    res.redirect("/listings")
}
module.exports.findLocationListing = async (req,res)=>{
    let {location} = req.query
    const allListing = await Listing.find({
         $or: [
            {
                location: {
                    $regex: location,
                    $options: "i",
                },
            },
            {
                country: {
                    $regex: location,
                    $options: "i",
                },
            },
        ],
    });
    if (allListing.length === 0) {
        req.flash("error", "No listings found for this location.");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListing})
}

module.exports.findCategory = async (req,res)=>{
    let {category} = req.params
    let allListing = await Listing.find({category:category})
    if (allListing.length === 0) {
        req.flash("error", "No listings found for this category.");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListing})
}