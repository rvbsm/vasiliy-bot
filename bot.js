const { Telegraf, Composer } = require("telegraf");
const I18n = require("telegraf-i18n");
const path = require("path");
const { db } = require("./database");
const { updateUser, updateChat } = require("./database/utils");
const {
  handleStart,
  handleHelp,
  handleLang,
  handleEditCommand,
  handleCommand,
  handleListCommands,
  handleEveryone,
  handlePing,
  handleInfo,
} = require("./handlers");
const cfg = require("./config");

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { webhookReply: false },
  handleTimeout: 1,
});
bot.use((ctx, next) => {
  next().catch(async (err) => {
    if (cfg.log_channel_id)
      return await bot.telegram
        .sendMessage(
          cfg.log_channel_id,
          `[<code>${ctx.from.id}</code>] ${
            ctx.message ? ctx.message.text : ctx.callbackQuery.data
          }\n\n<i>${err.toString()}</i>`,
          { parse_mode: "HTML" }
        )
        .catch((err) => console.log(err));
    else return console.log(err);
  });
  return true;
});
bot.use(
  new I18n({
    defaultLanguage: "en",
    directory: path.resolve(__dirname, "locales"),
    allowMissing: true,
    defaultLanguageOnMissing: "en",
  })
);

bot.use(
  Composer.groupChat(async (ctx, next) => {
    if (ctx.message && ctx.message.text.startsWith("/")) ctx.deleteMessage();
    const user = await updateUser(ctx);
    const chat = await updateChat(ctx, cfg);
    if (chat.language_code !== ctx.i18n.locale()) {
      user.language_code = chat.language_code;
      ctx.i18n.locale(chat.language_code);
    }
    if (!chat.users.includes(user._id)) chat.users.push(user._id);
    if (!user.total_messages.get(chat._id)) user.total_messages.set(chat._id, 1);
    else user.total_messages.set(chat._id, user.total_messages.get(chat._id) + 1);
    chat.total_messages += 1;
    user.save();
    chat.save();
    await next(ctx);
  })
);
bot.use(
  Composer.privateChat(async (ctx, next) => {
    const user = await updateUser(ctx);
    user.save();
    await next(ctx);
  })
);

bot.on(cfg.ignore_updates, () => {});

bot.start(handleStart);
bot.help(handleHelp);

bot.command(["lang", "language"], handleLang);
bot.action(/^set_language:(.+)$/, handleLang);
bot.command("info", handleInfo);
bot.command("ping", handlePing);

bot
  .filter(async (ctx) => ctx.chat.type !== "private")
  .on("new_chat_members", async (ctx) => {
    if (!ctx.message.new_chat_member.is_bot) {
      ctx.message.text = "!invite";
      handleCommand(ctx);
    }
  })
  .hears(
    [cfg.command.everyone, new RegExp(cfg.command.everyone + "(.+)")],
    handleEveryone
  )

  .command([cfg.command.add, cfg.command.remove], handleEditCommand)
  .command(cfg.command.list, handleListCommands)
  //// .command(cfg.command.prefix, handleCommand)
  .hears(/!(.+)/, handleCommand);

bot.context.db = db;
db.connection.once("open", async () => {
  console.log("Connected to database");
  if (process.env.BOT_DOMAIN) {
    bot
      .launch({
        webhook: {
          domain: process.env.BOT_DOMAIN,
          hookPath: "/bot" + process.env.BOT_TOKEN,
          port: process.env.PORT || 8443,
          dropPendingUpdates: true
        },
      })
      .then(() => console.log("Bot started webhook"));
  } else bot.launch({ dropPendingUpdates: true }).then(() => console.log("Bot started polling"));
});
