require("dotenv").config();
const connectDB = require('./config/dbCon');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3600

connectDB();

mongoose.connection.once('open', ()=>{
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})