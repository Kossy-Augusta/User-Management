require("dotenv").config();
const connectDB = require('./config/dbCon');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/cos-options')
const usersRoute = require("./routes/api");
const authRoute = require("./routes/auth");
const PORT = process.env.PORT || 3600
// connect DB
connectDB();
app.use(express.urlencoded({ extended: false }));
// cross origin resource sharing
app.use(cors(corsOptions));
// json middleware
app.use(express.json());
app.use(cookieParser())

app.use("/user", usersRoute);
app.use("/user", authRoute);

mongoose.connection.once('open', ()=>{
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})