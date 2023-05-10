const {Schema, model} = require('mongoose')

const promptSchema = new Schema({


promptTitle:{type:String},
prompt: {type:String},
department:{type:String},
user:{type:String, ref:"user"},
userName:{type:String, ref:"user"},
userEmail:{type:String, ref:"user"},
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date },



});

const Prompt = model("prompt", promptSchema)

module.exports = Prompt