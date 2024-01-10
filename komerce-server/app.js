// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded());
// app.use(cors());

// dotenv.config({path: './config.env'});
// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

// mongoose
//     .connect(DB, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log('DB Connected Successful!'));





// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`App is running on port ${port}...`);
// })
const express = require('express');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const morgan = require('morgan');
const cors = require('cors');
// const path = require('path')
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

const store = new MongoDBStore({
    uri: DB,
    collection: "mySessions",
    expires: 1000*60*60*24*30,
});
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const discountRouter = require('./routes/discountRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const paymentRouter = require('./routes/paymentRoutes');
// const logOutRouter = require('./routes/logoutRoutes');

const sessionRouter = require('./routes/sessionRoutes');

const app = express();

app.use(session({
    secret: "mohamed komerce secrete",
    key: "userId",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000, secure:false },
    store: store,
}));

// connectDatabase();

app.use(express.json());
app.use(cors({
    credentials: true, 
    origin: true,
}));
// app.use(express.static(`${__dirname}/public`));
app.use(morgan('tiny'));

app.use('/users',userRouter);
app.use('/products',productRouter);
app.use('/discounts',discountRouter);
app.use('/carts',cartRouter);
app.use('/orders',orderRouter);
app.use('/stripe',paymentRouter)
// app.get("/user/sessions", async(req, res) => {
//     console.log(req.session.user)
//     // console.log(req.session)
//     if(req.session.user){
//         req.session.isAuth = true;

//         res.send({...req.session.user});
//     }else{
//         res.send({isAuth: false})
//     }
// })
app.use(sessionRouter)
// app.use(logOutRouter)

module.exports = app;
