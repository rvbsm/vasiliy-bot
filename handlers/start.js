const { Markup } = require("telegraf")

module.exports = async ctx => {
  if (ctx.chat.type === "private") {
    await ctx.reply(
      ctx.i18n.t("cmd.start.msg.private", {
        name: ctx.from.first_name,
      }),
      Markup.inlineKeyboard([
        [
          Markup.button.url(ctx.i18n.t("cmd.start.btn.add"), `tg://resolve?domain=${ctx.botInfo.username}&startgroup`),
          Markup.button.url(ctx.i18n.t("cmd.start.btn.support"), "tg://resolve?domain=rvbsm"),
        ],
      ])
    )
  } else {
    await ctx.reply(
      ctx.i18n.t("cmd.start.msg.group", {
        name: ctx.from.first_name,
      }),
    )
  }
}