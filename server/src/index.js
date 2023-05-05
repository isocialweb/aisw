require("dotenv").config();

const express = require("express");
const {connectDB} = require("./database");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");


let port = process.env.PORT ?? 8080;

if(process.env.NODE_ENV !== 'test'){
    connectDB().then((error) => {
        if(error){
            console.log(error);
        }else{
            console.log('🏢 Connected to database!');
        }
    });
}else{
    port = process.env.TEST_PORT
}

const app = express();


const generalRouter = require("./routers");

app.use(cors({
    origin: true, 
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(generalRouter);

const server = app.listen(port, () => {
  console.log(`Server is up and running at port ${port} ⚡`);
});

module.exports = {server, app}