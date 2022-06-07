const router = require("express").Router();
const Post = require("../models/Posts");
const Comment = require("../models/Comment");
const verifyToken = require("./TokenAuth");
const User = require("../models/User");

//personalised post list for a user home page
router.get("/home", verifyToken, async (req,res) => {
    try {
        const user = await User.findById(req.user.userId);
        if(user.followings.length==0 && user.forumsJoined.length==0){
            res.status(200).json({ok:false,message:"follow someone or join in a forum to view posts from them"});
        }else{
            let followingPosts=[];

            followingPosts = await Promise.all(
                user.followings.map((id) => {
                    return Post.find({owner:id}).exec();
                })
            ); 
            console.log(followingPosts);
            let forumPosts = await Promise.all(
                user.forumsJoined.map((id) => {
                    return Post.find({forum: id}).exec();
                })
            );
            followingPosts.push(forumPosts);

            res.status(200).json({ok:true,message:"successfully retrieved post",responseObject:followingPosts});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//get posts of particular user
router.get("/user/:id", async (req,res) => {
    try {
        const posts = await Post.find({owner:req.params.id}).exec();
        res.status(200).json({ok:true,message:"Post retrieved successfully",responseObject:posts});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

//get posts of particular forum
router.get("/forum/:id", verifyToken, async (req,res) => {
    try {
        const posts = await Post.find({forum:req.params.id}).exec();
        res.status(200).json({ok:true,message:"Post retrieved successfully",responseObject:posts});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//Upload a post
router.post("/upload", verifyToken, async (req,res) => {
    try{
        const newPost = new Post({
            caption: req.body.caption,
            owner: req.user.userId,
            postType: req.body.postType,
            postUrl: req.body.postUrl,
            tags: req.body.tags,
            forum: req.body.forum,
            contents: req.body.contents
        })
        
        const post = await newPost.save();
        res.status(200).json({ok:true,message:"Post created successfully",responseObject: post});
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

//Like a post
router.put("/:id/like", verifyToken, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.includes(req.user.userId)){
            res.status(401).json({ok:false,message:"already liked the post"});
        }else{
            await post.updateOne({$push:{likes:req.user.userId}});
            res.status(200).json({ok:true,message:"Post Liked successfully"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


//Unlike a post
router.put("/:id/unlike", verifyToken, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.user.userId)){
            res.status(401).json({ok:false,message:"Like the Post first"});
        }else{
            await post.updateOne({$pull:{likes:req.user.userId}});
            res.status(200).json({ok:true,message:"Post unLiked successfully"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(err);
    }
});


//comment a post
router.post("/:id/comment", verifyToken, async (req,res) => {
    try {
        const newComment = new Comment({
            desc: req.body.desc,
            owner: req.user.userId,
            post: req.params.id
        });

        const comment = await newComment.save();
        const post = Post.findById(req.params.id);
        await post.updateOne({$push:{comments:comment._id}});
        res.status(200).json({ok:true,message:"commented successfully",responseObject: comment})
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;