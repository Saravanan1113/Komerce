const express = require('express');
// import User from '../models/userModel';
// import catchAsync from '../utils/catchAsync';

const sessionRouter = express.Router();

// sessionRouter.post("/login", catchAsync(async(req, res) =>{
//     const {email, password} = req.body,
//     const user = await User.findOne()
// }));
sessionRouter.get("/user/sessions", async(req, res) => {
    console.log(req.session.user)
    console.log(req.sessionID)
    if(req.session.user){
        req.session.user.isAuth = true;

        res.send({...req.session.user});
    }else{
        res.send({isAuth: false})
    }
})

module.exports = sessionRouter;