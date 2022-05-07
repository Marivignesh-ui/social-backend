const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/userRouter");
const authRoute = require("./routes/authRouter");
const postRoute = require("./routes/postRouter");

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true},()=>{
    console.log("connected to mongodb");
}); 

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);

app.listen(8800,()=>{
    console.log("Backend serverr is running!");
});