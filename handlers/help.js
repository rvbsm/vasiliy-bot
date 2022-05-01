const cfg = require("../config");

module.exports = async (ctx) => {
  if (ctx.chat.type === "private")
    return await ctx.replyWithMarkdownV2(
      ctx.i18n.t("cmd.help.msg", {
        add: cfg.command.add,
        rem: cfg.command.rem,
        list: cfg.command.list,
      })
    );
  else {
    const chat = await ctx.db.chat.findOne({ id: ctx.chat.id });
    if (!chat) return;
    if (ctx.message.text.split(" ")[1] === "default") {
      chat.commands_response.set(
        "help",
        ctx.i18n.t("cmd.help.msg", {
          add: cfg.command.add,
          rem: cfg.command.rem,
          list: cfg.command.list,
        })
      );
      chat.commands_entities.set("help", []);
      chat.save();
    }

    const help = chat.commands_response.get("help");
    const help_entities = chat.commands_entities.get("help");
    return await ctx.reply(help, { entities: help_entities });
  }
};
