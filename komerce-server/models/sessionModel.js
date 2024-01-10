const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    
});

const MySession = new mongoose.model("MySession", sessionSchema);

module.exports = MySession;