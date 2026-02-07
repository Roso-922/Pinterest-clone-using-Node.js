const mongoose = require("mongoose")


const postschema = mongoose.Schema({
  user :{
   type:mongoose.Schema.Types.ObjectId,
   ref:"user"
  },
  tittle : String,
  description : String,
  image:String
 
})
module.exports = mongoose.model('post', postschema );
