const { Schema, Types } = require("mongoose");

const ChatSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    username: { type: String, required: false },
    title: { type: String, required: true },
    language_code: String,
    commands_response: { type: Map, of: String },
    commands_entities: { type: Map, of: Array },
    // config: { type: Map, of: String },
    users: { type: Array, of: Types.ObjectId },
    total_messages: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = ChatSchema;
