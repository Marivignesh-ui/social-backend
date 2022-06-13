const router = require("express").Router();
const User = require("../models/User");
const verifyToken = require("./TokenAuth")

router.get("/user/:id", verifyToken, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        !user && res.status(404).json({ok:false,message:"No user found with given credential"});
        if(!user) return;
        const {password, ...others}=user._doc;
        res.status(200).json({ok:true,message:"user retrieved successfully",responseObject:others});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});


router.post("/user/find",verifyToken, async (req,res) =>{
    try{
        let userFromDB;
        if(req.body.username) {
            userFromDB = await User.findOne({username:req.body.username});
        }else if(req.body.email){
            userFromDB = await User.findOne({email:req.body.email});
        }
        
        if(!userFromDB){
            res.status(404).json({ok:false,message:"No user found with given credentials"});
            return;
        }
        const {password,...others} = userFromDB._doc;
        res.status(200).json({ok:true,message:"user found",responseObject:others});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete("/user/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        !user && res.status(404).json({ok:false,message:"No user found with given credentials"});
        
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ok:true,message:"user deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.put("/follow", verifyToken, async (req,res) => {
    try{
        console.log(req.user);
        const user = await User.findById(req.user.userId);
        const otherUser = await User.findById(req.query.id);
        if(!user.followings.includes(req.query.id)){
            await otherUser.updateOne({$push:{followers:req.body.id}});
            await user.updateOne({$push:{followings:req.query.id}});
            res.status(200).json({ok:true,message:"user has been followed"});
        }else{
            res.status(403).json({ok:false,message:"Already following the user"});
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.put("/unfollow", verifyToken, async (req,res) => {
    try{
        const user = await User.findById(req.user.userId);
        const otherUser = await User.findById(req.query.id);
        if(user.followings.includes(req.query.id)){
            await otherUser.updateOne({$pull:{followers:req.body.id} });
            await user.updateOne({$pull:{followings:req.query.id}});
            res.status(200).json({ok:true,message:"user has been unfollowed"});
        }else{
            res.status(403).json({ok:false,message:"Already you are not following the user"});
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router;