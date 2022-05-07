const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        desc:{
            type:String,
            required:true
        },
        owner:{
            type:String,
            required: true
        },
        post:{
            type:String,
            required:true
        },
        replies:{
            type:Array,
            default:[]
        }
    },{
        timestamps:true
    }
)

module.exports = mongoose.model("comment",CommentSchema);