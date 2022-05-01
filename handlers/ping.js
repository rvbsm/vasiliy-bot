module.exports = async (ctx) => {
  const user = await ctx.db.user.findOne({ id: ctx.from.id });
  if (!user) return;

  user.ping = !user.ping;
  user.save();
  return await ctx.replyWithHTML(
    ctx.i18n.t("cmd.ping.msg", {
      id: user.id,
      ping: user.ping ? "true" : "false",
    })
  );
};
