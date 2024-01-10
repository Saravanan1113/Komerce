// const express = require('express');
// const mongoose = require('mongoose')
// const mongo = require('mongodb').MongoClient;
// const dotenv = require('dotenv');

// dotenv.config({path: './config.env'});
// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

// const logoutRoute = express.Router();
// const Schema = mongoose.Schema
// let sessionId

// logoutRoute.delete("/mySessions", async(req, res) => {
//     console.log(req.session)
//     // req.session.destroy((err) => {
//     //     if (err) throw err;
//     //     else console.log("session removed")
//     // }); 
//     // req.session.destroy();
//     // res.clearCookie('connect.sid');
//     // req.session.destroy(err => {
//     //     res.clearCookie('connect.sid').send('cleared cookie');
//     //     console.log("cleared")
//     // })
//     mongo.connect(DB).then((client) => {
//         const connect = client.db("komercedb")
//         connect.collection("mySessions").drop(function(err, delOk){
//             if(err) throw err;
//             if(delOk) console.log("Deleted")
//         })
//     })
//     res.status(204).json({
//         status: 'success',
//         data:null
//     });
// })

// logoutRoute.patch("/mySessions/", async(req, res) => {
//     console.log(req.body)
//     // mongo.connect(DB).then((client) => {
//     //     const connect = client.db("komercedb")
//     //     connect.collection("mySessions").findByIdAndUpdate(req.params.id, req.body, {
//     //         new: true,
//     //         runValidators: true
//     //     })
//     // })
// })

// logoutRoute.patch('/sessionUpdate', async(req, res) => {
//     // console.log("Entered")
//     console.log(req.body)
//     // mongo.connect(DB).then((client) => {
//     //             const connect = client.db("komercedb")
//     //             connect.collection("mySessions").findByIdAndUpdate(req.params.id, req.body, {
//     //                 new: true,
//     //                 runValidators: true
//     //             })
//     //         })
//     // const testCollectionSchema = new Schema({}, { strict: false })
//     // const TestCollection = mongoose.model('test_collection', testCollectionSchema)
//     // let body = req.body
//     // const testCollectionData = new TestCollection({cartId: req.body.cartId})
//     // await testCollectionData.save()
//     // return res.send({
//     //     "msg": "Data Saved Successfully"
//     // })
// })

// module.exports = logoutRoute;