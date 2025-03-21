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
    const {name,email,password,EMPID} = req.body
    let isEmp = await Employee.findOne({
        $and:[
            {empID:EMPID},
            {empName:name}
        ]
    })
    let isEmpName = await Employee.findOne({empName:name})
    let isEmpId = await Employee.findOne({empID:EMPID})
    try {
        if(isEmp){
            let payload = {user:name}
            let jwtToken = jwt.sign(payload,SEC_KEY)
            const optUser = new User({name,email,password,EMPID,userType:'WEMP'})
            let heisreg = await User.findOne({
                $and:[
                    {name},
                    {EMPID},
                    {email}
                ]
            })
            if(!heisreg){
                let saveStatus = await optUser.save()
                res.status(200).json({
                    msg:'saved as employee user',
                    token:jwtToken,
                    type:saveStatus.userType
                })
            }else{
                res.status(200).json({
                    msg:'Already saved',
                    token:jwtToken,
                    type:heisreg.userType
                })
            }

            
        }else{
            if(isEmpName && !isEmp){
                return res.status(500).json({
                    msg:'Employee ID not found',
                    ID:EMPID
                })
            }
            else if(isEmpId && !isEmp){
                return res.status(500).json({
                    msg:'Employee Name not found',
                    Name:name
                })
            }else{

                const empUser = new User({name,email,password,EMPID,userType:'WUSR'})
                let saveEmpUsr = await empUser.save()
                
                return res.status(200).json({
                    msg:'saved as normal user',
                    user:'saveEmpUsr',
                    type:saveEmpUsr.userType
                })
            }
        }
        
    } catch (error) {
        res.status(500).json({
            msg:'User already exist or User not found',
            err:error.error
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