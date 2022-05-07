const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    forum: {
        type: String,
        default: null
    },
    postType: {
        type: String,
        required: true
    },
    postUrl: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: [],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Post",PostSchema);