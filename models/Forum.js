const mongoose = require("mongoose")

const ForumSchema = new mongoose.Schema(
    {
        forumName:{
            type:String,
            required:true
        },
        desc:{
            type: String,
            required: true
        },
        members:{
            type:Array,
            default:[]
        },
        owner: {
            type:String,
            required: true
        },
        admin:{
            type: Array,
            default:[]
        },
        posts:{
            type:Array,
            default:[]
        },
        tags:{
            type:Array,
            default:[]
        },
        category:{
            type:Array,
            default:[]
        }
    },{
        timestamps: true
    }
);

module.exports = mongoose.model("Forum",ForumSchema);