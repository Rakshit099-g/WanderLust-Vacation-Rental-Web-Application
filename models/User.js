const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");
//Schema me password field mat banao. passport-local-mongoose password ko hash aur salt me convert karke save karta hai, aur username bhi automatically add kar deta hai.

/*Before Plugin

email

After Plugin

email
username
hash
salt
register()
authenticate()
serializeUser()
deserializeUser()
*/

let userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
userSchema.plugin(passportLocalMongoose.default)
module.exports = mongoose.model("User",userSchema)
