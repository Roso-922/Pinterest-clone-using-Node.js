var express = require('express');
var router = express.Router();
var usermodel = require("./users");
var postmodel = require("./post");
var passport = require('passport');
var upload = require("./multer")
var LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(usermodel.authenticate()));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { nav:true });
});
router.get('/register', function(req, res, next) {
  res.render('register',{nav:true});
});
router.get('/add',async function(req, res, next) {
  const user = await usermodel.findOne({username:req.session.passport.user})
  res.render('add',{user,nav:false});
});
router.post('/createpost',isLoggedIn ,upload.single("postimage"),async function(req, res, next) {
  const user = await usermodel.findOne({username:req.session.passport.user})
  const post = await postmodel.create({
    user:user._id,
    tittle : req.body.tittle,
    description : req.body.description,
    image:req.file.filename
  })

  user.posts.push(post)
  await user.save()
  res.redirect("/profile")

  
});
router.get('/profile',isLoggedIn ,async function(req, res, next) {
  const user = 
  await usermodel
  .findOne({username:req.session.passport.user})
  .populate("posts")
  
  res.render('profile',{user,nav:false});
});
router.get('/feed',isLoggedIn ,async function(req, res, next) {
  const user = 
  await usermodel
  .findOne({username:req.session.passport.user})
  const posts = await postmodel.find()
  .populate("user")
  
  res.render('feed',{user,posts,nav:false});
});
router.get('/show',isLoggedIn ,async function(req, res, next) {
  const user = 
  await usermodel
  .findOne({username:req.session.passport.user})
  .populate("posts")
  
  res.render('show',{user,nav:false});
});
router.post('/fileupload',isLoggedIn ,upload.single("image"),async function(req, res, next) {
 const user = await usermodel.findOne({username:req.session.passport.user})
 user.profileimage = req.file.filename
  await user.save()
  res.redirect("/profile")
});
router.get("/logout",function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

router.post("/register",function(req,res){
  const data = new usermodel({
     username:req.body.username,
     email:req.body.email,
     contact:req.body.contact,
     name:req.body.name,
     
  })

  usermodel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.post("/login",passport.authenticate("local",{
  failureRedirect:"/",
  successRedirect:"/profile",
}))


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/")
}


module.exports = router;
