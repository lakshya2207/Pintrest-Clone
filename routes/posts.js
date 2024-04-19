const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    //   username: { type: String, required: true },
    userid: {type:mongoose.Schema.Types.ObjectId},
    image:{type:String},
    postText: { type: String },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
