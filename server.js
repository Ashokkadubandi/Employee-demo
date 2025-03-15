const connectDB = require('./config/db')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002
const User = require('./Model/userAuth')
const Employee = require('./Model/employee')
const CORS = require('cors')

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
        if(isEmp !== null){
            const optUser = new User({name,email,password,EMPID,userType:'WEMP'})
            let saveStatus = await optUser.save()
            res.status(200).json({
                msg:'saves as employee user'
            })
        }else{
            if(isEmpId === null && isEmpName && EMPID !== ''){
                return res.status(500).json({
                    msg:'ID NOT MATCH'
                })
            }else if(isEmpName === null && isEmpId && EMPID !== ''){
                return res.status(500).json({
                    msg:'NAME NOT MATCH'
                })
    
            }else if(isEmpName === null && isEmpId === null && EMPID !== ''){
                return res.status(500).json({
                    msg:'NOT AN EMPLOYEE'
                })
            }else if(isEmpName !== null && isEmpId !== null && EMPID !== '' && isEmp === null){
                return res.status(500).json({
                    msg:'Employee details are not valid'
                })
            }
            else{
                const empUser = new User({name,email,password,EMPID,userType:'WUSR'})
                let saveEmpUsr = await empUser.save()
                res.status(200).json({
                    msg:'saved as normal user',
                    user:'saveEmpUsr'
                })
            }
        }
        
    } catch (error) {
        res.status(500).json({
            msg:'Connection Error',
            Err:error
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