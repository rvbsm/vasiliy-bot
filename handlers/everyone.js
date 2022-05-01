module.exports = async (ctx) => {
  let admins = (await ctx.tg.getChatAdministrators(ctx.chat.id)).map(
    (admin) => admin.user.id
  );
  if (!admins.includes(ctx.from.id)) return;

  const chat = await ctx.db.chat.findOne({ id: ctx.chat.id });
  if (!chat || !chat.users) return;

  let message = ctx.message.text.split(" ").slice(1);
  message = message.length ? message.join(" ") : ctx.i18n.t("cmd.everyone.msg");
  let entities = new Array();

  chat.users.forEach(async (_id, idx) => {
    let user = await ctx.db.user.findOne({ _id: _id });
    if (user && user.ping) {
      entities[idx % 5] = {
        offset: message.length,
        length: 1,
        type: "text_link",
        url: `tg://user?id=${user.id}`,
      };
      message += "‎"; // emojis[Math.floor(Math.random() * emojis.length)];
    }

    // if ((idx + 1) % 5 == 0 || idx == chat.users.length - 1) {
    await ctx.reply(message, { entities: entities });
    //   message = (ctx.message.text.split(' ').slice(1)).join(' ') || "созыв";
    //   entities = new Array();
    // }
  });
};
