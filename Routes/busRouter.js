const express = require('express')
const app = express()
const Router = express.Router()
const Bus = require('../Model/BusDetails')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {SEC_KEY} = process.env

// Router.get('/bus', async (req,res) => {
//     const today = new Date().toISOString().split("T")[0]
//     console.log(today)
//     res.status(200).json({
//         msg:'Bus details'
//     })
// })

Router.post('/bus', async (req,res) => {
    try {
        const {bus_name,from,to,bus_type,schedule,date} = req.body
        const isAdd = await Bus.findOne({$and:[{bus_name,from,to,date}]})
        if(isAdd){
            throw new Error('Bus Details alredy exist please once check it!')
        }
        const AddBus = new Bus({bus_name,from,to,bus_type,schedule,date})
        const add = await AddBus.save()
        res.status(200).json({
            msg:'Added bus details',
            bus_detail:add
        })
        
    } catch (error) {
        res.status(500).json({
            msg:'Something went wrong with data',
            Error:error.message
        })
        
    }
})

Router.get('/busDetails', async (req,res) => {
    const bus = await Bus.find()
    res.status(200).json({
        msg:bus
    })
})

Router.get('/busDetail', async (req,res) => {
    const {from,to,date} = req.query
    try {
        const token = req.headers['authorization']
        const splitToken = token.split(' ')[1]
        if(!token){
            return res.status(500).json({
                msg:'User not authorized'
            })
        }
        jwt.verify(splitToken,SEC_KEY, async (error,user) => {
            if(error){
                return res.status(404).json({
                    msg:'Invalid Token'
                })
            }else{
                const bus = await Bus.find({from,to,date})
                res.status(200).json({
                    msg:'Bus details',
                    detail:bus
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            msg:error.message,
            user:'User not Log'
        })
        
    }
})

module.exports = Router