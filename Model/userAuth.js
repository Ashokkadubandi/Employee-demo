const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    EMPID:{type:String},
    userType:{type:String}
})

module.exports = mongoose.model('BookUserAuth',userModel)