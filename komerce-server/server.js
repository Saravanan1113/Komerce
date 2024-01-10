const mongoose = require('mongoose');
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connected Successful!'));

// const store = new MongoDBStore({
//     uri: DB,
//     collection: "mySessions",
// });

// app.use(
//     session({
//         secret: "mohamedkomerce",
//         resave: false,
//         saveUninitialized: false,
//         store: store,
//     })
// );

// app.get("/user/sesssions", (req, res) => {
//     if(req.session.user){
//         req.session.user.loggedIn = true;

//         res.send({...req.session.user});
//     }else{
//         res.send({loggedIn: false})
//     }
// })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
})