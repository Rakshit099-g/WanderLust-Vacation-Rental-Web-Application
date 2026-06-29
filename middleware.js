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

/*
ye method passport.session aur passport.initialize le aate hai
Passport har request ke saath req object ko kuch extra methods de deta hai:
 req.login()
 req.logout()
 req.isAuthenticated()
 req.user
*/