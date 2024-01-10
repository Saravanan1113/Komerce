module.exports = (req, res, next) => {
    console.log(req.data)
    // console.log(req.session.isAuth)
  if (req.session.isAuth) {
      console.log("Entered")
    next();
  } else {
      console.log("elsepart")
      req.session.error = "You have to Login first";
    // res.redirect("/login");
  }
};

// const isAuth = async(req, res, next) =>{
//     MongoCli
// }
// module.exports = isAuth;