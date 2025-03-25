const connectDB = require('./config/db')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002
const User = require('./Model/userAuth')
const Employee = require('./Model/employee')
const jwt = require('jsonwebtoken')
const CORS = require('cors')
require('dotenv').config()
const {SEC_KEY} = process.env
app.use(CORS())

app.use(express.json())

connectDB()

app.post('/reg',async (req,res) => {

    try {
        const {name,email,password,EMPID} = req.body
        let alredyReg = await User.findOne({$and:[{name},{email}]})
        if(!alredyReg){
            let isRetEmp = await Employee.findOne({empID:EMPID})
            if(isRetEmp){
                let newUser = new User({name,email,password,EMPID,userType:'REMP'})
                let save_user = await newUser.save()
                res.status(200).json({
                    msg:'User succesfully registered as Retired emp'
                })
            }else{
                if(!isRetEmp && EMPID !== ''){
                    throw new Error('ID NOT MATCH')
                }
                let newUser = new User({name,email,password,userType:'NUSR'})
                let save_user = await newUser.save()
                res.status(200).json({
                    msg:'User successfully registered as normal'
                })
            }  
        }else{
            throw new Error('User already exist')
        }

    } catch (error) {
        res.status(500).json({
            err:error.message
        })
        
    }
})

app.post('/login', async (req,res) => {
    const {email,password} = req.body
    const isLogin = await User.findOne({
        $and:[{email},{password}]
    })
    if(isLogin){
        let jwtToken = jwt.sign({usr:email},SEC_KEY)
        res.status(200).json({
            token:jwtToken,
            msg:{user:{name:isLogin.name,email,type:isLogin.userType}}

        })
    }else{
        res.status(500).json({
            msg:'User not found'
        })
    }
})

app.get('/log', async (req,res) => {
    let data = await User.find()
    res.send(data)
})

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
                return res.status(200).json({msg:'EMP',USR:emp})
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
           return res.status(200).json({msg:'EMP',USR:emp})
        }else{
            return res.status(500).json({msg:'NOR',USR:emp})
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