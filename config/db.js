const { default: mongoose } = require('mongoose')
const monggose = require('mongoose')
require('dotenv').config()

const {DB_USER,DB_PASSWORD} = process.env

let dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.cltye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL).then(function(){
            console.log('DB succesfully connected')
        })
    } catch (error) {
        
    }
}

module.exports = connectDB