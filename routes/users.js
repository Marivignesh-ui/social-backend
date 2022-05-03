const router = require("express").Router();
const User = require("../models/User");
const verifyToken = require("./TokenAuth")

router.get("/user/:id", verifyToken, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others}=user._doc;
        res.status(200).json(others);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});


router.post("/user/find",async (req,res) =>{
    try{
        let userFromDB;
        if(req.body.username) {
            console.log("went inside");
            userFromDB = await User.findOne({username:req.body.username});
        }else if(req.body.email){
            userFromDB = await User.findOne({email:req.body.email});
        }
        !userFromDB && res.status(404).json({ok:false,message:"No user found with given credentials"});
        const {password,...others} = userFromDB._doc;
        res.status(200).json({ok:true,message:"user found",responseObject:others});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

router.delete("/user/:id", async(req,res)=>{
    try{
        const user = User.findById(req.params.id);
        !user && res.status(404).json({ok:false,message:"No user found with given credentials"});
        
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ok:true,message:"user deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router;