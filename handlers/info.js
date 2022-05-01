module.exports = async (ctx) => {
  const chat = await ctx.db.chat.findOne({ id: ctx.chat.id });
  const user = await ctx.db.user.findOne({ id: ctx.from.id });
  if (!user) return;

  return await ctx.replyWithHTML(
    ctx.i18n.t("cmd.info.msg", {
      name: user.full_name,
      id: user.id,
      lang: ctx.from.language_code,
      total: chat ? user.total_messages.get(chat._id) : 0,
      total_perc: chat
        ? (
            ((user.total_messages.get(chat._id) || 0) / chat.total_messages) *
            100
          ).toFixed(2)
        : 0,
      icon: user.ping ? "🔔" : "🔕",
      ping: user.ping,
    })
  );
};
