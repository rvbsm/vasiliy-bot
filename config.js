module.exports = {
  command: {
    add: "add",
    remove: "rem",
    list: "list",
    everyone: "@everyone",
  },
  ignore_updates: [
    "channel_post",
    "edited_channel_post",
    "poll",
    "chat_join_request",
  ],
  log_channel_id: process.env.LOG_CHANNEL_ID,
  emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "❤️‍🔥", "❤️‍🩹"],
};
