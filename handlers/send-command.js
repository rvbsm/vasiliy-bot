module.exports = async ctx => {
  const vars = {
    first_name : ctx.message.new_chat_participant ? ctx.message.new_chat_participant.first_name : ctx.from.first_name,
    last_name : ctx.message.new_chat_participant ? ctx.message.new_chat_participant.last_name || "" : ctx.from.last_name || "",
    username : ctx.message.new_chat_participant ? ctx.message.new_chat_participant.username || "" : ctx.from.username || "",
    id : ctx.message.new_chat_participant ? ctx.message.new_chat_participant.id : ctx.from.id,
    args : ctx.message.text.split(' ').slice(1) || [],
  }

  const chat = await ctx.db.chat.findOne({ id: ctx.chat.id })
  if (!chat) return
  let n = 0
  const command = ctx.message.text.split(' ')[0].slice(1)
  const message = chat.commands_response.get(command)
  const entities = (chat.commands_entities.get(command) || [])
  .map((e,idx,arr) => {
    let markdown = message.slice(e.offset, e.offset+e.length)
    let result = e
    if (markdown.includes('$')) {
      markdown = markdown.replace(/\$(\w+)/g, (_,name) => vars[name] || '$' + name)
      result = { ...result, length: markdown.length }
    }
    result = {...result, offset: e.offset+n}
    n += e.offset !== (arr[idx+1] || { offset: -1 }).offset ? markdown.length-e.length : 0
    return result
  })
  if (!message) return
  
  return await ctx.reply(message.replace(/\$(\w+)/g, (_, name) => vars[name] || '$' + name), {reply_to_message_id: ctx.message.message_id, entities: entities})
}
