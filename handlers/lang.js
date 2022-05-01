const fs = require("fs");
const path = require("path");
const { Markup } = require("telegraf");
const I18n = require("telegraf-i18n");
const handleStart = require("./start");

const i18n = new I18n({
  defaultLanguage: "en",
  directory: path.resolve(__dirname, "../locales"),
  allowMissing: true,
  defaultLanguageOnMissing: "en",
});

module.exports = async (ctx) => {
  const localesFile = fs.readdirSync("./locales/");
  const locales = new Object();
  localesFile.forEach((fileName) => {
    const localName = fileName.split(".")[0];
    if (
      localName === "en" ||
      i18n.t("en", "language_name") !== i18n.t(localName, "language_name")
    ) {
      locales[localName] = {
        flag: i18n.t(localName, "language_name"),
      };
    }
  });

  if (ctx.updateType === "callback_query") {
    ctx.deleteMessage();
    if (locales[ctx.match[1]]) {
      ctx.answerCbQuery(locales[ctx.match[1]].flag);
      await ctx.db.user.updateOne(
        { id: ctx.from.id },
        { $set: { language_code: ctx.match[1] } }
      );

      if (ctx.update.callback_query.message.chat.type !== "private")
        await ctx.db.chat.updateOne(
          { id: ctx.chat.id },
          { $set: { language_code: ctx.match[1] } }
        );
      ctx.i18n.locale(ctx.match[1]);
      await handleStart(ctx);
    }
  } else {
    const button = [];

    Object.keys(locales).map((key) => {
      button.push(
        Markup.button.callback(locales[key].flag, `set_language:${key}`)
      );
    });

    await ctx.reply(
      "🇷🇺 Выберите язык | 🇺🇸 Choose language",
      Markup.inlineKeyboard(button, { columns: 2 })
    );
  }
};
