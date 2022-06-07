const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new Conversation

router.post("/", async (req,res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json({ok:true,message:"Conversation created successfully",responseObject: savedConversation});
    }catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
});

//get conv of a user

router.get("/:userId", async (req,res) => {
    try {
        const conversation = await Conversation.find({
            members: {$in:[req.params.userId]},
        });

        res.status(200).json({ok:true,message:"Conversation retrieved successfully",responseObject: conversation});
    } catch (error) {
        res.status(500).send(error);
    }
});

//get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req,res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
          });
          res.status(200).json({ok:true,message:"Conversation retreived successfully",responseObject: conversation});
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;
