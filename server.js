const connectDB = require('./config/db')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002
const Employee = require('./Model/employee')
const CORS = require('cors')

app.use(CORS())

app.use(express.json())

connectDB()

app.post('/send',async (req,res) => {
    const {empID,empName} = req.body

    try {
        let newObj = new Employee({empID,empName})
    await newObj.save()
    res.status(200).json({
        msg:'successfully sent the data'
    })
        
    } catch (error) {
        res.status(400).json({
            user_exist:'User already exist'
        })
        
    }
})

app.get('/empAll',async (req,res) => {
    try {
        let emp = await Employee.find({})
        res.status(200).json({
            msg:emp
        })
    } catch (error) {
        res.status(500).json({
            'Error':'Connectoin not found'
        })
        
    }
})

app.get('/emp/:empID',async (req,res) => {
    const {name} = req.query
    const {empID} = req.params
    console.log(name,"NAM")
    try {
        if(name === ''){
            let emp = await Employee.findOne({empID})
            if(emp){
                return res.status(200).json({msg:emp})
            }
            return res.status(500).json({msg:'Employee not found'})
        }
        let emp = await Employee.findOne({
            $and:[
                {empID:empID},
                {empName:name}
            ]
        })
        if(emp){
           return res.status(200).json({msg:emp})
        }else{
            return res.status(500).json({msg:'NOR',name})
        }

        
    } catch (error) {
        res.status(500).json({
            Error:'User not found'
        })
        
    }
})


app.listen(PORT,() => {
    console.log(`http://localhost:${PORT}/`)
})