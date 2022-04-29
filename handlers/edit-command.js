const handleStart = require("./start")

module.exports = async ctx => {
  const chat = await ctx.db.chat.findOne({ id: ctx.chat.id })
  if (!chat || ctx.chat.type === "private") return await handleStart(ctx)
  
  const action = ctx.message.text.split(' ')[0].slice(1)
  const command = ctx.message.text.split(' ')[1]
  if (!command || ["help","invite"].includes(command)) return await ctx.replyWithHTML(ctx.i18n.t("cmd.add.error", { cmd: action }))
  const text = ctx.message.text.split(' ').slice(2).join(' ')
  .replace(/_*[]()~`>#+-=|{}.!/g, "\\$&")

  if (action === "add") {
    if (!text) return await ctx.replyWithHTML(ctx.i18n.t("cmd.add.error", { cmd: action }))
    chat.commands_response.set(command, text)
    const entities = ctx.message.entities.map(e => e.offset-6-command.length >= 0 ? {...e, offset: e.offset-6-command.length} : null)
    .filter(Boolean)

    if (ctx.message.entities) chat.commands_entities.set(command, entities)
  }
  else if (action === "rem") {
    if (!chat.commands_response.has(command)) return await ctx.replyWithHTML(ctx.i18n.t("cmd.rem.error", { cmd: action }))
    chat.commands_response.delete(command)
    chat.commands_entities.delete(command)
  }
  chat.save()
  return await ctx.replyWithHTML(
    ctx.i18n.t(`cmd.${action}.success`, { cmd: command })
  )
}
