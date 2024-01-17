var express = require('express');
var users=require('./users');
var router = express.Router();
const LocalStrategy=require("passport-local");
const passport = require('passport');
const upload= require("./multer");
const post = require('./postModel');
const { default: mongoose } = require('mongoose');
passport.use(new LocalStrategy(users.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/signup', function(req, res, next) {
  res.render('signup');
});
router.get('/add', function(req, res, next) {
  res.render('add');
});

router.get('/profile',isloggedIn ,async function(req, res, next) {
  const user= await users.
  findOne({username:req.session.passport.user}).
  populate('postdata');
  res.render ('profile',{user});
});
router.get('/all',isloggedIn ,async function(req, res, next) {
  const user= await users.
  findOne({username:req.session.passport.user}).
  populate('postdata');
  res.render ('allPosts',{user});
});

router.post('/fileupload',isloggedIn,upload.single("image"), async function(req, res, next) {
   const user= await users.findOne({username:req.user.username});
  user.profileImage=req.file.filename;
   await user.save();
   res.redirect('/profile')
});
router.post('/newpost',isloggedIn,upload.single("post"), async function(req, res, next) {
  const user= await users.findOne({username:req.user.username});
  var userpost=await post.create({
    image:req.file.filename,
    title:req.body.title,
    description:req.body.desc,
    u:user._id
  })    
  user.postdata.push(userpost._id);
   await user.save();
  res.redirect('/profile');
});

router.get('/wrong',function(req,res){
  res.send("wrong password or email");
}) 
router.post('/register',function(req,res){
   var userData= new users({
       username:req.body.username,
      email:req.body.useremail,
      DOB: req.body.DOB
   })
   users.register(userData,req.body.password)
   .then (function (registerdUser){
    passport.authenticate("local")(req,res,function(){
       res.redirect('/profile');
    })
   })
})  
router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/wrong"
}),function(req,res){});
 
router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})
function isloggedIn(req,res,next){
  if(req.isAuthenticated())  return next();
  else{
     console.log("error");
     res.redirect('/')
  }
}

module.exports = router;
