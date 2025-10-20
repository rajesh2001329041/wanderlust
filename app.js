const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override")
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const ExpressError=require("./utils/ExpresError.js");
const  listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session =require("express-session");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const flash=require("connect-flash");
const passport=require("passport");
const LoacalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const swaggerUi =require('swagger-ui-express')
const swaggerDocument = require("./swagger.js");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
main()
    .then((res) => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.get("/", (req, res) => {
    res.redirect("/login");
});
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LoacalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log(req.user);
    next();
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India"
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("Sucessful testing");
// })

// review route




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
   let {statusCode=500,message="Something Went Wrong"}=err;
   res.render("error.ejs",{message});
  //  res.status(statusCode).send(message);

});

app.listen(3030, () => {
    console.log("app listening");
});

















