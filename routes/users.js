const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plm = require("passport-local-mongoose");
require('dotenv').config()
const dbUrl = process.env.connection_string;
// mongoose.connect("mongodb://localhost:27017/pin");

// mongoose.connect("")

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  // name: { type: String},
  email: { type: String, required: true, unique: true },
  dp: { type: String ,default:null},
  password: { type: String},
  fullname: { type: String },
  posts: [{ type: Schema.Types.ObjectId, default:[],ref:"Post" }]
});
userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);


