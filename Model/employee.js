const monggose = require('mongoose')
const EmployeesSchema = monggose.Schema({
    empID:{type:String,required:true,unique:true},
    empName:{type:String,required:true},

})
module.exports = monggose.model('Demo employee info',EmployeesSchema)