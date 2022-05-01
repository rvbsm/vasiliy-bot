const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: String,
    full_name: String,
    language_code: String,
    ping: { type: Boolean, default: true },
    total_messages: { type: Map, of: Number },
  },
  { timestamps: true }
);

module.exports = UserSchema;
