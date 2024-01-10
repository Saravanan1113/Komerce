const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// let isAuth = require('../middleware/is-auth');
const mongo = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }).catch(err => {
        console.log("erroris ",err.name)
        if (err.name === 'ValidationError'){
            // console.log("new errror", err)
            // error = Object.values(err.errors).map(val => val.message)
            // console.log(error)
            // if(error.join().includes("Please provide a")){
            //     const message = "Please provide a "+error.join().replaceAll("Please provide a ", " ")
            //     res.status(500).json({
            //         status: message
            //     })
            // }else{
            //     res.status(500).json({
            //         status: error.join()
            //     })
            // }
            res.status(500).json({
                status: err.errors
            })
        }
        if(err.name==="MongoError"){
            res.status(500).json({
                status: "Email id already Exists!"
            })
        }
    })

    if(newUser){
        const token = signToken(newUser._id);
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    }
});

exports.login = catchAsync(async (req, res, next) => {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    // 1) Check if email exist
    if (!email) {
        res.status(400).json({
            status: 'Please provide email!'
        })
    }

    // 2) Check if password exist
    else if(!password){
        res.status(400).json({
            status: 'Please provide password!'
        })
    }

    // 2) Check if user exists && password is correct   
    else if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: 'Incorrect email or password',
        });
    }

    // 3) If everything ok, send token to client
    else{
        const userData = {
            userId: user._id,
            email: user.email,
            role: user.role,
            cartId: user.cart_id
        }
        req.session.user = userData
        console.log(req.sessionID)
        const sessionId = req.sessionID
        res.status(200).json({
            status: 'success',
            data:{
                userData
            },
            sessionId,
        })
    }
    
});

// exports.session = ("/user/sessions", async(req, res) => {
//     console.log(req.session.user)
//     // console.log(req.session)
//     if(req.session.user){
//         req.session.isAuth = true;

//         res.send({...req.session.user});
//     }else{
//         res.send({isAuth: false})
//     }
// })

// exports.createProduct = catchAsync(async (req, res,next) => {
//     console.log("Entered")
//     const newProduct = await Product.create({
//         product_name: req.body.product_name,
//         sku: req.body.sku,
//         price: req.body.price,
//         description: req.body.description,
//         image: req.body.image,
//         inventory: req.body.inventory,
//         product_status: req.body.product_status
//     }).catch(err => {
//         console.log("Entered")
//         console.log("error is", err)
//     })

//     // console.log(newProduct);

//     // res.status(201).json({
//     //     status: 'success',
//     //     data: {
//     //         product: newProduct
//     //     }
//     // })
// })

exports.logout = catchAsync(async(req, res) => {
    console.log("Logout function")
    mongo.connect(DB).then((client) => {
        const connect = client.db("komercedb")
        connect.collection("mySessions").drop(function(err, delOk){
            if(err) throw err;
            if(delOk){
                req.session.destroy(() => {
                    console.log("Deleted");
                    res.clearCookie("userId", {
                        path:"/",
                        httpOnly: true,
                    }).sendStatus(200)
                })
            }
        })
        // if(req.session && req.session.user){
        //     const datas = client.collection("mySessions").deleteOne({_id: req.session.user._id})
        // }
        // req.session.destroy(() => {
        //     console.log("Deleted");
        //     res.clearCookie("userId", {
        //         path:"/",
        //         httpOnly: true,
        //     }).sendStatus(200)
        // })
    })
    // res.status(204).json({
    //     status: 'success',
    //     data:null
    // });
})