const router = require("express").Router();
const User = require("../models/User");
const verifyToken = require("./TokenAuth")

//get user details by Id
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


//update user details
router.put("/update/user", verifyToken, async (req,res) => {
    try {
        if(req.body.profilePicture!==undefined && req.body.profilePicture!==null && req.body.profilePicture!== ""){
            await User.updateOne({_id:req.body.id},{$set:{profilePicture:req.body.profilePicture}});
        }
        if(req.body.occupation!==undefined && req.body.occupation!==null && req.body.occupation!== ""){
            await User.updateOne({_id:req.body.id},{$set:{occupation: req.body.occupation}});
        }
        if(req.body.interests!==undefined && req.body.interests!==null && req.body.interests.length!==0){
            await User.updateOne({_id:req.body.id},{$set:{interests: req.body.interests}});
        }
        if(req.body.username!==undefined && req.body.username!==null && req.body.username!== ""){
            await User.updateOne({_id:req.body.id},{$set:{username:req.body.username}});
        }
        if(req.body.desc!==undefined && req.body.desc!==null && req.body.desc!== ""){
            await User.updateOne({_id:req.body.id},{$set:{desc:req.body.desc}});
        }

        const user = await User.findById(req.body.id);
        res.status(200).json({ok:true, message:"User updated Successfully", responseObject:user});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

//find user by occupation
router.get("/category", async (req,res) => {
    try {
        let user;
        let categories = req.query.cat.split(" ");
        let category = ".*";
        for(let i=0;i<categories.length;i++){
            category+=categories[i]+".*";
        }
        console.log(category);
        if(req.query.cat==="general"){
            console.log("Went in general");
            user = await User.find({}).exec();
        }else{
            console.log("went in category")
            user = await User.find({occupation:{$regex: category, $options: 'i'}}).exec();
        }
        // console.log(forum);
        res.status(200).json({ok:true,message:"retrieved forums successfully",responseObject:user});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//Search user using email or username
router.post("/user/find",verifyToken, async (req,res) =>{
    try{
        let userFromDB;
        if(req.body.username) {
            userFromDB = await User.findOne({username:req.body.username});
        }else if(req.body.email){
            userFromDB = await User.findOne({email:req.body.email});
        }
        
        if(!userFromDB){
            res.status(200).json({ok:false,message:"No user found with given credentials"});
            return;
        }
        const {password,...others} = userFromDB._doc;
        res.status(200).json({ok:true,message:"user found",responseObject:[others]});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

//delete a user account
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


//follow a user
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

//unfollow a user
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