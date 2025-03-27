const mongoose = require('mongoose')

const BusDetails = new mongoose.Schema({
    bus_name:{type:String},
    from:{type:String, required:true},
    to:{type:String, required:true},
    bus_type:{type:String,enum:['A/C Sleeper','Non A/C sleeper'],default:'A/C Sleeper'},
    schedule:{type:Array, required:true},
    date:{type:String, required:true,validate:{
        validator:function(value){
            const selectedDate = new Date(value)
            const today = new Date()
            today.setHours(0,0,0,0)
            return selectedDate >= today;
        },
        message:"Date cannot be in the past"

    }}
})

// BusDetails.index({date:1,bus_name:1},{unique:true})

module.exports = mongoose.model("BusDetails",BusDetails)