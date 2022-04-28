const { createConnection } = require("mongoose")
const models = require("./models")


const connection =
  createConnection(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .on("error", err => console.error(err))

const db = { connection }

Object.keys(models).forEach(collectionName => {
  db[collectionName] = connection.model(
    collectionName,
    models[collectionName]
  )
})

db.user.getData = async tg_user => {
  let id
  if (tg_user.id) id = tg_user.id
  else id = tg_user.id

  let user = await db.User.findOne({ id: id })

  if (!user) {
    user = new db.User()
    user.id = tg_user.id
  }

  return user
}

db.user.updateData = async tg_user => {
  const user = await db.User.getData(tg_user)

  user.first_name = tg_user.first_name
  user.last_name = tg_user.last_name
  user.username = tg_user.username
  user.updatedAt = new Date()
  await user.save()

  return user
}

db.chat.getData = async tg_chat => {
  let id
  if (tg_chat.id) id = tg_chat.id
  else id = tg_chat.id

  let chat = await db.Chat.findOne({ id: id })

  if (!chat) {
    chat = new db.Chat()
    chat.id = tg_chat.id
  }

  return chat
}

db.chat.updateData = async tg_chat => {
  const chat = await db.Chat.getData(tg_chat)

  chat.title = tg_chat.title
  chat.username = tg_chat.username
  chat.type = tg_chat.type
  chat.updatedAt = new Date()
  await chat.save()

  return chat
}

module.exports = {
  db: db,
  utils: require("./utils")
}
