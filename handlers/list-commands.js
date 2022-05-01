module.exports = async (ctx) => {
  let message = ctx.i18n.t("cmd.list.msg") + "\n";
  const chat = await ctx.db.chat.findOne({ chat_id: ctx.chat.id });
  if (!chat) return;
  Array.from(chat.commands_response.keys()).forEach(
    (key) =>
      (message += !["help", "invite"].includes(key) ? `\n\`\\!${key}\`` : "")
  );

  if (message.match(/\n/g).length <= 1)
    return await ctx.reply(ctx.i18n.t("cmd.list.empty"));
  return await ctx.replyWithMarkdownV2(message, {
    reply_to_message_id: ctx.message.message_id,
  });
};
