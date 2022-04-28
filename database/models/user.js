const { Schema } = require("mongoose")

const UserSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: String,
  full_name: String,
  language_code: String,
}, { timestamps: true })

module.exports = UserSchema
