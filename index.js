const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const userRoute = require("./routes/userRouter");
const authRoute = require("./routes/authRouter");
const postRoute = require("./routes/postRouter");
const forumRoute = require("./routes/ForumRouter");
const conversationRoute = require("./routes/conversationRouter");
const messageRoute = require("./routes/messageRouter");
const ImageKit = require('imagekit');
const cors = require('cors');
app.use(cors({origin:"*"}));

dotenv.config();

const PORT = process.env.PORT || 8800;

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("connected to mongodb");
}); 

//middleware
app.use(express.json(({limit: '50mb', extended: true})));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

app.get('/image', function (req, res) {
var result = imagekit.getAuthenticationParameters();
res.send(result);
});

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);
app.use("/api/forums",forumRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.get("/",(req,res)=>{
    res.send("server is running")
});

app.listen(PORT,()=>{
    console.log("Backend serverr is running!");
});