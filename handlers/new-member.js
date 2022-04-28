module.exports = async ctx => {
  const chat = await ctx.db.chat.findOne({ id: ctx.chat.id })
  if (!chat) return

  const message = chat.commands_response.get("invite")
  const entities = (chat.commands_entities.get("invite") || [])
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

  
  
}