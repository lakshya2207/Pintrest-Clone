var express = require('express');
var router = express.Router();
var userModel = require("./users");
var postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer")

// const plm = require("passport-local-mongoose");

// const localStrategy = require("passport-local");
// passport.use(new localStrategy(userModel.authenticate()))

// add these two Lines at top

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

// register route
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/profile",isLoggedIn,async (req, res,next)=> {
  const user = await userModel.findOne({username:req.session.passport.user}).populate("posts");
  console.log(user);
  res.render("profile",{user})
})
router.get("/login", (req, res) => {
  // console.log(req.flash("error"));

  res.render("login", { error: req.flash("error"),title: 'Login to your Account'  })
})

router.get("/feed",isLoggedIn, (req, res) => {
  res.render("feed", { title: 'Express' })
})

router.post("/upload",upload.single("file"),async(req,res)=>{
  if(!req.file){
    return res.status(400).send("No files were uploaded.")
  }
  const user = await userModel.findOne({username:req.session.passport.user  });
  const post=  await postModel.create({
    image:req.file.filename,
    userid: user._id,
    postText: req.body.postText,
    // createdAt: Date.now 
  })
  user.posts.push(post._id);
  await user.save()
  res.redirect("/profile")
})



router.post('/register', function (req, res) {
  
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname:req.body.fullname,
    password: req.body.password,
 });
   console.log("req.body : " , req.body);
   console.log("userData: " , userData);
  //  res.send("Registered")
  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      })
    });

})

router.post("/login", passport.authenticate("local", {  
  successRedirect: "/profile",
   failureRedirect: "/login",
   failureFlash:true
}) 
 , function (req, res) { 
    console.log(req.body,"lallu");
  });
// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) {
//       console.log('Authentication failed:', info.message,user);
//       return res.redirect('/login');
//     }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/profile');
//     });
//   })(req, res, next);
// });




router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
    }
  res.redirect("/");
  }
// /* GET home page. */
// router.get('/', function (req, res, next) {
//   req.session.banned = false;

//   res.render('index', { title: 'Express' });
// });

// router.get('/createuser', async function (req, res, next) {
//   let createdUser = await userModel.create({
//     username: "lakshya",
//     email: "lakshya1928@gmail.com",
//     dp: "https://yt3.ggpht.com/M8HHa-4HpA1tPBYyCclC5JmOA7vx77XryhQe_0_4L9bCfpYwiDr7uJc3bOb9UZKJpogSC9OvA=s48-c-k-c0x00ffffff-no-rj",
//     password: "harsha",
//     name: "Lakshya ",
//     posts: []
//   })
//   console.log(createdUser)
//   res.send(createdUser)
// });


// router.get('/createpost', async function (req, res, next) {
//   let createdpost = await postModel.create({
//     postText: "aurlondes",
//     user: "6618717627275a36fab30a04"

//   });

//   let user = await userModel.findOne({ _id: "6618717627275a36fab30a04" });
//   user.posts.push(createdpost._id);
//   await user.save();
//   // console.log(newpost);
//   res.send(createdpost)
// });


// router.get('/allpost', async function (req, res, next) {
//   let allpost = await postModel.find({ user: "6618717627275a36fab30a04" })
//   console.log(allpost);
//   res.send(allpost)
// });


// router.get("/toggleban", (req, res) => {
//   if (req.session.ban == true) {
//     req.session.ban = false;
//   }
//   else {
//     req.session.ban = true;
//   }
//   res.send("done")
// })
// router.get("/checkban", (req, res) => {
//   if (req.session.ban == true) {
//     res.send("banned ")
//   }
//   else {
//     res.send("not banned ")
//     req.session.ban = true;
//   }
// })

module.exports = router;
