const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        let userCheck = await User.findOne({email:req.body.email});
        userCheck && res.status(401).json({ok:false,message:"Email Id registered already!! Please Login"});

        userCheck = await User.findOne({username: req.body.username});
        userCheck && res.status(401).json({ok: false,message:"Username already taken please try with different one"});

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            desc: req.body.desc,
            interests: req.body.interests
        });

        const user = await newUser.save();

        const token = jwt.sign({
            user_id: user._id,
            email: user.email
        }, process.env.TOKEN_KEY,{
            expiresIn: "10m"
        });

        user.token=token;
        res.status(200).json({ok:true,message:"User registration success!!",responseObject:{token,...user._doc}});

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/login", async (req,res) => {
    try{
        const user= await User.findOne({email:req.body.email});
        console.log(user);
        if(user){
            const validpassword = await bcrypt.compare(req.body.password,user.password);

            if(validpassword){
                const token = jwt.sign({
                    userId:user._id,email:user.email
                },process.env.TOKEN_KEY,{
                    expiresIn:"10m"
                });
                res.status(200).json({ok:true,message:"Authentication successfull",responseObject:token});
            }else{
                res.status(401).json({ok:false,message:"Password incorrect"});
            }
        }else{
            res.status(400).json({ok:false,message:"user Id or email is invalid"});
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;