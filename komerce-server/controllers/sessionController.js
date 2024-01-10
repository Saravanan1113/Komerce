const dotenv = require('dotenv');
const catchAsync = require('./../utils/catchAsync');

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

exports.deleteSession = catchAsync(async(req, res, next) => {
    console.log(DB)
});