module.exports = async (ctx, cfg) => {
  let chat = await ctx.db.chat.findOne({ id: ctx.chat.id });

  if (!chat) {
    chat = new ctx.db.chat();
    chat.id = ctx.chat.id;
    chat.language_code = ctx.from.language_code;
    chat.commands_response = new Map([
      [
        "help",
        ctx.i18n.t("cmd.help.msg", {
          add: cfg.command.add,
          rem: cfg.command.rem,
          list: cfg.command.list,
        }),
      ],
      ["invite", ctx.i18n.t("cmd.invite.msg")],
    ]);
    chat.commands_entities = new Map();
    // chat.config = new Map();
    chat.users = new Array();
  }
  chat.title = ctx.chat.title;
  chat.username = ctx.chat.username ? ctx.chat.username : "";
  chat.type = ctx.chat.type;
  chat.updatedAt = new Date();

  return chat;
};
