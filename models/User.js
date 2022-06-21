const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required: true,
            min: 3,
            max:20,
            unique: true
        },
        email:{
            type:String,
            required:true,
            max:50,
            unique: true
        },
        password:{
            type: String,
            required:true,
            min:6
        },
        profilePicture:{
            type:String,
            default:"/no_avatar_TYi8DXgbZ.png"
        },
        coverPicture:{
            type:String,
            default:"/forum_cover_pic1_ahfvSCfAo.jpg"
        },
        followers:{
            type:Array,
            default:[]
        },
        followings:{
            type:Array,
            default:[]
        },
        desc:{
            type:String,
            max:500,
            default:""
        },
        interests:{
            type:Array,
            default:[]
        },
        forumsJoined:{
            type:Array,
            default:[]
        },
        occupation: {
            type:String,
            default:""
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);