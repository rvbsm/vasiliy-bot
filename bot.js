const { Telegraf, Composer } = require("telegraf")
const I18n = require("telegraf-i18n")
const path = require("path")
const { db } = require("./database")
const { updateUser, updateChat } = require("./database/utils")
const { handleStart, handleHelp, handleLang, handleEditCommand, handleCommand, handleListCommands } = require("./handlers")
const cfg = require("./config")


const bot = new Telegraf(process.env.BOT_TOKEN, { telegram: { webhookReply: false }, handleTimeout: 1 })
.use((_, next) => {
  next().catch((error) => {
    return console.log(error)
  })
  return true
})
.use(new I18n({
  defaultLanguage: "en",
  directory: path.resolve(__dirname, "locales"),
  allowMissing: true,
  defaultLanguageOnMissing: "en"
}))


bot.use(Composer.groupChat(async (ctx, next) => {
  const user = await updateUser(ctx)
  const chat = await updateChat(ctx,cfg)
  if (chat.language_code !== ctx.i18n.locale()) {
    user.language_code = chat.language_code
    ctx.i18n.locale(chat.language_code)
  }
  user.save()
  chat.save()
  await next(ctx)
}))
.use(Composer.privateChat(async (ctx, next) => {
  await updateUser(ctx)
  await next(ctx)
}))
  

bot.on(cfg.ignore_updates, () => {})

bot.start(handleStart)
bot.help(handleHelp)

bot.command(["lang","language"], handleLang)
bot.action(/^set_language:(.+)$/, handleLang)

bot.filter(async ctx => ctx.chat.type !== "private")
.on("new_chat_members", async ctx => {
  ctx.message.text = "!invite"
  handleCommand(ctx)
})
.command([cfg.command.add,cfg.command.remove], handleEditCommand)
.command(cfg.command.list, handleListCommands)
.command(cfg.command.prefix, handleCommand)
.hears(/!(.+)/, handleCommand)


bot.context.db = db
db.connection.once("open", async () => {
  console.log("Connected to database")
  if (process.env.BOT_DOMAIN) {
    bot.telegram.deleteWebhook()
    bot.launch({
      webhook: {
        domain: process.env.BOT_DOMAIN,
        path: '/bot'+process.env.BOT_TOKEN,
        port: process.env.PORT || 8443,
      },
    }).then(() => console.log("Bot started webhook"))
  } else bot.launch().then(() => console.log("Bot started polling"))
})
