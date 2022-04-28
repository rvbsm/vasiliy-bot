module.exports = async ctx => {
  let user = await ctx.db.user.findOne({ id: ctx.from.id })

  if (!user) {
    user = new ctx.db.user()
    user.id = ctx.from.id
    user.language_code = ctx.from.language_code
  }
  user.first_name = ctx.from.first_name
  user.last_name = ctx.from.last_name
  user.full_name = `${ctx.from.first_name}${ctx.from.last_name ? ` ${ctx.from.last_name}` : ''}`
  user.username = ctx.from.username
  user.updatedAt = new Date()

  return user
}
