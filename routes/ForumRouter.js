const router = require("express").Router();
const res = require("express/lib/response");
const Forum = require("../models/Forum");
const User = require("../models/User");
const verifyToken = require("./TokenAuth");

//get forum by id
router.get("/forum/:id", async (req,res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        res.status(200).json({ok:true,message:"forum retrieved successfully",responseObject:forum});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//get forums joined by particular user
router.get("/user", async (req,res) => {
    try {
        const user = await User.findById(req.query.id);
        if(user.forumsJoined.length==0){
            res.status(200).json({ok:true,message:"forums retrieved successfully",responseObject:[]});
            return
        }
        const forum = await Promise.all(
            user.forumsJoined.map((id) => {
                return Forum.findById(id);
            })
        ); 

        res.status(200).json({ok:true,message:"forums retrieved successfully",responseObject:forum});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//find forums by category
router.get("/category", async (req,res) => {
    try {
        let forum;
        let categories = req.query.cat.split(" ");
        let category = ".*";
        for(let i=0;i<categories.length;i++){
            category+=categories[i]+".*";
        }
        console.log(category);
        if(req.query.cat==="general"){
            console.log("Went in general");
            forum = await Forum.find({}).exec();
        }else{
            console.log("wemt in category")
            forum = await Forum.find({category:{$regex: category, $options: 'i'}}).exec();
        }
        // console.log(forum);
        res.status(200).json({ok:true,message:"retrieved forums successfully",responseObject:forum});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//find forums by tags
router.get("/tags", async (req,res) => {
    try {
        const forum = await Forum.find({$In:{tags:req.query.tag}}).exec();
        console.log(forum);
        res.status(200).json({ok:true,message:"retrieved forums successfully",responseObject:forum});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//create a forum
router.post("/forum", verifyToken,  async (req,res) => {
    try {
        let newForum = new Forum({
            forumName: req.body.forumName,
            desc: req.body.desc,
            owner: req.user.userId,
            admin:[req.user.userId],
            tags: req.body?.tags,
            category: req.body?.category
        });

        const forum = await newForum.save();
        res.status(200).json({ok:true,message:"Forum created successfully",responseObject:forum});
    } catch (error) {
        console.log(error);
        res.send(500).send(error);
    }
});

//join a forum
router.put("/join/:id", verifyToken, async (req,res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        if(forum.members.includes(req.user.userId)){
            res.status(401).json({ok:false,message:"you have already joined the forum"});
        }else{
            await forum.updateOne({$push:{members:req.user.userId}});
            await user.updateOne({$push:{forumsJoined:forum._id}});
            res.status(200).json({ok:true,message:"Joined the forum successfully"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//leave a forum
router.put("/leave/:id", verifyToken, async (req,res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        if(!forum.members.includes(req.user.userId)){
            res.status(401).json({ok:false,message:"you have already not joined the forum"});
        }else{
            await forum.updateOne({$pull:{members:req.user.userId}});
            await user.updateOne({$pull:{forumsJoined:forum._id}});
            res.status(200).json({ok:true,message:"unfollowed the forum successfully"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//make user as admin
router.put("/makeadmin/:id", verifyToken, async (req,res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        if(forum.admin.includes(req.user.userId)){
            await forum.updateOne({$push:{admin:req.body.id}});
            res.status(200).json({ok:true,message:"User is also made admin"});
        }else{
            res.status(401).json({ok:false,message:"you are not an admin of the forum"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;