const allowedOrigins = require("./allowed-origin");

const corsOptions = {
    origin: {
        origin: (origin, callback)=>{
            if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null, true);
            }
            else{
                callback(new Error(`Not allowed by CORS`));
            }
        }
    },
    optionSuccessStatus: 200,
}

module.exports = corsOptions;