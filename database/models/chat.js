const { Schema } = require("mongoose")

const ChatSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  username: { type: String, required: false, unique: true },
  title: { type: String, required: true },
  language_code: String,
  commands_response: { type: Map, of: String },
  commands_entities: { type: Map, of: Array },
  // config: { type: Map, of: String },
}, { timestamps: true })


module.exports = ChatSchema
