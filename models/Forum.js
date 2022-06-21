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
        displayPicUrl:{
            type:String,
            default:"/forum_avatar_fvHjRTolz.png"
        },
        coverPicUrl:{
            type:String,
            default:"/forum_cover_pic_Sgvs8hp8d.png"
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